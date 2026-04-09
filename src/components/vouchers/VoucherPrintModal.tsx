'use client';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { currencyService } from '@/services/currencyService';
import { IAccVoucher } from '@/types/voucher';
import { numberToWords } from '@/utils/numberToWords';
import { PrinterOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

const { Title, Text } = Typography;

interface VoucherPrintModalProps {
  voucher: IAccVoucher | null;
  open: boolean;
  onClose: () => void;
}

export const VoucherPrintModal = ({ voucher, open, onClose }: VoucherPrintModalProps) => {
  const { t } = useLocalization();
  const printRef = useRef<HTMLDivElement>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<{ symbol: string; code: string } | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      currencyService.getCurrencies({ page: 1, limit: 100 }).then((res) => {
        const def = res.data.items.find((c: any) => c.isDefault);
        if (def) {
          setDefaultCurrency({ symbol: def.symbol, code: def.code });
        }
      });
    }
  }, [open]);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Voucher - ${voucher?.voucherNo || ''}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 10mm;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11px;
              color: #000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .voucher-container { width: 100%; }
            .header-row { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
            .logo-box { width: 50px; height: 50px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border-radius: 4px; margin-right: 12px; flex-shrink: 0; }
            .company-name { font-size: 20px; font-weight: bold; margin: 0; }
            .company-address { font-size: 11px; color: #333; }
            .meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .voucher-type-box { border: 1px solid #000; padding: 4px 24px; font-size: 14px; font-weight: bold; text-transform: uppercase; }
            .voucher-no-row { margin-bottom: 8px; }
            .voucher-no-box { border: 1px solid #000; padding: 2px 12px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            th, td { border: 1px solid #000; padding: 4px 6px; }
            th { background: #e5e5e5; text-transform: uppercase; font-size: 10px; }
            td { font-size: 11px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .align-top { vertical-align: top; }
            .w-col-amount { width: 100px; }
            .total-cell { border-bottom: 4px double #000 !important; }
            .sub-entries { padding-left: 16px; margin-top: 2px; font-size: 10px; }
            .sub-entries div { display: flex; justify-content: space-between; }
            .narration-line { font-size: 10px; color: #555; }
            .cost-center-tag { color: #666; }
            .in-word-box { background: #dbeafe; border: 1px solid #93c5fd; padding: 4px 8px; color: #1e40af; font-weight: 600; font-style: italic; display: flex; margin-bottom: 8px; }
            .footer-info { margin-bottom: 6px; }
            .footer-info div { margin-bottom: 2px; }
            .signatures { margin-top: 60px; margin-bottom: 12px; display: flex; justify-content: space-between; }
            .sig-block { text-align: center; }
            .sig-line { border-top: 1px solid #000; padding: 2px 16px; }
            .sig-name { font-weight: bold; margin-bottom: 2px; }
            .branding-row { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 2px 4px; display: flex; justify-content: space-between; font-size: 9px; }
            .print-date-row { display: flex; justify-content: space-between; font-size: 9px; margin-top: 2px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  if (!open) return null;

  const totalDebit = voucher?.details?.reduce((sum, d) => sum + Number(d.debitAmount), 0) || 0;
  const totalCredit = voucher?.details?.reduce((sum, d) => sum + Number(d.creditAmount), 0) || 0;

  let modeOfPayment = t(LOCALE_KEYS.CASH);
  if (voucher?.details) {
    const isCheque = voucher.details.some((d) => d.chequeNo);
    const isBank = voucher.details.some((d) => (d.chartOfAccount as any)?.isBank);
    if (isCheque) modeOfPayment = t(LOCALE_KEYS.CHEQUE);
    else if (isBank) modeOfPayment = t(LOCALE_KEYS.BANK_TRANSFER);
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      centered
      title={
        voucher
          ? `${voucher.voucherType?.name || t(LOCALE_KEYS.VOUCHER)} - ${voucher.voucherNo}`
          : t(LOCALE_KEYS.PRINT)
      }
      footer={[
        <Button key="close" onClick={onClose}>
          {t(LOCALE_KEYS.CLOSE)}
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          disabled={!voucher}
        >
          {t(LOCALE_KEYS.PRINT)}
        </Button>,
      ]}
      styles={{ body: { maxHeight: '75vh', overflowY: 'auto' } }}
    >
      {!voucher ? (
        <div className="text-center py-16">{t(LOCALE_KEYS.VOUCHER_NOT_FOUND)}</div>
      ) : (
        <div ref={printRef}>
          <style>{`
            .voucher-container { width: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; color: #000; }
            .header-row { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .logo-box { width: 50px; height: 50px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border-radius: 4px; margin-right: 14px; flex-shrink: 0; }
            .company-name { font-size: 22px; font-weight: bold; margin: 0; }
            .company-address { font-size: 12px; color: #333; }
            .meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .voucher-type-box { border: 1px solid #000; padding: 4px 28px; font-size: 15px; font-weight: bold; text-transform: uppercase; }
            .voucher-no-row { margin-bottom: 10px; }
            .voucher-no-box { border: 1px solid #000; padding: 2px 14px; font-weight: bold; }
            .voucher-container table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            .voucher-container th, .voucher-container td { border: 1px solid #000; padding: 5px 8px; }
            .voucher-container th { background: #e5e5e5; text-transform: uppercase; font-size: 11px; }
            .voucher-container td { font-size: 12px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .align-top { vertical-align: top; }
            .w-col-amount { width: 110px; }
            .total-cell { border-bottom: 4px double #000 !important; }
            .sub-entries { padding-left: 16px; margin-top: 4px; font-size: 11px; }
            .sub-entries div { display: flex; justify-content: space-between; }
            .narration-line { font-size: 11px; color: #555; }
            .cost-center-tag { color: #666; font-size: 11px; }
            .in-word-box { background: #dbeafe; border: 1px solid #93c5fd; padding: 6px 10px; color: #1e40af; font-weight: 600; font-style: italic; display: flex; margin-bottom: 10px; border-radius: 4px; }
            .footer-info { margin-bottom: 8px; }
            .footer-info div { margin-bottom: 3px; }
            .signatures { margin-top: 50px; margin-bottom: 14px; display: flex; justify-content: space-between; }
            .sig-block { text-align: center; }
            .sig-line { border-top: 1px solid #000; padding: 3px 18px; margin-top: 2px; }
            .sig-name { font-weight: bold; margin-bottom: 2px; }
            .branding-row { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 3px 6px; display: flex; justify-content: space-between; font-size: 10px; }
            .print-date-row { display: flex; justify-content: space-between; font-size: 10px; margin-top: 3px; }
          `}</style>
          <div className="voucher-container">
            {/* Header */}
            <div className="header-row">
              <div>
                <div className="company-name">
                  {voucher.branch?.institute?.name || t(LOCALE_KEYS.INSTITUTE_NAME)}
                </div>
                <div className="company-address">
                  {voucher.branch?.name || ''}
                  {voucher.branch?.address
                    ? ` - ${[voucher.branch.address.address, voucher.branch.address.city, voucher.branch.address.state, voucher.branch.address.country].filter(Boolean).join(', ')}`
                    : ''}
                </div>
              </div>
            </div>

            {/* Meta row */}
            <div className="meta-row">
              <div style={{ fontStyle: 'italic' }}>{t(LOCALE_KEYS.ACCOUNTS_VOUCHER)}</div>
              <div className="voucher-type-box">
                {voucher.voucherType?.name || t(LOCALE_KEYS.VOUCHER)}
              </div>
              <div className="font-bold">
                {t(LOCALE_KEYS.DATE)}: {dayjs(voucher.voucherDate).format('DD-MMM-YYYY')}
              </div>
            </div>

            {/* Voucher Number */}
            <div className="voucher-no-row">
              <span className="font-bold" style={{ marginRight: 8 }}>
                {t(LOCALE_KEYS.VOUCHER_NUMBER)}:
              </span>
              <span className="voucher-no-box">{voucher.voucherNo}</span>
            </div>

            {/* Table */}
            <table>
              <thead>
                <tr>
                  <th className="text-left" rowSpan={2}>
                    {t(LOCALE_KEYS.PARTICULARS)}
                  </th>
                  <th className="text-center" colSpan={2}>
                    {t(LOCALE_KEYS.AMOUNT)} ({defaultCurrency?.symbol || 'TK.'})
                  </th>
                </tr>
                <tr>
                  <th className="text-right w-col-amount">{t(LOCALE_KEYS.DEBIT)}</th>
                  <th className="text-right w-col-amount">{t(LOCALE_KEYS.CREDIT)}</th>
                </tr>
              </thead>
              <tbody>
                {voucher.details?.map((detail, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="font-bold">{detail.chartOfAccount?.accountName}</span>
                        {detail.costCenter && (
                          <span className="cost-center-tag">[{detail.costCenter.costName}]</span>
                        )}
                      </div>
                      {detail.lineNarration && (
                        <div className="narration-line">{detail.lineNarration}</div>
                      )}
                      {detail.children && detail.children.length > 0 && (
                        <div className="sub-entries">
                          {detail.children.map((child: any, cIdx: number) => (
                            <div key={cIdx}>
                              <span>- {child.costCenter?.costName || t(LOCALE_KEYS.GENERAL)}</span>
                              <span>{Number(child.amount).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="text-right align-top">
                      {Number(detail.debitAmount) > 0 ? Number(detail.debitAmount).toFixed(2) : ''}
                    </td>
                    <td className="text-right align-top">
                      {Number(detail.creditAmount) > 0
                        ? Number(detail.creditAmount).toFixed(2)
                        : ''}
                      {detail.currency && detail.currencyExRate && detail.currencyExRate !== 1 && (
                        <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#666' }}>
                          (
                          {(
                            Number(detail.debitAmount || detail.creditAmount) /
                            detail.currencyExRate
                          ).toFixed(2)}{' '}
                          {detail.currency.code})
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="text-center font-bold" style={{ textTransform: 'uppercase' }}>
                    {t(LOCALE_KEYS.TOTAL)}
                  </td>
                  <td className="text-right font-bold total-cell">{totalDebit.toFixed(2)}</td>
                  <td className="text-right font-bold total-cell">{totalCredit.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Footer Info */}
            <div className="footer-info">
              <div>
                {t(LOCALE_KEYS.MODE_OF_PAYMENT)}: {modeOfPayment}
              </div>
              <div>
                {t(LOCALE_KEYS.NARRATION)}: {voucher.narration}
              </div>
            </div>
            <div className="in-word-box">
              <span style={{ marginRight: 6 }}>{t(LOCALE_KEYS.IN_WORD)}:</span>
              <span>
                {numberToWords(totalDebit)} {defaultCurrency?.code || 'TK'} {t(LOCALE_KEYS.ONLY)}.
              </span>
            </div>

            {/* Signatures */}
            <div className="signatures">
              <div className="sig-block">
                <div className="sig-line">{t(LOCALE_KEYS.RECEIVED_BY)}</div>
              </div>
              <div className="sig-block">
                <div className="sig-name">{voucher.createdBy || 'SYSTEM'}</div>
                <div className="sig-line">{t(LOCALE_KEYS.PREPARED_BY)}</div>
              </div>
              <div className="sig-block">
                <div className="sig-line">{t(LOCALE_KEYS.CHECKED_BY)}</div>
              </div>
              <div className="sig-block">
                <div className="sig-line">{t(LOCALE_KEYS.REVIEWED_BY)}</div>
              </div>
              <div className="sig-block">
                <div className="sig-line">{t(LOCALE_KEYS.APPROVED_BY)}</div>
              </div>
            </div>

            {/* Branding */}
            <div className="branding-row">
              <span>
                {t(LOCALE_KEYS.PHONE)}:{' '}
                {voucher.branch?.address?.phone || voucher.branch?.institute?.address?.phone || ''}
              </span>
              <span>
                {t(LOCALE_KEYS.EMAIL)}:{' '}
                {voucher.branch?.address?.email || voucher.branch?.institute?.address?.email || ''}
              </span>
              <span>
                {t(LOCALE_KEYS.WEBSITE)}: {voucher.branch?.institute?.website || ''}
              </span>
              <span>
                {t(LOCALE_KEYS.PRINT_DATE)}: {dayjs().format('DD-MMM-YYYY')}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
