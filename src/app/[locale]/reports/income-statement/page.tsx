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

export default function IncomeStatementPage() {
  const { t } = useLocalization();
  const [filterForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IBranch[]>([]);

  const [reportData, setReportData] = useState<any[]>([]);
  const [dateRangeStr, setDateRangeStr] = useState<string>('');
  const [branchStr, setBranchStr] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [defaultCurrencyCode, setDefaultCurrencyCode] = useState<string>('');

  // Totals
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

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

      const result = await accReportsService.getIncomeStatement({
        fromDate,
        toDate,
        branchId: values.branchId,
        status: values.status || 'posted',
      });

      const parsedData = result || [];
      setReportData(parsedData);

      // Calculate roots
      let inc = 0;
      let exp = 0;
      parsedData.forEach((r: any) => {
        if (r.accountType === 'Income') inc += r.periodBalance;
        if (r.accountType === 'Expense') exp += r.periodBalance;
      });
      setTotalIncome(inc);
      setTotalExpense(exp);
    } catch (error) {
      toast.error('Failed to load income statement');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (val: number) => {
    if (!val && val !== 0) return '0.00';
    // Indian Numbering System: 7,00,27,575.57
    const x = Math.abs(val).toFixed(2).split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const lastThree = x1.substring(x1.length - 3);
    const otherNumbers = x1.substring(0, x1.length - 3);
    if (otherNumbers !== '') {
      x1 = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      x1 = lastThree;
    }
    const formatted = x1 + x2;
    return val < 0 ? `(${formatted})` : formatted;
  };

  const columns: ColumnsType<any> = [
    {
      title: t(LOCALE_KEYS.PARTICULARS),
      dataIndex: 'accountName',
      key: 'accountName',
      render: (text, record) => {
        const level = record.level || 1;
        const isBold = level < 5;

        return (
          <div className="particulars-cell">
            <span
              style={{
                paddingLeft: (level - 1) * 15,
                fontWeight: isBold ? 'bold' : 'normal',
                display: 'inline-block',
                textTransform: 'uppercase',
                fontSize: '10px',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </span>
            <div className="dotted-connector"></div>
          </div>
        );
      },
    },
    {
      title: t(LOCALE_KEYS.AMOUNT),
      dataIndex: 'periodBalance',
      key: 'periodBalance',
      align: 'right',
      width: 180,
      render: (val, record) => {
        const level = record.level || (record.parentId ? 2 : 1);
        return (
          <span
            style={{
              fontWeight: level < 5 ? 'bold' : 'normal',
              fontSize: '10px',
            }}
          >
            {formatNumber(val)}
          </span>
        );
      },
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4 print:p-0">
          <Card bordered={false} className="mb-4 print:hidden">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <Title level={4} style={{ margin: 0 }}>
                {t(LOCALE_KEYS.STATEMENT_OF_PROFIT_OR_LOSS)}
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

              <ReportHeader
                selectedBranch={selectedBranch}
                reportTitle={t(LOCALE_KEYS.STATEMENT_OF_PROFIT_OR_LOSS)}
                dateInfo={dateRangeStr}
                dateLabel={t(LOCALE_KEYS.FOR_THE_PERIOD)}
                currencyCode={defaultCurrencyCode}
              />

              <Table
                dataSource={reportData}
                columns={columns}
                pagination={false}
                rowKey="accountId"
                bordered={false}
                size="small"
                expandable={{
                  defaultExpandAllRows: true,
                  showExpandColumn: false,
                }}
                className="print-table"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row className="bg-gray-50">
                      <Table.Summary.Cell index={0} className="font-bold text-xs uppercase">
                        {t(LOCALE_KEYS.TOTAL_INCOME)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        align="right"
                        className="font-bold text-xs border-b-2 border-black"
                      >
                        {formatNumber(totalIncome)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row className="bg-gray-50">
                      <Table.Summary.Cell index={0} className="font-bold text-xs uppercase">
                        {t(LOCALE_KEYS.TOTAL_EXPENSE)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        align="right"
                        className="font-bold text-xs border-b-2 border-black"
                      >
                        {formatNumber(totalExpense)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row className="bg-gray-100">
                      <Table.Summary.Cell index={0} className="font-bold text-sm uppercase">
                        {totalIncome + totalExpense < 0 ? t(LOCALE_KEYS.TOTAL_LOSS) : t(LOCALE_KEYS.TOTAL_PROFIT)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        align="right"
                        className="font-bold text-sm border-double border-b-4 border-black"
                      >
                        {formatNumber(totalIncome + totalExpense)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />

              <ReportFooter selectedBranch={selectedBranch} />
            </Card>
          )}
        </div>

        <style jsx global>{`
          .particulars-cell {
            display: flex;
            align-items: baseline;
            width: 100%;
          }
          .dotted-connector {
            flex: 1;
            border-bottom: 1px dotted #ccc;
            margin-left: 8px;
            margin-right: 4px;
            margin-bottom: 4px;
          }
          
          .print-table .ant-table {
            background: transparent;
          }
          .print-table .ant-table-thead > tr > th {
            background: #fdfdfd !important;
            border-bottom: 2px solid #000 !important;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 11px;
            padding: 8px !important;
          }
          .print-table .ant-table-tbody > tr > td {
            border-bottom: 1px dotted #ccc !important;
            padding: 4px 8px !important;
          }

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

            .ant-layout {
              display: block !important;
            }

            .print:hidden {
              display: none !important;
            }

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
              font-size: 10px;
              table-layout: fixed !important;
            }

            .ant-table-thead > tr > th {
              background: #fff !important;
              border-top: 2px solid #000 !important;
              border-bottom: 2px solid #000 !important;
              padding: 4px 8px !important;
            }

            .ant-table-tbody > tr > td {
              border: none !important;
              border-bottom: 1px dotted #ccc !important;
              padding: 2px 8px !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            @page {
              size: auto;
              margin: 15mm;
            }
          }
        `}</style>
      </MainLayout>
    </ProtectedRoute>
  );
}
