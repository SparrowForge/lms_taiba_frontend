'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { voucherService } from '@/services/voucherService';
import { IAccVoucher } from '@/types/voucher';
import { numberToWords } from '@/utils/numberToWords';
import { currencyService } from '@/services/currencyService';
import { Button, Card, Col, Row, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function VoucherPrintPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocalization();
  const [voucher, setVoucher] = useState<IAccVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState<{ symbol: string; code: string } | null>(null);

  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        if (!params.id) return;
        const [voucherRes, currenciesRes] = await Promise.all([
          voucherService.getById(Number(params.id)),
          currencyService.getCurrencies({ page: 1, limit: 100 }),
        ]);
        setVoucher(voucherRes.data);

        const def = currenciesRes.data.items.find((c: any) => c.isDefault);
        if (def) {
          setDefaultCurrency({ symbol: def.symbol, code: def.code });
        }
      } catch (error) {
        toast.error('Failed to load voucher details');
      } finally {
        setLoading(false);
      }
    };
    fetchVoucherData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!voucher) {
    return <div className="p-8 text-center">Voucher not found</div>;
  }

  const totalDebit = voucher.details?.reduce((sum, d) => sum + Number(d.debitAmount), 0) || 0;
  const totalCredit = voucher.details?.reduce((sum, d) => sum + Number(d.creditAmount), 0) || 0;

  // Extract Mode of Payment logic
  let modeOfPayment = 'Cash'; // default fallback
  const isBank = voucher.details?.some((d) => (d.chartOfAccount as any)?.isBank);
  const isCheque = voucher.details?.some((d) => d.chequeNo);
  if (isCheque) modeOfPayment = 'Cheque';
  else if (isBank) modeOfPayment = 'Bank Transfer';

  const handlePrint = () => {
    window.print();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
        {/* Non-printable action bar */}
        <div className="mb-6 flex justify-between items-center print:hidden max-w-4xl mx-auto">
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                {t(LOCALE_KEYS.BACK)}
            </Button>
            <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                {t(LOCALE_KEYS.PRINT)}
            </Button>
        </div>

        {/* Printable Area */}
        <Card id="voucher-print-area" className="max-w-4xl mx-auto shadow-md print:shadow-none print:border-none">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 mb-3">
            <Row align="middle">
              <Col xs={12} sm={8} md={4}>
                <div className="h-12 w-12 border-2 border-black flex items-center justify-center font-bold text-sm rounded">
                  Logo
                </div>
              </Col>
              <Col xs={24} md={20}>
                <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
                  {(voucher.branch as any)?.institute?.name || t(LOCALE_KEYS.INSTITUTE)}
                </Title>
                <Text style={{ fontSize: 12 }}>
                  {voucher.branch?.name || ''}
                  {(voucher.branch as any)?.address
                    ? ` - ${[(voucher.branch as any).address.address, (voucher.branch as any).address.city, (voucher.branch as any).address.state, (voucher.branch as any).address.country].filter(Boolean).join(', ')}`
                    : ''}
                </Text>
              </Col>
            </Row>
          </div>

          <Row justify="space-between" align="middle" className="mb-3">
            <Col>
              <Text className="italic" style={{ fontSize: 11 }}>{t(LOCALE_KEYS.ACCOUNTS_VOUCHER)}</Text>
            </Col>
            <Col>
              <div className="border border-black px-6 py-1 text-sm font-bold uppercase">
                {voucher.voucherType?.name || t(LOCALE_KEYS.VOUCHER)}
              </div>
            </Col>
            <Col>
              <Text className="font-bold" style={{ fontSize: 11 }}>{t(LOCALE_KEYS.DATE)}: {dayjs(voucher.voucherDate).format('DD-MMM-YYYY')}</Text>
            </Col>
          </Row>

          <div className="mb-3">
            <Text className="font-bold mr-2" style={{ fontSize: 11 }}>{t(LOCALE_KEYS.VOUCHER_NUMBER)}:</Text>
            <span className="border border-black px-3 py-0.5 font-bold" style={{ fontSize: 11 }}>{voucher.voucherNo}</span>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-black mb-3" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th className="border border-black p-1.5 text-left bg-gray-200 uppercase" rowSpan={2} style={{ fontSize: 10 }}>{t(LOCALE_KEYS.PARTICULARS)}</th>
                <th className="border border-black p-1.5 text-center bg-gray-200" colSpan={2} style={{ fontSize: 10 }}>{t(LOCALE_KEYS.AMOUNT)} ({defaultCurrency?.symbol || 'TK.'})</th>
              </tr>
              <tr>
                <th className="border border-black p-1.5 text-right bg-gray-200" style={{ width: 100, fontSize: 10 }}>{t(LOCALE_KEYS.DEBIT)}</th>
                <th className="border border-black p-1.5 text-right bg-gray-200" style={{ width: 100, fontSize: 10 }}>{t(LOCALE_KEYS.CREDIT)}</th>
              </tr>
            </thead>
            <tbody>
              {voucher.details?.map((detail, index) => (
                <tr key={index}>
                  <td className="border border-black p-1.5">
                    <div className="flex justify-between">
                      <span className="font-bold">{detail.chartOfAccount?.accountName}</span>
                      {detail.costCenter && <span className="text-gray-600" style={{ fontSize: 10 }}>[{detail.costCenter.costName}]</span>}
                    </div>
                    {detail.lineNarration && <div style={{ fontSize: 10, color: '#666' }}>{detail.lineNarration}</div>}
                    
                    {/* Sub entries */}
                    {detail.children && detail.children.length > 0 && (
                        <div className="mt-1 pl-4" style={{ fontSize: 10 }}>
                            {detail.children.map((child, cIdx) => (
                                <div key={cIdx} className="flex justify-between font-semibold">
                                    <span>- {child.costCenter?.costName || 'General'}</span>
                                    <span>{Number(child.amount).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                  </td>
                  <td className="border border-black p-1.5 text-right align-top">
                    {Number(detail.debitAmount) > 0 ? Number(detail.debitAmount).toFixed(2) : ''}
                  </td>
                  <td className="border border-black p-1.5 text-right align-top">
                    {Number(detail.creditAmount) > 0 ? Number(detail.creditAmount).toFixed(2) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-black p-1.5 text-center font-bold uppercase" style={{ fontSize: 10 }}>{t(LOCALE_KEYS.TOTAL)}</td>
                <td className="border border-black p-1.5 text-right font-bold" style={{ borderBottom: '4px double #000' }}>{totalDebit.toFixed(2)}</td>
                <td className="border border-black p-1.5 text-right font-bold" style={{ borderBottom: '4px double #000' }}>{totalCredit.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Info */}
          <div className="mb-3" style={{ fontSize: 11 }}>
            <div className="mb-0.5"><Text style={{ fontSize: 11 }}>{t(LOCALE_KEYS.MODE_OF_PAYMENT)}: {modeOfPayment}</Text></div>
            <div className="mb-1"><Text style={{ fontSize: 11 }}>{t(LOCALE_KEYS.NARRATION)}: {voucher.narration}</Text></div>
            <div className="bg-blue-100 border border-blue-300 p-1.5 text-blue-800 font-semibold italic flex" style={{ fontSize: 11 }}>
                <span className="mr-2">{t(LOCALE_KEYS.IN_WORD)}:</span>
                <span>{numberToWords(totalDebit)} {defaultCurrency?.symbol || 'TK'} {t(LOCALE_KEYS.ONLY)}.</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-16 mb-6">
            <Row justify="space-between">
              <Col><div className="border-t border-black px-3 text-center" style={{ fontSize: 10 }}>{t(LOCALE_KEYS.RECEIVED_BY)}</div></Col>
              <Col>
                <div className="text-center font-bold mb-0.5" style={{ fontSize: 10 }}>{voucher.createdBy || 'SYSTEM'}</div>
                <div className="border-t border-black px-3 text-center" style={{ fontSize: 10 }}>{t(LOCALE_KEYS.PREPARED_BY)}</div>
              </Col>
              <Col><div className="border-t border-black px-3 text-center" style={{ fontSize: 10 }}>{t(LOCALE_KEYS.CHECKED_BY)}</div></Col>
              <Col><div className="border-t border-black px-3 text-center" style={{ fontSize: 10 }}>{t(LOCALE_KEYS.REVIEWED_BY)}</div></Col>
              <Col><div className="border-t border-black px-3 text-center" style={{ fontSize: 10 }}>{t(LOCALE_KEYS.APPROVED_BY)}</div></Col>
            </Row>
          </div>

          <div className="border-y border-black py-0.5 px-2 flex justify-between" style={{ fontSize: 9 }}>
            <span>
              {(voucher.branch as any)?.address?.phone
                || (voucher.branch as any)?.institute?.address?.phone
                || ''}
            </span>
            <span>
              {(voucher.branch as any)?.address?.email
                || (voucher.branch as any)?.institute?.address?.email
                || ''}
            </span>
            <span>
              {(voucher.branch as any)?.institute?.website || ''}
            </span>
          </div>
          <div className="flex justify-between mt-0.5" style={{ fontSize: 9 }}>
            <span>{t(LOCALE_KEYS.PRINT_DATE)}: {dayjs().format('DD-MMM-YYYY')}</span>
            <span>Powered By SFL</span>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 8mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .ant-layout-sider,
          .ant-layout-header,
          .ant-layout-footer {
            display: none !important;
          }
          #voucher-print-area,
          #voucher-print-area * {
            visibility: visible;
          }
          #voucher-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8mm !important;
            border: none !important;
            box-shadow: none !important;
          }
          .ant-card {
            border: none !important;
            box-shadow: none !important;
          }
          table { page-break-inside: avoid; }
          .bg-gray-200 { background: #e5e5e5 !important; }
          .bg-blue-100 { background: #dbeafe !important; }
        }
      `}</style>
    </ProtectedRoute>
  );
}
