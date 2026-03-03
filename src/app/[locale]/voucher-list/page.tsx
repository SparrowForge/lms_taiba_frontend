'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { branchService } from '@/services/branchService';
import { chartOfAccountsService } from '@/services/chartOfAccountsService';
import { costCentersService } from '@/services/costCentersService';
import { departmentService } from '@/services/departmentService';
import { financialYearService } from '@/services/financialYearService';
import { voucherService } from '@/services/voucherService';
import { voucherTypeService } from '@/services/voucherTypeService';
import { IAccVoucher } from '@/types/voucher';
import { IVoucherType } from '@/types/voucherType';
import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
const { Title } = Typography;

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

export default function VoucherListPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const [filterForm] = Form.useForm();

  // ============ State ============
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState<IAccVoucher[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVoucher, setSelectedVoucher] = useState<IAccVoucher | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Dropdown data
  const [voucherTypes, setVoucherTypes] = useState<IVoucherType[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [financialYears, setFinancialYears] = useState<any[]>([]);
  const [ledgerAccounts, setLedgerAccounts] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);

  // ============ Load Initial Data ============
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [vtRes, bRes, fyRes, ccRes, coaRes] = await Promise.all([
          voucherTypeService.getAll(),
          branchService.getBranches({ page: 1, limit: 100 }),
          financialYearService.getAll(),
          costCentersService.getTree(),
          chartOfAccountsService.getTree(),
        ]);

        setVoucherTypes(vtRes.data.items || []);
        setBranches(bRes.data.items || []);
        setFinancialYears(fyRes.data.items || []);
        setCostCenters(ccRes.data || []);
        setLedgerAccounts(getLeafNodes(coaRes.data || []));
      } catch (error) {
        console.error('Failed to load initial data', error);
        toast.error(t(LOCALE_KEYS.FAILED_LOAD_DATA));
      }
    };

    fetchInitialData();
  }, [t]);

  // Load departments when branch changes in filter
  const handleBranchChange = async (branchId: number) => {
    filterForm.setFieldsValue({ departmentId: undefined });
    if (branchId) {
      try {
        const res = await departmentService.getDepartments({ page: 1, limit: 100, branchId });
        setDepartments(res.data.items || []);
      } catch (error) {
        console.error('Failed to load departments', error);
      }
    } else {
      setDepartments([]);
    }
  };

  // ============ Load Vouchers ============
  const loadVouchers = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    try {
      const filters = filterForm.getFieldsValue();
      const params: any = {
        page,
        limit,
        voucherTypeId: filters.voucherTypeId,
        financialYearId: filters.financialYearId,
        branchId: filters.branchId,
        departmentId: filters.departmentId,
        chartOfAccountId: filters.chartOfAccountId,
        costCenterId: filters.costCenterId,
        voucherNo: filters.voucherNo,
        isPosted: filters.isPosted,
      };

      if (filters.dateRange && filters.dateRange.length === 2) {
        params.dateFrom = filters.dateRange[0].format('YYYY-MM-DD');
        params.dateTo = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const result = await voucherService.getAll(params);
      setVouchers(result.data.items);
      setTotal(result.data.meta.total);
    } catch (error) {
      console.error('Failed to load vouchers', error);
      toast.error(t(LOCALE_KEYS.FAILED_LOAD_DATA));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    loadVouchers(1, pageSize);
  };

  const handleReset = () => {
    filterForm.resetFields();
    setCurrentPage(1);
    loadVouchers(1, pageSize);
  };

  const handleViewVoucher = (voucher: IAccVoucher) => {
    setSelectedVoucher(voucher);
    setIsDetailModalVisible(true);
  };

  const handleTogglePost = async (checked: boolean) => {
    if (!selectedVoucher) return;

    setUpdatingStatus(true);
    try {
      const status = checked ? 1 : 0;
      await voucherService.update(selectedVoucher.id, { isPosted: status });
      toast.success(t(LOCALE_KEYS.SUCCESS_OPERATION));

      // Update local state and list
      setSelectedVoucher({ ...selectedVoucher, isPosted: status });
      loadVouchers(currentPage, pageSize);
    } catch (error) {
      toast.error(t(LOCALE_KEYS.ACTION_FAILED));
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ============ Columns ============
  const columns: ColumnsType<IAccVoucher> = [
    {
      title: t(LOCALE_KEYS.VOUCHER_NO),
      dataIndex: 'voucherNo',
      key: 'voucherNo',
      render: (text) => <span className="font-semibold text-blue-600">{text}</span>,
    },
    {
      title: t(LOCALE_KEYS.VOUCHER_DATE),
      dataIndex: 'voucherDate',
      key: 'voucherDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: t(LOCALE_KEYS.TYPE),
      dataIndex: ['voucherType', 'name'],
      key: 'voucherType',
    },
    {
      title: t(LOCALE_KEYS.BRANCH),
      dataIndex: ['branch', 'name'],
      key: 'branch',
    },
    {
      title: t(LOCALE_KEYS.DEPARTMENT),
      dataIndex: ['department', 'name'],
      key: 'department',
    },
    {
      title: t(LOCALE_KEYS.TOTAL_AMOUNT),
      key: 'totalAmount',
      align: 'right',
      render: (_, record) => {
        const total = record.details?.reduce((sum, d) => sum + Number(d.debitAmount || 0), 0) || 0;
        return <span className="font-semibold">{total.toFixed(2)}</span>;
      },
    },
    {
      title: t(LOCALE_KEYS.STATUS),
      dataIndex: 'isPosted',
      key: 'isPosted',
      render: (isPosted) => (
        <Tag color={isPosted ? 'green' : 'orange'}>
          {isPosted ? t(LOCALE_KEYS.POSTED) : t(LOCALE_KEYS.UNPOSTED)}
        </Tag>
      ),
    },
    {
      title: t(LOCALE_KEYS.ACTIONS),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewVoucher(record)} />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/voucher-entry?id=${record.id}`)}
            disabled={!!record.isPosted}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={!!record.isPosted}
            onClick={async () => {
              if (confirm(t(LOCALE_KEYS.ARE_YOU_SURE))) {
                try {
                  await voucherService.delete(record.id);
                  toast.success(t(LOCALE_KEYS.DELETED_SUCCESSFULLY));
                  loadVouchers();
                } catch (error) {
                  toast.error(t(LOCALE_KEYS.FAILED_TO_DELETE));
                }
              }
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4">
          <Card bordered={false} className="mb-4">
            <div className="flex justify-between items-center mb-6">
              <Title level={4} style={{ margin: 0 }}>
                {t(LOCALE_KEYS.VOUCHER_LIST)}
              </Title>
              <Button type="primary" onClick={() => router.push('/voucher-entry')}>
                {t(LOCALE_KEYS.ADD)} {t(LOCALE_KEYS.VOUCHER)}
              </Button>
            </div>

            <Form form={filterForm} layout="vertical" onFinish={handleSearch}>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="dateRange" label={t(LOCALE_KEYS.VOUCHER_DATE)}>
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item name="voucherTypeId" label={t(LOCALE_KEYS.TYPE)}>
                    <Select placeholder={t(LOCALE_KEYS.SELECT)} allowClear>
                      {voucherTypes.map((vt) => (
                        <Select.Option key={vt.id} value={vt.id}>
                          {vt.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item name="financialYearId" label={t(LOCALE_KEYS.FINANCIAL_YEAR)}>
                    <Select placeholder={t(LOCALE_KEYS.SELECT)} allowClear>
                      {financialYears.map((fy) => (
                        <Select.Option key={fy.id} value={fy.id}>
                          {fy.yearName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <Form.Item name="voucherNo" label={t(LOCALE_KEYS.VOUCHER_NO)}>
                    <Input placeholder={t(LOCALE_KEYS.SEARCH_BY_VOUCHER_NO)} allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <Form.Item name="branchId" label={t(LOCALE_KEYS.BRANCH)}>
                    <Select
                      placeholder={t(LOCALE_KEYS.SELECT)}
                      allowClear
                      onChange={handleBranchChange}
                    >
                      {branches.map((b) => (
                        <Select.Option key={b.id} value={b.id}>
                          {b.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item name="departmentId" label={t(LOCALE_KEYS.DEPARTMENT)}>
                    <Select
                      placeholder={t(LOCALE_KEYS.SELECT)}
                      allowClear
                      disabled={!filterForm.getFieldValue('branchId')}
                    >
                      {departments.map((d) => (
                        <Select.Option key={d.id} value={d.id}>
                          {d.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="chartOfAccountId" label={t(LOCALE_KEYS.LEDGER)}>
                    <Select
                      placeholder={t(LOCALE_KEYS.SELECT)}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {ledgerAccounts.map((a) => (
                        <Select.Option key={a.id} value={a.id}>
                          {a.accountCode} - {a.accountName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="costCenterId" label={t(LOCALE_KEYS.COST_CENTER)}>
                    <Select
                      placeholder={t(LOCALE_KEYS.SELECT)}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {costCenters.map((c) => (
                        <Select.Option key={c.id} value={c.id}>
                          {c.costName || c.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item name="isPosted" label={t(LOCALE_KEYS.STATUS)}>
                    <Select placeholder={t(LOCALE_KEYS.SELECT)} allowClear>
                      <Select.Option value={1}>{t(LOCALE_KEYS.POSTED)}</Select.Option>
                      <Select.Option value={0}>{t(LOCALE_KEYS.UNPOSTED)}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col
                  xs={24}
                  lg={8}
                  xl={4}
                  style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24 }}
                >
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                      {t(LOCALE_KEYS.FILTERS)}
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={handleReset}>
                      {t(LOCALE_KEYS.CLEAR)}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card bordered={false}>
            <Table
              columns={columns}
              dataSource={vouchers}
              rowKey="id"
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                onChange: (page, pSize) => {
                  setCurrentPage(page);
                  setPageSize(pSize);
                  loadVouchers(page, pSize);
                },
              }}
            />
          </Card>

          <Modal
            title={
              selectedVoucher
                ? `${selectedVoucher.financialYear?.yearName} - ${selectedVoucher.voucherType?.name} - ${selectedVoucher.voucherNo}`
                : t(LOCALE_KEYS.VIEW)
            }
            open={isDetailModalVisible}
            onCancel={() => setIsDetailModalVisible(false)}
            width={1000}
            footer={[
              <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                {t(LOCALE_KEYS.CLOSE)}
              </Button>,
              selectedVoucher && !selectedVoucher.isPosted && (
                <Button
                  key="post"
                  type="primary"
                  loading={updatingStatus}
                  onClick={() => handleTogglePost(true)}
                >
                  {t(LOCALE_KEYS.POSTED)}
                </Button>
              ),
            ]}
          >
            {selectedVoucher && (
              <>
                <Descriptions
                  bordered
                  size="small"
                  column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label={t(LOCALE_KEYS.BRANCH)}>
                    {selectedVoucher.branch?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={t(LOCALE_KEYS.DEPARTMENT)}>
                    {selectedVoucher.department?.name || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t(LOCALE_KEYS.VOUCHER_DATE)}>
                    {dayjs(selectedVoucher.voucherDate).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item label={t(LOCALE_KEYS.NARRATION)} span={3}>
                    {selectedVoucher.narration}
                  </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">{t(LOCALE_KEYS.VOUCHER_ENTRY)}</Divider>

                <Table
                  dataSource={selectedVoucher.details}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  childrenColumnName="subEntries"
                  columns={[
                    {
                      title: t(LOCALE_KEYS.LEDGER),
                      dataIndex: ['chartOfAccount', 'accountName'],
                      key: 'account',
                    },
                    {
                      title: t(LOCALE_KEYS.COST_CENTER),
                      dataIndex: ['costCenter', 'costName'],
                      key: 'costCenter',
                    },
                    {
                      title: t(LOCALE_KEYS.CURRENCY),
                      dataIndex: ['currency', 'code'],
                      key: 'currency',
                    },
                    {
                      title: t(LOCALE_KEYS.EXCHANGE_RATE),
                      dataIndex: 'currencyExRate',
                      key: 'exRate',
                      align: 'right',
                      render: (val) => Number(val).toFixed(2),
                    },
                    {
                      title: t(LOCALE_KEYS.DEBIT),
                      dataIndex: 'debitAmount',
                      key: 'debit',
                      align: 'right',
                      render: (val) => Number(val).toFixed(2),
                    },
                    {
                      title: t(LOCALE_KEYS.CREDIT),
                      dataIndex: 'creditAmount',
                      key: 'credit',
                      align: 'right',
                      render: (val) => Number(val).toFixed(2),
                    },
                    {
                      title: t(LOCALE_KEYS.BANK_NAME),
                      key: 'bank',
                      render: (_, record: any) =>
                        record.bankName ? `${record.bankName} (${record.bankAccno || ''})` : '-',
                    },
                    {
                      title: t(LOCALE_KEYS.CHEQUE_NO),
                      dataIndex: 'chequeNo',
                      key: 'chequeNo',
                    },
                    {
                      title: t(LOCALE_KEYS.CHEQUE_DATE),
                      dataIndex: 'chequeDate',
                      key: 'chequeDate',
                      render: (date) => date && dayjs(date).format('YYYY-MM-DD'),
                    },
                    {
                      title: t(LOCALE_KEYS.NARRATION),
                      dataIndex: 'lineNarration',
                      key: 'narration',
                    },
                  ]}
                  expandable={{
                    expandedRowRender: (record: any) => {
                      if (!record.children || record.children.length === 0) return null;
                      return (
                        <Table
                          dataSource={record.children}
                          rowKey="id"
                          pagination={false}
                          size="small"
                          columns={[
                            {
                              title: t(LOCALE_KEYS.TYPE),
                              dataIndex: 'refType',
                              key: 'refType',
                              render: (type) =>
                                type === 1 ? t(LOCALE_KEYS.BILL) : t(LOCALE_KEYS.ADVANCE),
                            },
                            { title: t(LOCALE_KEYS.REF_ID), dataIndex: 'refId', key: 'refId' },
                            { title: t(LOCALE_KEYS.BILL_NO), dataIndex: 'billNo', key: 'billNo' },
                            {
                              title: t(LOCALE_KEYS.COST_CENTER),
                              dataIndex: ['costCenter', 'costName'],
                              key: 'costCenter',
                            },
                            {
                              title: t(LOCALE_KEYS.CURRENCY),
                              dataIndex: ['currency', 'code'],
                              key: 'currency',
                            },
                            {
                              title: t(LOCALE_KEYS.EXCHANGE_RATE),
                              dataIndex: 'rate',
                              key: 'rate',
                              align: 'right',
                              render: (val) => Number(val).toFixed(2),
                            },
                            {
                              title: t(LOCALE_KEYS.AMOUNT),
                              dataIndex: 'amount',
                              key: 'amount',
                              align: 'right',
                              render: (val) => Number(val).toFixed(2),
                            },
                            { title: t(LOCALE_KEYS.REMARKS), dataIndex: 'remarks', key: 'remarks' },
                          ]}
                        />
                      );
                    },
                  }}
                />
              </>
            )}
          </Modal>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
