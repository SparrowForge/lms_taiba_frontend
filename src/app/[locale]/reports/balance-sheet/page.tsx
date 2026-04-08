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
import { Button, Card, Col, DatePicker, Form, Row, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function BalanceSheetPage() {
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
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalLiabEq, setTotalLiabEq] = useState(0);

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

      const result = await accReportsService.getBalanceSheet({
        fromDate,
        toDate,
        branchId: values.branchId,
        status: values.status || 'posted',
      });

      const parsedData = result || [];
      setReportData(parsedData);

      // Calculate roots
      let asset = 0;
      let liabEq = 0;
      parsedData.forEach((r: any) => {
        if (r.accountType === 'Asset') asset += r.balance;
        if (r.accountType === 'Liability' || r.accountType === 'Equity') liabEq += r.balance;
      });

      setTotalAsset(asset);
      setTotalLiabEq(liabEq);
    } catch (error) {
      toast.error('Failed to load balance sheet');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map((node, index) => (
      <div key={node.accountId + index}>
        <div
          className={`flex justify-between py-1 border-b border-gray-200 ${depth === 0 ? 'bg-gray-100 font-bold uppercase mt-2' : ''} ${!node.isTransaction ? 'font-semibold text-gray-700' : 'text-gray-600'}`}
        >
          <div style={{ paddingLeft: `${depth * 20}px` }}>{node.accountName}</div>
          <div>{Number(node.balance).toFixed(2)}</div>
        </div>
        {node.children && node.children.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  const filterByTypes = (types: string[]) => {
    return reportData.filter((d) => types.includes(d.accountType));
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4 print:p-0">
          <Card bordered={false} className="mb-4 print:hidden">
            <div className="flex justify-between items-center mb-6">
              <Title level={4} style={{ margin: 0 }}>
                {t(LOCALE_KEYS.STATEMENT_OF_FINANCIAL_POSITION)}
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
                reportTitle={t(LOCALE_KEYS.STATEMENT_OF_FINANCIAL_POSITION)}
                dateInfo={dateRangeStr.split(' To ')[1]}
                dateLabel={t(LOCALE_KEYS.AS_ON)}
                currencyCode={defaultCurrencyCode}
              />

              <div className="print-table flex flex-col md:flex-row gap-8">
                {/* Assets */}
                <div className="flex-1 border p-4">
                  <Title
                    level={4}
                    className="border-b-2 border-black pb-2 text-center uppercase tracking-wider"
                  >
                    {t(LOCALE_KEYS.PROPERTY_ASSETS)}
                  </Title>
                  {renderTree(filterByTypes(['Asset']))}

                  <div className="mt-8 flex justify-between font-bold text-lg border-t-2 border-black border-b-2 border-double pt-2 pb-1">
                    <span>{t(LOCALE_KEYS.TOTAL_ASSETS)}</span>
                    <span>{totalAsset.toFixed(2)}</span>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div className="flex-1 border p-4">
                  <Title
                    level={4}
                    className="border-b-2 border-black pb-2 text-center uppercase tracking-wider"
                  >
                    {t(LOCALE_KEYS.FUND_LIABILITIES)}
                  </Title>
                  {renderTree(filterByTypes(['Equity', 'Liability']))}

                  <div className="mt-8 flex justify-between font-bold text-lg border-t-2 border-black border-b-2 border-double pt-2 pb-1">
                    <span>{t(LOCALE_KEYS.TOTAL_FUND_LIABILITIES)}</span>
                    <span>{totalLiabEq.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <ReportFooter selectedBranch={selectedBranch} />
            </Card>
          )}
        </div>

        <style jsx global>{`
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
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          }
        `}</style>
      </MainLayout>
    </ProtectedRoute>
  );
}
