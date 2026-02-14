'use client';

import { useCallback, useEffect, useState } from 'react';

import type { IStudentWithFeeInfo } from '@/types/student';

import type { FeePaymentDetailsRow } from '@/components/feePaymentCollections/FeePaymentCollectionFormBulk/types';

export function useFeePaymentFormDetails(studentWithFeeInfo: IStudentWithFeeInfo | null) {
  const [feePaymentDetailsRows, setFeePaymentDetailsRows] = useState<FeePaymentDetailsRow[]>([]);
  const [originalRows, setOriginalRows] = useState<FeePaymentDetailsRow[]>([]);

  const studentFeeInstallmentPlans = studentWithFeeInfo?.feeStructure?.installmentPlans || [];

  const calculatePlanStatus = useCallback(
    (planId: number, planAmount: number) => {
      if (!studentWithFeeInfo?.paymentCollections) {
        return { status: 'due' as const, amountPaid: 0, balanceAmount: planAmount };
      }
      let totalPaid = 0;
      studentWithFeeInfo.paymentCollections.forEach((collection) => {
        if (collection.paymentDetails) {
          collection.paymentDetails.forEach((detail: { feeInstallmentPlanId: number; amountPaid: number }) => {
            if (detail.feeInstallmentPlanId === planId) {
              totalPaid += detail.amountPaid;
            }
          });
        }
      });
      const balanceAmount = planAmount - totalPaid;
      const status = balanceAmount === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'due';
      return { status, amountPaid: totalPaid, balanceAmount };
    },
    [studentWithFeeInfo],
  );

  useEffect(() => {
    if (
      studentWithFeeInfo?.feeStructure?.installmentPlans &&
      studentWithFeeInfo.feeStructure.installmentPlans.length > 0
    ) {
      const sortedPlans = [...studentWithFeeInfo.feeStructure.installmentPlans].sort(
        (a, b) => a.sequenceNo - b.sequenceNo,
      );
      const autoRows: FeePaymentDetailsRow[] = sortedPlans.map((plan: { id: number; amount: number; paymentLabel: string; sequenceNo: number }) => {
        const planStatus = calculatePlanStatus(plan.id, plan.amount);
        return {
          id: `plan-${plan.id}`,
          feeInstallmentPlanId: plan.id,
          feeTitle: plan.paymentLabel,
          amountDue: plan.amount,
          amountPaid: planStatus.amountPaid,
          balanceAmount: planStatus.balanceAmount,
          status: planStatus.status,
        };
      });
      setFeePaymentDetailsRows(autoRows);
      setOriginalRows(autoRows);
    }
  }, [studentWithFeeInfo, calculatePlanStatus]);

  const allPlansPaidFromAPI =
    feePaymentDetailsRows.length > 0 &&
    feePaymentDetailsRows.every((row) => row.amountPaid >= row.amountDue);

  const updateFeePaymentDetailRow = useCallback(
    (id: string, field: keyof FeePaymentDetailsRow, value: unknown) => {
      setFeePaymentDetailsRows((rows) =>
        rows.map((row) => {
          if (row.id !== id) return row;
          const updatedRow = { ...row, [field]: value } as FeePaymentDetailsRow;
          if (field === 'amountPaid') {
            updatedRow.balanceAmount = updatedRow.amountDue - (Number(value) || 0);
          }
          return updatedRow;
        }),
      );
    },
    [],
  );

  const removeFeePaymentDetailRow = useCallback((id: string) => {
    setFeePaymentDetailsRows((rows) => rows.filter((row) => row.id !== id));
  }, []);

  const distributeAmountPaid = useCallback(
    (totalAmountPaid: number) => {
      const resetRows = originalRows.map((row) => ({
        ...row,
        newAmountPaid: 0,
        newBalanceAmount: row.balanceAmount,
      }));
      const updatedRows = [...resetRows];
      let remainingAmount = totalAmountPaid;

      for (let i = 0; i < resetRows.length && remainingAmount > 0; i++) {
        const currentRow = resetRows[i];
        if (currentRow.status === 'paid') continue;
        const remainingBalance = currentRow.amountDue - currentRow.amountPaid;
        const maxPayment = Math.min(remainingAmount, remainingBalance);
        if (maxPayment > 0) {
          updatedRows[i] = {
            ...currentRow,
            newAmountPaid: maxPayment,
            newBalanceAmount: remainingBalance - maxPayment,
          };
          remainingAmount -= maxPayment;
        }
      }

      const finalRows = updatedRows.map((row) => {
        const newAmountPaid = row.newAmountPaid || 0;
        const actualRemainingBalance = row.amountDue - (row.amountPaid + newAmountPaid);
        return {
          ...row,
          amountPaid: row.amountPaid,
          balanceAmount: Math.max(0, actualRemainingBalance),
          newAmountPaid,
          newBalanceAmount: Math.max(0, actualRemainingBalance),
          status:
            actualRemainingBalance <= 0
              ? ('paid' as const)
              : row.amountPaid + newAmountPaid > 0
                ? ('partial' as const)
                : ('due' as const),
        };
      });
      setFeePaymentDetailsRows(finalRows);
    },
    [originalRows],
  );

  const resetRowsToOriginal = useCallback(() => {
    setFeePaymentDetailsRows(
      originalRows.map((row) => ({
        ...row,
        newAmountPaid: 0,
        newBalanceAmount: row.balanceAmount,
      })),
    );
  }, [originalRows]);

  return {
    feePaymentDetailsRows,
    setFeePaymentDetailsRows,
    originalRows,
    studentFeeInstallmentPlans,
    calculatePlanStatus,
    allPlansPaidFromAPI,
    updateFeePaymentDetailRow,
    removeFeePaymentDetailRow,
    distributeAmountPaid,
    resetRowsToOriginal,
  };
}
