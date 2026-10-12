'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { ReportFooter, ReportHeader } from '@/components/reports/ReportHeaderFooter';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { accReportsService } from '@/services/accReportsService';
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

const formatNumber = (val: number) => {
  if (!val || Math.abs(val) < 0.001) return '0.00';
  const formatted = Math.abs(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return val < 0 ? `(${formatted})` : formatted;
};

const getBalance = (debit: number, credit: number, type: string) => {
  const t = type?.toLowerCase();
  if (t === 'asset' || t === 'expense') {
    return debit - credit;
  }
  return credit - debit;
};

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
      const foundBranch = bId ? branches.find((b) => Number(b.id) === Number(bId)) || null : null;
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
      title: t(LOCALE_KEYS.ACCOUNTS),
      dataIndex: 'accountName',
      key: 'accountName',
      width: '35%',
      render: (text, record) => {
        const level = record.level || 0;
        const isBold = level < 3;
        const color = level === 1 ? '#1890ff' : level === 3 ? '#52c41a' : 'inherit';

        return (
          <span
            style={{
              paddingLeft: (level - 1) * 15,
              fontWeight: isBold ? 'bold' : 'normal',
              color: color,
              display: 'inline-block',
              textTransform: level < 3 ? 'uppercase' : 'none',
              fontSize: '9px',
            }}
          >
            {record.accountCode} - {text}
          </span>
        );
      },
    },
    {
      title: t(LOCALE_KEYS.OPENING),
      key: 'opening',
      align: 'right',
      width: '15%',
      render: (_, record) => {
        const bal = getBalance(record.openingDebit, record.openingCredit, record.accountType);
        return (
          <span
            style={{
              fontWeight: record.level < 3 ? 'bold' : 'normal',
              fontSize: '9px',
            }}
          >
            {formatNumber(bal)}
          </span>
        );
      },
    },
    {
      title: t(LOCALE_KEYS.DURING_PERIOD),
      children: [
        {
          title: t(LOCALE_KEYS.DEBIT),
          dataIndex: 'periodDebit',
          key: 'periodDebit',
          align: 'right',
          width: '17.5%',
          render: (val) => (
            <span style={{ fontSize: '9px' }}>
              {val > 0
                ? Number(val)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '0.00'}
            </span>
          ),
        },
        {
          title: t(LOCALE_KEYS.CREDIT),
          dataIndex: 'periodCredit',
          key: 'periodCredit',
          align: 'right',
          width: '17.5%',
          render: (val) => (
            <span style={{ fontSize: '9px' }}>
              {val > 0
                ? Number(val)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '0.00'}
            </span>
          ),
        },
      ],
    },
    {
      title: t(LOCALE_KEYS.CLOSING),
      key: 'closing',
      align: 'right',
      width: '15%',
      render: (_, record) => {
        const bal = getBalance(record.closingDebit, record.closingCredit, record.accountType);
        return (
          <span
            style={{
              fontWeight: record.level < 3 ? 'bold' : 'normal',
              fontSize: '9px',
            }}
          >
            {formatNumber(bal)}
          </span>
        );
      },
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
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
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
              <div className="flex justify-between items-start mb-4 print:hidden flex-wrap gap-2">
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  {t(LOCALE_KEYS.PRINT_REPORT)}
                </Button>
              </div>

              <div className="text-center mb-8">
                <ReportHeader
                  selectedBranch={selectedBranch}
                  reportTitle={t(LOCALE_KEYS.TRIAL_BALANCE)}
                  dateInfo={dateRangeStr}
                  dateLabel={t(LOCALE_KEYS.DATE)}
                  currencyCode={defaultCurrencyCode}
                />
              </div>

              <Table
                dataSource={reportData}
                columns={columns}
                pagination={false}
                rowKey="accountId"
                bordered
                size="small"
                expandable={{
                  defaultExpandAllRows: true,
                  showExpandColumn: false,
                }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row className="bg-gray-100 font-bold uppercase">
                      <Table.Summary.Cell index={0} colSpan={2} align="center"></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        {totals.periodDebit.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        {totals.periodCredit.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right"></Table.Summary.Cell>
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
            /* Hide all UI navigation elements */
            .ant-layout-sider,
            .ant-layout-header,
            .ant-layout-sider-trigger,
            nav,
            aside {
              display: none !important;
              width: 0 !important;
            }

            /* Reset Layout containers to be full height/visible overflow */
            html,
            body,
            #__next,
            .ant-layout,
            .ant-layout-content,
            main {
              height: auto !important;
              overflow: visible !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            /* Main container width adjustment */
            .ant-layout {
              display: block !important;
            }

            /* Content area reset */
            .ant-layout-content {
              min-height: auto !important;
            }

            .print\\:hidden {
              display: none !important;
            }

            /* Card and Table Resets */
            .ant-card,
            .ant-card-body,
            .ant-table-wrapper,
            .ant-spin-nested-loading,
            .ant-spin-container,
            .ant-table,
            .ant-table-container,
            .ant-table-content,
            .ant-table-body {
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
            }

            .ant-table {
              font-size: 9px;
              table-layout: fixed !important;
            }

            .ant-table-thead > tr > th {
              background: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              padding: 2px 4px !important;
              border-bottom: 2px solid #000 !important;
            }

            .ant-table-tbody > tr > td {
              padding: 2px 4px !important;
              border-bottom: 1px solid #eee !important;
            }

            .ant-table-summary {
              background: #f0f0f0 !important;
              font-weight: bold;
            }

            /* Prevent premature page breaks */
            .ant-table-row,
            .ant-table-summary-row {
              page-break-inside: avoid !important;
            }

            .ant-card {
              page-break-inside: auto !important;
            }

            @page {
              size: auto; /* Allow user to choose, defaults to portrait */
              margin: 10mm;
            }
          }
        `}</style>
      </MainLayout>
    </ProtectedRoute>
  );
}
