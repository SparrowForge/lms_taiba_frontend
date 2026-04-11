'use client';

import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import { IDiscountTemplate } from '@/types/discountTemplate';
import { IFeeInstallmentPlan } from '@/types/feeInstallmentPlan';
import { IFeePaymentCollection } from '@/types/feePaymentCollection';
import { IFeeStructure } from '@/types/feeStructure';

interface FeeStructureInvoiceProps {
  feeStructure: IFeeStructure;
  installmentPlans: IFeeInstallmentPlan[];
  selectedDiscountTemplates: IDiscountTemplate[];
  isInternational: boolean;
  paymentCollections?: IFeePaymentCollection[];
}

export const FeeStructureInvoice: React.FC<FeeStructureInvoiceProps> = ({
  feeStructure,
  installmentPlans,
  selectedDiscountTemplates,
  isInternational,
  paymentCollections,
}) => {
  const { t } = useLocalization();

  const currency = feeStructure.currency || '';

  const baseAfterAdmission = Math.max(
    0,
    Number(feeStructure.totalFees || 0) - Number(feeStructure.admissionFee || 0),
  );

  const discountRows = selectedDiscountTemplates.map((dt) => {
    const amount =
      dt.type === 'percent'
        ? (baseAfterAdmission * Number(dt.amount || 0)) / 100
        : Number(dt.amount || 0);
    return { template: dt, amount };
  });

  const totalDiscount = discountRows.reduce((sum, row) => sum + row.amount, 0);
  const discountedBase = Math.max(0, baseAfterAdmission - totalDiscount);

  const grossBeforeDiscount =
    Number(feeStructure.admissionFee || 0) + baseAfterAdmission;
  const subTotalExclVat =
    Number(feeStructure.admissionFee || 0) + discountedBase;

  // Build installment payment status from collections
  const installmentStatus: Record<number, 'paid' | 'partial' | 'pending'> = {};
  if (paymentCollections) {
    paymentCollections.forEach((payment) => {
      payment.paymentDetails.forEach((detail) => {
        const planId = detail.feeInstallmentPlanId;
        if (detail.balanceAmount === 0) {
          installmentStatus[planId] = 'paid';
        } else if (detail.amountPaid > 0) {
          // Only mark partial if not already fully paid
          if (installmentStatus[planId] !== 'paid') {
            installmentStatus[planId] = 'partial';
          }
        } else if (!installmentStatus[planId]) {
          installmentStatus[planId] = 'pending';
        }
      });
    });
  }
  const vatRate = isInternational ? 0.15 : 0;
  const vatAmount = subTotalExclVat * vatRate;
  const grandTotal = subTotalExclVat + vatAmount;

  const totalPaid = 0;
  const totalVatPaid = 0;
  const totalDue = grandTotal - totalPaid;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Installment summary table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f2f5', textAlign: 'left' }}>
            <th
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #d9d9d9',
              }}
            >
              {t(LOCALE_KEYS.TYPE, { defaultValue: 'Type' })}
            </th>
            <th
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #d9d9d9',
              }}
            >
              {t(LOCALE_KEYS.AMOUNT, { defaultValue: 'Amount' })}
            </th>
            <th
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #d9d9d9',
              }}
            >
              {t(LOCALE_KEYS.DUE_DATE, { defaultValue: 'Due Date' })}
            </th>
            <th
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #d9d9d9',
              }}
            >
              {t(LOCALE_KEYS.STATUS, { defaultValue: 'Status' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Admission fee row */}
          <tr>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
              {t(LOCALE_KEYS.ADMISSION_FEE, { defaultValue: 'Admission Fee' })}
            </td>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
              {currency} {Number(feeStructure.admissionFee || 0).toFixed(2)}
            </td>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>N/A</td>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>Due</td>
          </tr>
          {/* Installment rows */}
          {installmentPlans.map((plan) => {
            const status = installmentStatus[plan.id] || 'pending';
            const label =
              status === 'paid' ? 'Paid' : status === 'partial' ? 'Partially Paid' : 'Due';

            return (
              <tr key={plan.id}>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  {plan.paymentLabel}
                </td>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  {currency} {Number(plan.amount || 0).toFixed(2)}
                </td>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>{label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Invoice summary */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600 }}>
              Sub-Total (before discounts):
            </td>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              {grossBeforeDiscount.toFixed(2)} {currency}
            </td>
          </tr>
          {discountRows.map(({ template, amount }) => (
            <tr key={template.id}>
              <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                Discount -{' '}
                {template.name}{' '}
                ({template.type === 'percent'
                  ? `${template.amount}%`
                  : template.amount})
                :
              </td>
              <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                -{amount.toFixed(2)} {currency}
              </td>
            </tr>
          ))}
          {discountRows.length > 0 && (
            <tr>
              <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600 }}>
                Total Discount:
              </td>
              <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                -{totalDiscount.toFixed(2)} {currency}
              </td>
            </tr>
          )}
          <tr>
            <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600 }}>
              Sub-Total (excl. VAT):
            </td>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              {subTotalExclVat.toFixed(2)} {currency}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600 }}>
              {isInternational ? 'VAT 15%:' : 'VAT 0%:'}
            </td>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              {vatAmount.toFixed(2)} {currency}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#6574cd', color: '#ffffff' }}>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
              Grand Total:
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
              {grandTotal.toFixed(2)} {currency}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              Total Paid:
            </td>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              {totalPaid.toFixed(2)} {currency}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              Total VAT Paid:
            </td>
            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
              {totalVatPaid.toFixed(2)} {currency}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
              Total Due:
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
              {totalDue.toFixed(2)} {currency}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeeStructureInvoice;

