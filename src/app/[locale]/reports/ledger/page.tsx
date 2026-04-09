'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { accReportsService } from '@/services/accReportsService';
import { branchService } from '@/services/branchService';
import { chartOfAccountsService } from '@/services/chartOfAccountsService';
import { ReportFooter, ReportHeader } from '@/components/reports/ReportHeaderFooter';
import { currencyService } from '@/services/currencyService';
import { IBranch } from '@/types/branch';
import { IChartOfAccount } from '@/types/chartOfAccounts';
import { PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Row, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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

export default function LedgerReportPage() {
  const { t } = useLocalization();
  const [filterForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [accounts, setAccounts] = useState<IChartOfAccount[]>([]);

  const [reportData, setReportData] = useState<any>(null);
  const [dateRangeStr, setDateRangeStr] = useState<string>('');
  const [branchStr, setBranchStr] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [defaultCurrencyCode, setDefaultCurrencyCode] = useState<string>('');

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [branchesRes, accountsRes, currenciesRes] = await Promise.all([
        branchService.getBranches({ page: 1, limit: 100 }),
        chartOfAccountsService.getTree(),
        currencyService.getCurrencies({ page: 1, limit: 100 }),
      ]);
      setBranches(branchesRes.data.items);
      setAccounts(getLeafNodes(accountsRes.data || []));

      const defCur = currenciesRes.data.items.find((c: any) => c.isDefault);
      if (defCur) {
        setDefaultCurrencyCode(defCur.code);
      }
    } catch (error) {
      toast.error('Failed to load initial data');
    }
  };

  const handleSearch = async (values: any) => {
    if (!values.accountId || !values.dateRange) {
      toast.warning('Account and Date Range are required');
      return;
    }

    setLoading(true);
    try {
      const fromDate = values.dateRange[0].format('YYYY-MM-DD');
      const toDate = values.dateRange[1].format('YYYY-MM-DD');
      setDateRangeStr(
        `${dayjs(values.dateRange[0]).format('DD-MMM-YYYY')} To ${dayjs(values.dateRange[1]).format('DD-MMM-YYYY')}`,
      );
      const bId = values.branchId;
      const foundBranch = bId ? branches.find(b => Number(b.id) === Number(bId)) || null : null;
      setSelectedBranch(foundBranch);
      setBranchStr(foundBranch ? foundBranch.name : t(LOCALE_KEYS.ALL_BRANCHES));

      const result = await accReportsService.getLedger({
        accountId: values.accountId,
        fromDate,
        toDate,
        branchId: values.branchId,
        status: values.status || 'posted',
      });

      setReportData(result);
    } catch (error) {
      toast.error('Failed to load ledger report');
    } finally {
      setLoading(false);
    }
  };

  let runningBalance = reportData?.openingBalance || 0;
  const tableData =
    reportData?.transactions.map((tx: any, idx: number) => {
      // Determine effect on balance based on Account Type
      const isAssetExpense =
        reportData.account.accountType === 'Asset' || reportData.account.accountType === 'Expense';
      if (isAssetExpense) {
        runningBalance = runningBalance + tx.debit - tx.credit;
      } else {
        runningBalance = runningBalance + tx.credit - tx.debit;
      }
      return {
        ...tx,
        key: idx,
        runningBalance,
      };
    }) || [];

  const columns: ColumnsType<any> = [
    {
      title: `${t(LOCALE_KEYS.DATE)} / ${t(LOCALE_KEYS.VOUCHER_NUMBER)}`,
      key: 'date_no',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{dayjs(record.voucherDate).format('DD-MMM-YYYY')}</div>
          <div className="text-blue-600 font-semibold">{record.voucherNo}</div>
        </div>
      ),
    },
    {
      title: t(LOCALE_KEYS.ACCOUNT_HEAD),
      dataIndex: 'accountName',
      key: 'accountName',
      render: () => <span className="font-bold">{reportData?.account?.accountName}</span>,
    },
    {
      title: t(LOCALE_KEYS.COST_CENTER),
      dataIndex: 'costCenter',
      key: 'costCenter',
    },
    {
      title: t(LOCALE_KEYS.BRANCH),
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: t(LOCALE_KEYS.DEBIT),
      dataIndex: 'debit',
      key: 'debit',
      align: 'right',
      render: (val) => (val > 0 ? Number(val).toFixed(2) : ''),
    },
    {
      title: t(LOCALE_KEYS.CREDIT),
      dataIndex: 'credit',
      key: 'credit',
      align: 'right',
      render: (val) => (val > 0 ? Number(val).toFixed(2) : ''),
    },
    {
      title: t(LOCALE_KEYS.BALANCE),
      dataIndex: 'runningBalance',
      key: 'balance',
      align: 'right',
      render: (val) => (
        <span className="font-semibold text-blue-600">{Number(val).toFixed(2)}</span>
      ),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const totalPeriodDebit =
    reportData?.transactions.reduce((sum: number, tx: any) => sum + tx.debit, 0) || 0;
  const totalPeriodCredit =
    reportData?.transactions.reduce((sum: number, tx: any) => sum + tx.credit, 0) || 0;

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4 print:p-0">
          <Card bordered={false} className="mb-4 print:hidden">
            <div className="flex justify-between items-center mb-6">
              <Title level={4} style={{ margin: 0 }}>
                Ledger Report
              </Title>
            </div>

            <Form form={filterForm} layout="vertical" onFinish={handleSearch}>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item
                    name="dateRange"
                    label={t(LOCALE_KEYS.DATE_RANGE)}
                    rules={[{ required: true }]}
                  >
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item
                    name="accountId"
                    label={t(LOCALE_KEYS.ACCOUNT_NO)}
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Account"
                      optionFilterProp="children"
                      allowClear
                    >
                      {accounts.map((acc) => (
                        <Select.Option key={acc.id} value={acc.id}>
                          {acc.accountName} ({acc.accountCode})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <Form.Item name="branchId" label={t(LOCALE_KEYS.BRANCH)}>
                    <Select placeholder={t(LOCALE_KEYS.ALL_BRANCHES)} allowClear>
                      {branches.map((b) => (
                        <Select.Option key={b.id} value={b.id}>
                          {b.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item name="status" label={t(LOCALE_KEYS.STATUS)} initialValue="posted">
                    <Select>
                      <Select.Option value="posted">{t(LOCALE_KEYS.POSTED_ONLY)}</Select.Option>
                      <Select.Option value="all">{t(LOCALE_KEYS.ALL_VOUCHERS)}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={3} className="flex items-end">
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SearchOutlined />}
                      loading={loading}
                      block
                    >
                      {t(LOCALE_KEYS.SEARCH)}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          {reportData && (
            <Card bordered={false} className="print:shadow-none print:border-none">
              <div className="flex justify-between items-start mb-4 print:hidden">
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  {t(LOCALE_KEYS.PRINT_REPORT)}
                </Button>
              </div>

              <ReportHeader
                selectedBranch={selectedBranch}
                reportTitle={t(LOCALE_KEYS.GENERAL_LEDGER_RUNNING_BALANCE)}
                dateInfo={dateRangeStr}
                dateLabel={t(LOCALE_KEYS.FOR_THE_PERIOD)}
                currencyCode={defaultCurrencyCode}
              />


              <table className="ledger-summary-table w-full border-collapse border border-black mb-4 align-top text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 text-left">
                      {t(LOCALE_KEYS.ACCOUNT_HEAD)}
                    </th>
                    <th className="border border-black p-2 text-right">
                      {t(LOCALE_KEYS.OPENING_BALANCE)}
                    </th>
                    <th className="border border-black p-2 text-right">{t(LOCALE_KEYS.DEBIT)}</th>
                    <th className="border border-black p-2 text-right">{t(LOCALE_KEYS.CREDIT)}</th>
                    <th className="border border-black p-2 text-right">
                      {t(LOCALE_KEYS.CLOSING_BALANCE)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-bold uppercase">
                      {reportData.account.accountName}
                    </td>
                    <td className="border border-black p-2 text-right font-semibold">
                      {reportData.openingBalance.toFixed(2)}
                    </td>
                    <td className="border border-black p-2 text-right">
                      {totalPeriodDebit.toFixed(2)}
                    </td>
                    <td className="border border-black p-2 text-right">
                      {totalPeriodCredit.toFixed(2)}
                    </td>
                    <td className="border border-black p-2 text-right font-semibold">
                      {runningBalance.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <Table
                dataSource={tableData}
                columns={columns}
                pagination={false}
                bordered
                size="small"
                rowClassName={(record) => 'align-top'}
                title={() => <span className="font-bold">{t(LOCALE_KEYS.TRANSACTION_DETAILS)}</span>}
                className="print-table"
              />

              <ReportFooter selectedBranch={selectedBranch} />
            </Card>
          )}
        </div>

        <style jsx global>{`
          @media print {
            /* Hide everything outside content */
            .ant-layout-sider,
            .ant-layout-header,
            .ant-layout-sider-trigger,
            nav,
            aside {
              display: none !important;
              width: 0 !important;
              min-width: 0 !important;
              max-width: 0 !important;
              flex: 0 !important;
            }
            .ant-layout,
            .ant-layout-has-sider {
              display: block !important;
              margin: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding: 0 !important;
            }
            .ant-layout-content,
            main.ant-layout-content {
              margin: 0 !important;
              margin-left: 0 !important;
              padding: 0 !important;
              background: white !important;
              width: 100% !important;
              max-width: 100% !important;
              min-height: auto !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .ant-card {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              width: 100% !important;
            }
            .ant-card-body {
              padding: 0 !important;
            }
            .ant-table-wrapper,
            .ant-spin-nested-loading,
            .ant-spin-container,
            .ant-table {
              width: 100% !important;
            }
            table {
              width: 100% !important;
            }
            .ant-table {
              font-size: 10px;
            }
            .ant-table-thead > tr > th {
              background: #e5e5e5 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              padding: 3px 5px !important;
              font-size: 9px;
              text-transform: uppercase;
            }
            .ant-table-tbody > tr > td {
              padding: 3px 5px !important;
              font-size: 10px;
            }
            .ant-table-title {
              padding: 4px 8px !important;
              font-size: 11px;
            }
            /* Summary table */
            .ledger-summary-table th {
              background: #e5e5e5 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              padding: 3px 6px !important;
              font-size: 10px;
              text-transform: uppercase;
            }
            .ledger-summary-table td {
              padding: 3px 6px !important;
              font-size: 10px;
            }
            /* Page break settings */
            tr {
              page-break-inside: avoid;
            }
            @page {
              size: A4 landscape;
              margin: 8mm;
            }
          }
        `}</style>
      </MainLayout>
    </ProtectedRoute>
  );
}
