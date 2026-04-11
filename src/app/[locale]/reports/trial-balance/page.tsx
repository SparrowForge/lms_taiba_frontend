'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { accReportsService } from '@/services/accReportsService';
import { ReportFooter, ReportHeader } from '@/components/reports/ReportHeaderFooter';
import { branchService } from '@/services/branchService';
import { currencyService } from '@/services/currencyService';
import { IBranch } from '@/types/branch';
import { PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Row, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function TrialBalancePage() {
  const { t } = useLocalization();
  const [filterForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IBranch[]>([]);

  const [reportData, setReportData] = useState<any[]>([]);
  const [dateRangeStr, setDateRangeStr] = useState<string>('');
  const [branchStr, setBranchStr] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [defaultCurrencyCode, setDefaultCurrencyCode] = useState<string>('');

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [branchesRes, currenciesRes] = await Promise.all([
        branchService.getBranches({ page: 1, limit: 100 }),
        currencyService.getCurrencies({ page: 1, limit: 100 }),
      ]);
      setBranches(branchesRes.data.items);

      const defCur = currenciesRes.data.items.find((c: any) => c.isDefault);
      if (defCur) {
        setDefaultCurrencyCode(defCur.code);
      }
    } catch (error) {
      toast.error('Failed to load initial data');
    }
  };

  const handleSearch = async (values: any) => {
    if (!values.dateRange) {
      toast.warning('Date Range is required');
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

      const result = await accReportsService.getTrialBalance({
        fromDate,
        toDate,
        branchId: values.branchId,
        status: values.status || 'posted',
      });

      setReportData(result);
    } catch (error) {
      toast.error('Failed to load trial balance');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: t(LOCALE_KEYS.A_C_CODE),
      dataIndex: 'accountCode',
      key: 'accountCode',
      className: 'whitespace-nowrap',
    },
    {
      title: t(LOCALE_KEYS.ACCOUNT_HEAD),
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: t(LOCALE_KEYS.OPENING_BALANCE),
      children: [
        {
          title: t(LOCALE_KEYS.DEBIT),
          dataIndex: 'openingDebit',
          key: 'openingDebit',
          align: 'right',
          render: (val) => (val > 0 ? Number(val).toFixed(2) : ''),
        },
        {
          title: t(LOCALE_KEYS.CREDIT),
          dataIndex: 'openingCredit',
          key: 'openingCredit',
          align: 'right',
          render: (val) => (val > 0 ? Number(val).toFixed(2) : ''),
        },
      ],
    },
    {
      title: t(LOCALE_KEYS.DURING_PERIOD),
      children: [
        {
          title: t(LOCALE_KEYS.DEBIT),
          dataIndex: 'periodDebit',
          key: 'periodDebit',
          align: 'right',
          render: (val) => (val > 0 ? Number(val).toFixed(2) : ''),
        },
        {
          title: t(LOCALE_KEYS.CREDIT),
          dataIndex: 'periodCredit',
          key: 'periodCredit',
          align: 'right',
          render: (val) => (val > 0 ? Number(val).toFixed(2) : ''),
        },
      ],
    },
    {
      title: t(LOCALE_KEYS.CLOSING_BALANCE),
      children: [
        {
          title: t(LOCALE_KEYS.DEBIT),
          dataIndex: 'closingDebit',
          key: 'closingDebit',
          align: 'right',
          render: (val) =>
            val > 0 ? <span className="font-semibold">{Number(val).toFixed(2)}</span> : '',
        },
        {
          title: t(LOCALE_KEYS.CREDIT),
          dataIndex: 'closingCredit',
          key: 'closingCredit',
          align: 'right',
          render: (val) =>
            val > 0 ? <span className="font-semibold">{Number(val).toFixed(2)}</span> : '',
        },
      ],
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const totals = reportData.reduce(
    (acc, row) => {
      acc.openingDebit += row.openingDebit || 0;
      acc.openingCredit += row.openingCredit || 0;
      acc.periodDebit += row.periodDebit || 0;
      acc.periodCredit += row.periodCredit || 0;
      acc.closingDebit += row.closingDebit || 0;
      acc.closingCredit += row.closingCredit || 0;
      return acc;
    },
    {
      openingDebit: 0,
      openingCredit: 0,
      periodDebit: 0,
      periodCredit: 0,
      closingDebit: 0,
      closingCredit: 0,
    },
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4 print:p-0">
          <Card bordered={false} className="mb-4 print:hidden">
            <div className="flex justify-between items-center mb-6">
              <Title level={4} style={{ margin: 0 }}>
                {t(LOCALE_KEYS.TRIAL_BALANCE)}
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

          {reportData.length > 0 && (
            <Card bordered={false} className="print:shadow-none print:border-none">
              <div className="flex justify-between items-start mb-4 print:hidden">
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  {t(LOCALE_KEYS.PRINT_REPORT)}
                </Button>
              </div>

              <ReportHeader
                selectedBranch={selectedBranch}
                reportTitle={t(LOCALE_KEYS.TRIAL_BALANCE)}
                dateInfo={dateRangeStr}
                dateLabel={t(LOCALE_KEYS.FOR_THE_PERIOD)}
                currencyCode={defaultCurrencyCode}
              />

              <Table
                dataSource={reportData}
                columns={columns}
                pagination={false}
                rowKey="accountId"
                bordered
                size="small"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row className="bg-gray-100 font-bold uppercase">
                      <Table.Summary.Cell index={0} colSpan={2} align="center">
                        {t(LOCALE_KEYS.TOTAL)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        {totals.openingDebit.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        {totals.openingCredit.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        {totals.periodDebit.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">
                        {totals.periodCredit.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="right">
                        {totals.closingDebit.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="right">
                        {totals.closingCredit.toFixed(2)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
                className="print-table"
              />

              <ReportFooter selectedBranch={selectedBranch} />
            </Card>
          )}
        </div>

        <style jsx global>{`
          @media print {
            .ant-layout-sider,
            .ant-layout-header {
              display: none !important;
            }
            main.ant-layout-content {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          @media print {
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
            .ant-table {
              font-size: 11px;
            }
            .ant-table-thead > tr > th {
              background: #e5e5e5 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              padding: 4px 6px !important;
            }
            .ant-table-tbody > tr > td {
              padding: 4px 6px !important;
            }
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
          }
        `}</style>
      </MainLayout>
    </ProtectedRoute>
  );
}
