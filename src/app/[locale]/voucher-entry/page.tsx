'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { branchService } from '@/services/branchService';
import { chartOfAccountsService } from '@/services/chartOfAccountsService';
import { costCentersService } from '@/services/costCentersService';
import { currencyService } from '@/services/currencyService';
import { departmentService } from '@/services/departmentService';
import { financialYearService } from '@/services/financialYearService';
import { voucherService } from '@/services/voucherService';
import { voucherTypeService } from '@/services/voucherTypeService';
import { IAccVoucherDetailChildCreate, IVoucherLineFormState } from '@/types/voucher';
import { IVoucherType } from '@/types/voucherType';
import {
  ClearOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

// Simple unique key generator (no uuid dependency needed)
const useKeyGenerator = () => {
  const counter = useRef(0);
  return () => `line-${++counter.current}-${Date.now()}`;
};

/**
 * Flatten a tree to only return leaf nodes (nodes with no children).
 */
const getLeafNodes = (items: any[]): any[] => {
  const leaves: any[] = [];
  const traverse = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      } else {
        leaves.push(node);
      }
    }
  };
  traverse(items);
  return leaves;
};

const { Text } = Typography;
const { TextArea } = Input;

export default function VoucherEntryPage() {
  // ============ Key Generator ============
  const generateKey = useKeyGenerator();

  // ============ State ============
  const [voucherTypes, setVoucherTypes] = useState<IVoucherType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [voucherNo, setVoucherNo] = useState('');
  const [voucherDate, setVoucherDate] = useState(dayjs());
  const [narration, setNarration] = useState('');
  const [branchId, setBranchId] = useState<number | undefined>();
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [financialYearId, setFinancialYearId] = useState<number | undefined>();

  const [lines, setLines] = useState<IVoucherLineFormState[]>([]);
  const [editingLineKey, setEditingLineKey] = useState<string | null>(null);

  // Dropdown data
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [financialYears, setFinancialYears] = useState<any[]>([]);
  const [ledgerAccounts, setLedgerAccounts] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<any>(null);
  const [exchangeRates, setExchangeRates] = useState<Record<number, number>>({}); // currencyId -> rate

  // Line form
  const [lineForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Child modal
  const [childModalVisible, setChildModalVisible] = useState(false);
  const [childLineKey, setChildLineKey] = useState<string | null>(null);
  const [childForm] = Form.useForm();
  const [childEntries, setChildEntries] = useState<
    (IAccVoucherDetailChildCreate & { _key: string })[]
  >([]);

  // ============ Load dropdown data ============
  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    setLoading(true);
    try {
      const [vtRes, brRes, fyRes, coaRes, ccRes, curRes] = await Promise.all([
        voucherTypeService.getAll(),
        branchService.getBranches({ limit: 100 }),
        financialYearService.getAll(),
        chartOfAccountsService.getTree(),
        costCentersService.getTree(),
        currencyService.getCurrencies({ limit: 100 }),
      ]);

      setVoucherTypes(vtRes.data.items);
      setBranches(brRes.data.items);

      // Financial years: show yearName, auto-select first non-closed
      const fyItems = fyRes.data.items;
      setFinancialYears(fyItems);
      const openFY = fyItems.find((fy: any) => fy.isClosed === 0);
      if (openFY) setFinancialYearId(openFY.id);

      // Ledger: only leaf accounts (no children = selectable)
      const coaTree = coaRes.data;
      const leafAccounts = getLeafNodes(coaTree);
      setLedgerAccounts(leafAccounts);

      // Cost Centers: only leaf nodes
      const ccTree = ccRes.data;
      const leafCostCenters = getLeafNodes(ccTree);
      setCostCenters(leafCostCenters);

      const curItems = curRes.data.items;
      setCurrencies(curItems);
      const defCur = curItems.find((c: any) => c.isDefault);
      setDefaultCurrency(defCur);

      // Fetch exchange rates for today
      await loadExchangeRates(dayjs().format('YYYY-MM-DD'));

      // Auto-select first voucher type
      if (vtRes.data.items.length > 0) {
        handleTypeSelect(vtRes.data.items[0].id);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  // ============ Load exchange rates from API ============
  const loadExchangeRates = async (date: string) => {
    try {
      const res = await currencyService.getExchangeRates(date, { limit: 100 });
      const rateMap: Record<number, number> = {};
      for (const er of res.data.items) {
        if (er.currency) {
          rateMap[er.currency.id] = Number(er.rate);
        }
      }
      setExchangeRates(rateMap);
    } catch {
      console.warn('Could not load exchange rates');
    }
  };

  // ============ Load departments when branch changes ============
  useEffect(() => {
    if (branchId) {
      loadDepartments(branchId);
    } else {
      setDepartments([]);
      setDepartmentId(undefined);
    }
  }, [branchId]);

  const loadDepartments = async (bId: number) => {
    try {
      const res = await departmentService.getDepartments({ branchId: bId, limit: 100 });
      setDepartments(res.data.items);
    } catch {
      setDepartments([]);
    }
  };

  // Reload exchange rates when voucher date changes
  useEffect(() => {
    if (voucherDate) {
      loadExchangeRates(voucherDate.format('YYYY-MM-DD'));
    }
  }, [voucherDate]);

  // ============ Voucher Type Selection ============
  const handleTypeSelect = async (typeId: number) => {
    setSelectedTypeId(typeId);
    try {
      const res = await voucherService.getNextNumber(typeId);
      setVoucherNo(res.data.voucherNo);
    } catch {
      message.error('Failed to generate voucher number');
    }
  };

  // ============ Auto-fill exchange rate when currency changes ============
  const handleCurrencyChange = (currencyId: number) => {
    if (currencyId && defaultCurrency && currencyId !== defaultCurrency.id) {
      const rate = exchangeRates[currencyId];
      if (rate) {
        lineForm.setFieldsValue({ currRate: rate });
      } else {
        lineForm.setFieldsValue({ currRate: undefined });
        message.warning(
          'No exchange rate found for this currency. Please set it in the Exchange Rates module first.',
        );
      }
    } else {
      lineForm.setFieldsValue({ currRate: undefined });
    }
  };

  // ============ Build line from form values ============
  const buildLineFromForm = (
    values: any,
    key: string,
    children: IAccVoucherDetailChildCreate[] = [],
  ): IVoucherLineFormState => {
    const trType = values.trType as 'DR' | 'CR';
    const amount = values.currAmount || 0;
    const rate = values.currRate || 0;
    const calculatedAmount = amount * rate;

    const account = ledgerAccounts.find((a: any) => a.id === values.chartOfAccountId);
    const cc = costCenters.find((c: any) => c.id === values.costCenterId);
    const cur = currencies.find((c: any) => c.id === values.currencyId);

    return {
      key,
      trType,
      chartOfAccountId: values.chartOfAccountId,
      chartOfAccountName: account ? `${account.accountCode} - ${account.accountName}` : '',
      currencyId: values.currencyId,
      currencyCode: cur?.code,
      currAmount: amount,
      currRate: rate,
      debitAmount: trType === 'DR' ? calculatedAmount : 0,
      creditAmount: trType === 'CR' ? calculatedAmount : 0,
      lineNarration: values.lineNarration,
      costCenterId: values.costCenterId,
      costCenterName: cc?.costName || cc?.name,
      chequeNo: values.chequeNo,
      chequeDate: values.chequeDate,
      bankName: values.bankName,
      bankAccno: values.bankAccno,
      children,
    };
  };

  const resetLineForm = () => {
    lineForm.resetFields();
    lineForm.setFieldsValue({ trType: 'DR', currRate: undefined, currencyId: defaultCurrency?.id });
  };

  // ============ Add New Line ============
  const handleAddLine = async () => {
    try {
      const values = await lineForm.validateFields();
      const newLine = buildLineFromForm(values, generateKey());
      setLines((prev) => [...prev, newLine]);
      setEditingLineKey(null);
      resetLineForm();
    } catch {
      // validation error
    }
  };

  // ============ Update Selected Line ============
  const handleUpdateLine = async () => {
    if (!editingLineKey) return;
    try {
      const values = await lineForm.validateFields();
      const existingChildren = lines.find((l) => l.key === editingLineKey)?.children || [];
      const updatedLine = buildLineFromForm(values, editingLineKey, existingChildren);
      setLines((prev) => prev.map((l) => (l.key === editingLineKey ? updatedLine : l)));
      setEditingLineKey(null);
      resetLineForm();
    } catch {
      // validation error
    }
  };

  // ============ Row Click → Load into form ============
  const handleRowClick = (line: IVoucherLineFormState) => {
    setEditingLineKey(line.key);
    lineForm.setFieldsValue({
      trType: line.trType,
      chartOfAccountId: line.chartOfAccountId,
      currencyId: line.currencyId,
      currAmount: line.currAmount,
      currRate: line.currRate,
      lineNarration: line.lineNarration,
      costCenterId: line.costCenterId,
      chequeNo: line.chequeNo,
      chequeDate: line.chequeDate ? dayjs(line.chequeDate) : undefined,
      bankName: line.bankName,
      bankAccno: line.bankAccno,
    });
  };

  // ============ Cancel Selection ============
  const handleCancelEdit = () => {
    setEditingLineKey(null);
    resetLineForm();
  };

  const handleDeleteLine = (key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  };

  // ============ Child Sub-allocation ============
  const openChildModal = (lineKey: string) => {
    setChildLineKey(lineKey);
    const line = lines.find((l) => l.key === lineKey);
    setChildEntries((line?.children || []).map((c) => ({ ...c, _key: generateKey() })));
    setChildModalVisible(true);
  };

  const handleAddChild = async () => {
    try {
      const values = await childForm.validateFields();
      // auto-calc amountBase if not set
      const rate = values.rate || 0;
      const amount = values.amount || 0;
      const amountBase = amount * rate;
      setChildEntries((prev) => [...prev, { ...values, amountBase, _key: generateKey() }]);
      childForm.resetFields();
    } catch {
      // validation error
    }
  };

  const handleDeleteChild = (key: string) => {
    setChildEntries((prev) => prev.filter((c) => c._key !== key));
  };

  const handleSaveChildren = () => {
    if (childLineKey) {
      setLines((prev) =>
        prev.map((l) =>
          l.key === childLineKey
            ? { ...l, children: childEntries.map(({ _key, ...rest }) => rest) }
            : l,
        ),
      );
    }
    setChildModalVisible(false);
    setChildLineKey(null);
    setChildEntries([]);
  };

  // ============ Totals (rate * amount) ============
  const totalDebit = lines.reduce((sum, l) => sum + l.debitAmount, 0);
  const totalCredit = lines.reduce((sum, l) => sum + l.creditAmount, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  // ============ Save Voucher ============
  const handleSave = async () => {
    if (!selectedTypeId) {
      message.error('Please select a voucher type');
      return;
    }
    if (lines.length === 0) {
      message.error('Please add at least one line');
      return;
    }
    if (!isBalanced) {
      message.error(
        `Voucher is not balanced. DR: ${totalDebit.toFixed(2)}, CR: ${totalCredit.toFixed(2)}`,
      );
      return;
    }
    if (!financialYearId) {
      message.error('Please select a financial year');
      return;
    }
    if (!branchId) {
      message.error('Please select a branch');
      return;
    }

    setSaving(true);
    try {
      // Strip null/undefined so class-validator doesn't reject them
      const cleanObj = (obj: Record<string, any>) =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));

      await voucherService.create({
        voucherNo,
        voucherTypeId: selectedTypeId,
        voucherDate: voucherDate.format('YYYY-MM-DD'),
        narration: narration || undefined,
        financialYearId,
        branchId,
        departmentId: departmentId || undefined,
        details: lines.map((l) =>
          cleanObj({
            chartOfAccountId: l.chartOfAccountId,
            currencyId: l.currencyId,
            currencyExRate: l.currRate,
            debitAmount: l.debitAmount,
            creditAmount: l.creditAmount,
            lineNarration: l.lineNarration,
            costCenterId: l.costCenterId,
            chequeNo: l.chequeNo,
            chequeDate: l.chequeDate,
            bankName: l.bankName,
            bankAccno: l.bankAccno,
            children: (l.children || []).map((c: any) =>
              cleanObj({
                refType: c.refType,
                refId: c.refId,
                billNo: c.billNo,
                amount: c.amount,
                amountBase: c.amountBase,
                rate: c.rate,
                currencyId: c.currencyId,
                costCenterId: c.costCenterId,
                remarks: c.remarks,
              }),
            ),
          }),
        ),
      } as any);
      message.success('Voucher saved successfully');
      handleClear();
      handleTypeSelect(selectedTypeId);
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Failed to save voucher');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setLines([]);
    setNarration('');
    setVoucherDate(dayjs());
    lineForm.resetFields();
    lineForm.setFieldsValue({ trType: 'DR', currRate: 1, currencyId: defaultCurrency?.id });
  };

  // ============ Lines Table Columns ============
  const lineColumns = [
    {
      title: 'TR',
      dataIndex: 'trType',
      key: 'trType',
      width: 60,
      render: (tr: string) => <Tag color={tr === 'DR' ? 'blue' : 'green'}>{tr}</Tag>,
    },
    {
      title: 'Ledger',
      dataIndex: 'chartOfAccountName',
      key: 'chartOfAccountName',
      ellipsis: true,
    },
    {
      title: 'Debit',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
      width: 120,
      align: 'right' as const,
      render: (v: number) => (v > 0 ? v.toFixed(2) : ''),
    },
    {
      title: 'Credit',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      width: 120,
      align: 'right' as const,
      render: (v: number) => (v > 0 ? v.toFixed(2) : ''),
    },
    {
      title: 'Currency',
      dataIndex: 'currencyCode',
      key: 'currencyCode',
      width: 80,
    },
    {
      title: 'Curr Amt',
      dataIndex: 'currAmount',
      key: 'currAmount',
      width: 100,
      align: 'right' as const,
      render: (v: number) => (v ? v.toFixed(2) : ''),
    },
    {
      title: 'Rate',
      dataIndex: 'currRate',
      key: 'currRate',
      width: 80,
      align: 'right' as const,
      render: (v: number) => (v ? v.toFixed(4) : ''),
    },
    {
      title: 'Cost Center',
      dataIndex: 'costCenterName',
      key: 'costCenterName',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Remarks',
      dataIndex: 'lineNarration',
      key: 'lineNarration',
      width: 150,
      ellipsis: true,
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: IVoucherLineFormState) => (
        <Space size="small">
          <Tooltip title="Sub-entries">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                openChildModal(record.key);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteLine(record.key);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ============ Render ============
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-6" style={{ display: 'flex', gap: 16 }}>
          {/* ===== Left Sidebar: Voucher Types ===== */}
          <Card
            title="Voucher Type"
            style={{ width: 200, flexShrink: 0 }}
            styles={{ body: { padding: 0 } }}
            loading={loading}
          >
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {voucherTypes.map((vt) => (
                <div
                  key={vt.id}
                  onClick={() => handleTypeSelect(vt.id)}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    background: selectedTypeId === vt.id ? '#1890ff' : 'transparent',
                    color: selectedTypeId === vt.id ? '#fff' : 'inherit',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'all 0.2s',
                  }}
                >
                  <Text style={{ color: selectedTypeId === vt.id ? '#fff' : 'inherit' }}>
                    {vt.name}
                  </Text>
                </div>
              ))}
            </div>
          </Card>

          {/* ===== Main Content ===== */}
          <div style={{ flex: 1 }}>
            <Card
              title={
                <Space>
                  <Text strong style={{ fontSize: 18 }}>
                    {voucherTypes.find((vt) => vt.id === selectedTypeId)?.name || 'Voucher Entry'}
                  </Text>
                  <Tag color="blue">{voucherNo}</Tag>
                </Space>
              }
              extra={
                <Space>
                  <Button icon={<ClearOutlined />} onClick={handleClear}>
                    Clear
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={saving}
                    disabled={!isBalanced || lines.length === 0}
                  >
                    Save
                  </Button>
                </Space>
              }
            >
              {/* ===== Header Form ===== */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={4}>
                  <label>Voucher No</label>
                  <Input value={voucherNo} disabled />
                </Col>
                <Col span={4}>
                  <label>Voucher Date</label>
                  <DatePicker
                    value={voucherDate}
                    onChange={(d) => d && setVoucherDate(d)}
                    style={{ width: '100%' }}
                    allowClear={false}
                  />
                </Col>
                <Col span={4}>
                  <label>Financial Year</label>
                  <Select
                    value={financialYearId}
                    onChange={setFinancialYearId}
                    style={{ width: '100%' }}
                    placeholder="Select"
                    options={financialYears.map((fy: any) => ({
                      label: fy.yearName,
                      value: fy.id,
                    }))}
                  />
                </Col>
                <Col span={4}>
                  <label>Branch</label>
                  <Select
                    value={branchId}
                    onChange={(val) => {
                      setBranchId(val);
                      setDepartmentId(undefined); // reset department
                    }}
                    style={{ width: '100%' }}
                    placeholder="Select"
                    options={branches.map((b: any) => ({
                      label: b.name,
                      value: b.id,
                    }))}
                  />
                </Col>
                <Col span={4}>
                  <label>Department</label>
                  <Select
                    value={departmentId}
                    onChange={setDepartmentId}
                    style={{ width: '100%' }}
                    placeholder={branchId ? 'Select' : 'Select branch first'}
                    disabled={!branchId}
                    allowClear
                    options={departments.map((d: any) => ({
                      label: d.name,
                      value: d.id,
                    }))}
                  />
                </Col>
              </Row>

              {/* ===== Line Entry Form ===== */}
              <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
                <Form
                  form={lineForm}
                  layout="vertical"
                  initialValues={{ trType: 'DR', currencyId: defaultCurrency?.id }}
                >
                  <Row gutter={8}>
                    <Col span={2}>
                      <Form.Item name="trType" label="TR" rules={[{ required: true }]}>
                        <Select suffixIcon={<DownOutlined />}>
                          <Select.Option value="DR">DR</Select.Option>
                          <Select.Option value="CR">CR</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="chartOfAccountId"
                        label="Ledger"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Select
                          showSearch
                          placeholder="Search account..."
                          optionFilterProp="label"
                          options={ledgerAccounts.map((a: any) => ({
                            label: `${a.accountCode} - ${a.accountName}`,
                            value: a.id,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="currencyId" label="Currency">
                        <Select
                          placeholder="Currency"
                          allowClear
                          onChange={handleCurrencyChange}
                          options={currencies.map((c: any) => ({
                            label: `${c.code} - ${c.name}`,
                            value: c.id,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        name="currAmount"
                        label="Amount"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          precision={2}
                          controls={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        name="currRate"
                        label="Rate"
                        rules={[{ required: true, message: 'Rate required' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          step={0.0001}
                          precision={4}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="costCenterId" label="Cost Center">
                        <Select
                          showSearch
                          placeholder="Select"
                          allowClear
                          optionFilterProp="label"
                          options={costCenters.map((c: any) => ({
                            label: c.costName || c.name,
                            value: c.id,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="lineNarration" label="Remarks">
                        <Input placeholder="Remarks" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* ===== Second Row: Cheque & Bank Details ===== */}
                  <Row gutter={8}>
                    <Col span={4}>
                      <Form.Item name="chequeNo" label="Cheque No">
                        <Input placeholder="Cheque No" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="chequeDate" label="Cheque Date">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="bankName" label="Bank Name">
                        <Input placeholder="Bank Name" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="bankAccno" label="Bank Acc No">
                        <Input placeholder="Account No" />
                      </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      <Form.Item>
                        <Space size="small">
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddLine}>
                            Add
                          </Button>
                          {editingLineKey && (
                            <>
                              <Button
                                type="primary"
                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                icon={<EditOutlined />}
                                onClick={handleUpdateLine}
                              >
                                Update
                              </Button>
                              <Button onClick={handleCancelEdit}>Cancel</Button>
                            </>
                          )}
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>

              {/* ===== Lines Table ===== */}
              <Table
                columns={lineColumns}
                dataSource={lines}
                rowKey="key"
                size="small"
                pagination={false}
                scroll={{ y: 300 }}
                style={{ marginBottom: 16 }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  style: {
                    cursor: 'pointer',
                    background: editingLineKey === record.key ? '#e6f7ff' : undefined,
                  },
                })}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2}>
                        <Text strong>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Text strong style={{ color: '#1890ff' }}>
                          {totalDebit.toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        <Text strong style={{ color: '#52c41a' }}>
                          {totalCredit.toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} colSpan={6}>
                        {isBalanced ? (
                          <Tag color="success">Balanced</Tag>
                        ) : (
                          <Tag color="error">
                            Not Balanced (Diff: {Math.abs(totalDebit - totalCredit).toFixed(2)})
                          </Tag>
                        )}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />

              {/* ===== Narration ===== */}
              <div>
                <label>
                  <Text strong>Narration</Text>
                </label>
                <TextArea
                  rows={2}
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Enter voucher narration..."
                  style={{ marginTop: 4 }}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* ===== Child Sub-Allocation Modal ===== */}
        <Modal
          title="Sub-Allocations (Bill/Advance)"
          open={childModalVisible}
          onOk={handleSaveChildren}
          onCancel={() => setChildModalVisible(false)}
          width={900}
          okText="Save"
        >
          <Form form={childForm} layout="vertical" style={{ marginBottom: 16 }}>
            <Row gutter={8}>
              <Col span={4}>
                <Form.Item name="refType" label="Type" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value={1}>Bill</Select.Option>
                    <Select.Option value={2}>Advance</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="refId" label="Ref ID">
                  <InputNumber style={{ width: '100%' }} min={0} controls={false} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="billNo" label="Bill No">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="costCenterId" label="Cost Center">
                  <Select
                    showSearch
                    placeholder="Select"
                    allowClear
                    optionFilterProp="label"
                    options={costCenters.map((c: any) => ({
                      label: c.costName || c.name,
                      value: c.id,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={3}>
                <Form.Item label={`Base (${defaultCurrency?.code || 'N/A'})`}>
                  <Input value={defaultCurrency?.code || ''} disabled />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="currencyId" label="Currency">
                  <Select
                    placeholder="Currency"
                    allowClear
                    options={currencies.map((c: any) => ({
                      label: `${c.code} - ${c.name}`,
                      value: c.id,
                    }))}
                    onChange={(currencyId: number) => {
                      if (currencyId && defaultCurrency && currencyId !== defaultCurrency.id) {
                        const rate = exchangeRates[currencyId];
                        if (rate) {
                          childForm.setFieldsValue({ rate });
                        } else {
                          childForm.setFieldsValue({ rate: undefined });
                          message.warning(
                            'No exchange rate found for this currency. Please set it in the Exchange Rates module first.',
                          );
                        }
                      } else {
                        childForm.setFieldsValue({ rate: undefined });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item
                  name="rate"
                  label="Rate"
                  rules={[{ required: true, message: 'Rate required' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.0001}
                    precision={6}
                    controls={false}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} min={0} precision={2} controls={false} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Base Amount">
                  <InputNumber
                    style={{ width: '100%' }}
                    value={(() => {
                      const amt = childForm.getFieldValue('amount') || 0;
                      const r = childForm.getFieldValue('rate') || 0;
                      return amt * r;
                    })()}
                    precision={4}
                    controls={false}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item name="remarks" label="Remarks">
                  <Input placeholder="Remarks" />
                </Form.Item>
              </Col>
              <Col span={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Form.Item>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddChild}>
                    Add
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Table
            dataSource={childEntries}
            rowKey="_key"
            size="small"
            pagination={false}
            columns={[
              {
                title: 'Type',
                dataIndex: 'refType',
                render: (v: number) => (v === 1 ? 'Bill' : 'Advance'),
                width: 80,
              },
              { title: 'Bill No', dataIndex: 'billNo', width: 80 },
              {
                title: 'Amount',
                dataIndex: 'amount',
                width: 100,
                align: 'right' as const,
                render: (v: number) => v?.toFixed(2),
              },
              {
                title: 'Cost Center',
                dataIndex: 'costCenterId',
                width: 80,
                render: (v: number) =>
                  costCenters.find((c: any) => c.id === v)?.costName || v || '',
              },
              {
                title: 'Currency',
                dataIndex: 'currencyId',
                width: 70,
                render: (v: number) => currencies.find((c: any) => c.id === v)?.code || '',
              },
              {
                title: 'Rate',
                dataIndex: 'rate',
                width: 70,
                align: 'right' as const,
                render: (v: number) => (v ? v.toFixed(4) : ''),
              },
              {
                title: 'Base Amt',
                dataIndex: 'amountBase',
                width: 90,
                align: 'right' as const,
                render: (v: number) => (v ? v.toFixed(2) : ''),
              },
              { title: 'Remarks', dataIndex: 'remarks', ellipsis: true },
              {
                title: '',
                width: 50,
                render: (_: any, record: any) => (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteChild(record._key)}
                  />
                ),
              },
            ]}
          />
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
