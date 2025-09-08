'use client';

import {Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {DISCOUNT_TYPE_OPTIONS, DiscountType, PAYMENT_TYPE_OPTIONS, PaymentType, Status,} from '@/enums';

import {useBatches} from '@/hooks/useBatches';
import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';

import {getErrorMessage} from '@/types/errors';
import {IFeeInstallmentPlanCreate} from '@/types/feeInstallmentPlan';
import {IFeeStructure, IFeeStructureBulkCreate, IFeeStructureCreate} from '@/types/feeStructure';

import {StatusSelect, StatusSelectFormItem} from '../ui/StatusSelect';

interface FeeStructureFormBulkProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface PaymentRow {
  id: string;
  semester: string | number; // Can be string (from UI) or number (when mapped)
  sequenceNo: number;
  paymentLabel: string;
  durationMonths: number;
  amount: number;
  discountAmount: number;
  dueDate: Dayjs | null;
  semesterStartDate: string;
  semesterEndDate: string;
}

interface MonthlyPaymentRow {
  id: string;
  semesterId: number;
  semesterName: string;
  monthNumber: number;
  monthName: string;
  sequenceNo: number;
  paymentLabel: string;
  amount: number;
  discountAmount: number;
  dueDate: Dayjs | null;
  startDate: Dayjs;
  endDate: Dayjs;
  isBreak: boolean;
}

const FeeStructureFormBulk: React.FC<FeeStructureFormBulkProps> = ({ onSuccess, onCancel }) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFeeStructure, createFeeStructureBulk, actionStatus } = useFeeStructures();
  const { batches, loadBatches } = useBatches();
  const { semesters, loadSemesters, listStatus } = useSemesters();

  // New state for installment logic
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);
  const [monthlyPaymentRows, setMonthlyPaymentRows] = useState<MonthlyPaymentRow[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [semesterOptions, setSemesterOptions] = useState<{ label: string; value: string }[]>([]);
  // const [loadingSemesters, setLoadingSemesters] = useState(false);

  // Helper function to calculate amount per semester/month after admission fee and discount
  const calculateAmountPerPeriod = useCallback(
    (totalFees: number, periodCount: number) => {
      // Get current form values for admission fee and discount
      const admissionFee = Number(form.getFieldValue('admissionFee') || 0);
      const discountType = form.getFieldValue('discountType');
      const discountAmount = Number(form.getFieldValue('discountAmount') || 0);

      // Calculate remaining fees after subtracting admission fee
      const remainingFees = totalFees - admissionFee;

      // Apply discount to remaining fees
      let discountedFees = remainingFees;
      if (discountType === 'percent' && discountAmount > 0) {
        discountedFees = remainingFees * (1 - discountAmount / 100);
      } else if (discountType === 'fixed' && discountAmount > 0) {
        discountedFees = remainingFees - discountAmount;
      }
      // If discountType is 'none', no discount is applied

      // Ensure discounted fees is not negative
      discountedFees = Math.max(0, discountedFees);

      // Return the exact amount without rounding to avoid validation issues
      // The rounding will be handled at the UI level for display purposes
      return discountedFees / periodCount;
    },
    [form],
  );

  // Helper function to calculate discount amount per period
  const calculateDiscountPerPeriod = useCallback(
    (totalFees: number, periodCount: number) => {
      // Get current form values for admission fee and discount
      const admissionFee = Number(form.getFieldValue('admissionFee') || 0);
      const discountType = form.getFieldValue('discountType');
      const discountAmount = Number(form.getFieldValue('discountAmount') || 0);

      // Calculate remaining fees after subtracting admission fee
      const remainingFees = totalFees - admissionFee;

      // Calculate discount per period
      let discountPerPeriod = 0;
      if (discountType === 'percent' && discountAmount > 0) {
        // For percentage discount, calculate the discount amount per period
        const totalDiscountAmount = remainingFees * (discountAmount / 100);
        discountPerPeriod = totalDiscountAmount / periodCount;
      } else if (discountType === 'fixed' && discountAmount > 0) {
        // For fixed discount, divide the fixed amount across periods
        discountPerPeriod = discountAmount / periodCount;
      }
      // If discountType is 'none', no discount is applied

      // Return the exact amount without rounding to avoid validation issues
      // The rounding will be handled at the UI level for display purposes
      return Math.max(0, discountPerPeriod);
    },
    [form],
  );

  // Helper function to calculate duration in months between two dates
  const calculateDurationInMonths = useCallback((startDate: string, endDate: string) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const duration = end.diff(start, 'month', true); // true for fractional months
    return Math.round(duration * 100) / 100; // Round to 2 decimal places
  }, []);

  // Helper function to format numbers for display (2 decimal places)
  const formatForDisplay = useCallback((value: number) => {
    return Math.round(value * 100) / 100;
  }, []);

  // Helper function to recalculate due dates based on days before semester start
  const recalculateDueDates = useCallback((daysBeforeStart: number) => {
    setPaymentRows((prev) =>
      prev.map((row) => {
        if (row.semesterStartDate) {
          const semesterStart = dayjs(row.semesterStartDate);
          const dueDate = semesterStart.subtract(daysBeforeStart, 'day');
          return { ...row, dueDate };
        }
        return row;
      }),
    );
  }, []);

  // Helper function to recalculate monthly due dates based on days before month start
  const recalculateMonthlyDueDates = useCallback((daysBeforeMonthStart: number) => {
    setMonthlyPaymentRows((prev) =>
      prev.map((row) => {
        if (row.startDate) {
          const monthStart = dayjs(row.startDate).startOf('month');
          const dueDate = monthStart.subtract(daysBeforeMonthStart, 'day');
          return { ...row, dueDate };
        }
        return row;
      }),
    );
  }, []);

  // Helper function to handle month break status change and redistribute amounts
  const handleMonthBreakChange = useCallback(
    (monthId: string, isBreak: boolean) => {
      setMonthlyPaymentRows((prev) => {
        const updatedRows = prev.map((row) =>
          row.id === monthId
            ? {
                ...row,
                isBreak,
                amount: isBreak ? 0 : row.amount,
                discountAmount: isBreak ? 0 : row.discountAmount,
              }
            : row,
        );

        // If we're setting a month as break, redistribute amounts to active months
        if (isBreak) {
          const totalFeesValue = form.getFieldValue('totalFees');
          if (totalFeesValue) {
            const totalFeesNumber = Number(totalFeesValue);
            const activeMonths = updatedRows.filter((row) => !row.isBreak);
            const activeMonthCount = activeMonths.length;

            if (activeMonthCount > 0) {
              const amountPerMonth = calculateAmountPerPeriod(totalFeesNumber, activeMonthCount);
              const discountPerMonth = calculateDiscountPerPeriod(
                totalFeesNumber,
                activeMonthCount,
              );

              return updatedRows.map((row) => ({
                ...row,
                amount: row.isBreak ? 0 : amountPerMonth,
                discountAmount: row.isBreak ? 0 : discountPerMonth,
              }));
            }
          }
        }

        return updatedRows;
      });
    },
    [form, calculateAmountPerPeriod, calculateDiscountPerPeriod],
  );

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
  }, [loadBatches]);

  useEffect(() => {
    form.resetFields();
  }, [form]);

  // Watch for payment type changes using Form.useWatch
  const currentPaymentType = Form.useWatch('paymentType', form);
  const totalFees = Form.useWatch('totalFees', form);
  const admissionFee = Form.useWatch('admissionFee', form);
  const discountType = Form.useWatch('discountType', form);
  const discountAmount = Form.useWatch('discountAmount', form);
  const dueDateDaysBeforeStart = Form.useWatch('dueDateDaysBeforeStart', form);
  const dueDateDaysBeforeMonthStart = Form.useWatch('dueDateDaysBeforeMonthStart', form);

  // Generate monthly payment rows when payment type is monthly
  const generateMonthlyPaymentRows = useCallback(() => {
    if (currentPaymentType === 'monthly' && selectedBatch && semesters.length > 0) {
      const monthlyRows: MonthlyPaymentRow[] = [];
      let globalSequenceNo = 1;

      semesters.forEach((semester, semesterIndex) => {
        const semesterStartDate = new Date(semester.startDate);
        const semesterEndDate = new Date(semester.endDate);

        // Calculate months between start and end dates
        const months = [];
        const currentDate = new Date(semesterStartDate);

        while (currentDate <= semesterEndDate) {
          const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

          months.push({
            start: monthStart,
            end: monthEnd,
            monthNumber: currentDate.getMonth() + 1,
            monthName: currentDate.toLocaleDateString('en-US', { month: 'long' }),
          });

          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Create monthly rows for this semester
        months.forEach((month, monthIndex) => {
          monthlyRows.push({
            id: `monthly_${semester.id}_${month.monthNumber}`,
            semesterId: semester.id,
            semesterName: semester.name,
            monthNumber: month.monthNumber,
            monthName: month.monthName,
            sequenceNo: globalSequenceNo++,
            paymentLabel: `${semester.name} - ${month.monthName}`,
            amount: 0, // Will be calculated based on total fees
            discountAmount: 0,
            dueDate: null,
            startDate: month.start as any, // Convert to Dayjs
            endDate: month.end as any,
            isBreak: false, // Default to not break
          });
        });
      });

      setMonthlyPaymentRows(monthlyRows);
    }
  }, [currentPaymentType, selectedBatch, semesters]);

  // Get missing semester numbers
  const getMissingSemesterNumbers = useCallback(() => {
    if (!selectedBatch || !semesters.length) return '';

    const expectedSemesters = selectedBatch.course.durationInSemesters;
    const existingTermNumbers = semesters.map((s: any) => s.termNo).sort((a, b) => a - b);
    const missingNumbers = [];

    for (let i = 1; i <= expectedSemesters; i++) {
      if (!existingTermNumbers.includes(i)) {
        missingNumbers.push(i);
      }
    }

    if (missingNumbers.length === 0) return '';

    return missingNumbers.length === 1
      ? `Semester ${missingNumbers[0]}`
      : `Semesters ${missingNumbers.join(', ')}`;
  }, [selectedBatch, semesters]);

  // Get break semester information
  const getBreakSemesterInfo = useCallback(() => {
    if (!semesters.length) return null;

    const breakSemesters = semesters.filter((s: any) => s.isBreak);
    if (breakSemesters.length === 0) return null;

    return {
      count: breakSemesters.length,
      names: breakSemesters.map((s: any) => s.name).join(', '),
    };
  }, [semesters]);

  // Reset payment rows when payment type changes
  useEffect(() => {
    if (currentPaymentType && currentPaymentType !== 'installment') {
      setPaymentRows([]);
    }
    if (currentPaymentType && currentPaymentType !== 'monthly') {
      setMonthlyPaymentRows([]);
    }

    // Generate monthly rows when payment type becomes monthly
    if (currentPaymentType === 'monthly') {
      generateMonthlyPaymentRows();
    }
  }, [currentPaymentType, generateMonthlyPaymentRows]);

  // Auto-distribute total fees across semesters when totalFees changes
  useEffect(() => {
    if (
      currentPaymentType === 'installment' &&
      selectedBatch &&
      paymentRows.length > 0 &&
      totalFees
    ) {
      const totalFeesNumber = Number(totalFees);
      if (totalFeesNumber > 0) {
        // Use actual number of non-break semesters for calculation
        const nonBreakSemesterCount = paymentRows.length;
        const amountPerSemester = calculateAmountPerPeriod(totalFeesNumber, nonBreakSemesterCount);
        const discountPerSemester = calculateDiscountPerPeriod(
          totalFeesNumber,
          nonBreakSemesterCount,
        );

        setPaymentRows((prev) =>
          prev.map((row) => ({
            ...row,
            amount: amountPerSemester,
            discountAmount: discountPerSemester,
          })),
        );
      }
    }
  }, [
    totalFees,
    admissionFee,
    discountType,
    discountAmount,
    currentPaymentType,
    selectedBatch,
    paymentRows.length,
    calculateAmountPerPeriod,
    calculateDiscountPerPeriod,
  ]);

  // Auto-distribute total fees across monthly payments when totalFees changes
  useEffect(() => {
    if (currentPaymentType === 'monthly' && monthlyPaymentRows.length > 0 && totalFees) {
      const totalFeesNumber = Number(totalFees);
      if (totalFeesNumber > 0) {
        // Only count non-break months for distribution
        const activeMonths = monthlyPaymentRows.filter((row) => !row.isBreak);
        const activeMonthCount = activeMonths.length;

        if (activeMonthCount > 0) {
          const amountPerMonth = calculateAmountPerPeriod(totalFeesNumber, activeMonthCount);
          const discountPerMonth = calculateDiscountPerPeriod(totalFeesNumber, activeMonthCount);

          setMonthlyPaymentRows((prev) =>
            prev.map((row) => ({
              ...row,
              amount: row.isBreak ? 0 : amountPerMonth,
              discountAmount: row.isBreak ? 0 : discountPerMonth,
            })),
          );
        }
      }
    }
  }, [
    totalFees,
    admissionFee,
    discountType,
    discountAmount,
    currentPaymentType,
    monthlyPaymentRows.length,
    calculateAmountPerPeriod,
    calculateDiscountPerPeriod,
  ]);

  // Auto-calculate due dates when due date days before start changes
  useEffect(() => {
    if (dueDateDaysBeforeStart && paymentRows.length > 0) {
      recalculateDueDates(dueDateDaysBeforeStart);
    }
  }, [dueDateDaysBeforeStart, paymentRows.length, recalculateDueDates]);

  // Auto-calculate monthly due dates when due date days before month start changes
  useEffect(() => {
    if (dueDateDaysBeforeMonthStart && monthlyPaymentRows.length > 0) {
      recalculateMonthlyDueDates(dueDateDaysBeforeMonthStart);
    }
  }, [dueDateDaysBeforeMonthStart, monthlyPaymentRows.length, recalculateMonthlyDueDates]);

  // Generate payment rows when semesters are loaded and payment type is installment or monthly
  useEffect(() => {
    if (selectedBatch) {
      if (currentPaymentType === 'installment') {
        // Generate installment payment rows only for existing semesters
        const semesterOptions: { label: string; value: string }[] = [];
        const newPaymentRows: PaymentRow[] = [];

        // Sort semesters by termNo to maintain proper sequence and filter out break semesters
        const sortedSemesters = [...semesters]
          .filter((semester: any) => !semester.isBreak) // Exclude break semesters
          .sort((a: any, b: any) => a.termNo - b.termNo);

        sortedSemesters.forEach((semester: any, index: number) => {
          semesterOptions.push({
            label: semester.name,
            value: semester.id.toString(),
          });

          // Calculate duration in months from semester start to end date
          const durationMonths = calculateDurationInMonths(semester.startDate, semester.endDate);

          // Create payment row with real semester data
          newPaymentRows.push({
            id: semester.id.toString(),
            semester: semester.id.toString(),
            sequenceNo: index + 1, // Use index + 1 for proper sequence
            paymentLabel: `${semester.name} Fee`,
            durationMonths: durationMonths, // Already rounded to 2 decimal places
            amount: 0,
            discountAmount: 0,
            dueDate: null,
            semesterStartDate: semester.startDate,
            semesterEndDate: semester.endDate,
          });
        });

        setSemesterOptions(semesterOptions);
        setPaymentRows(newPaymentRows);
      } else if (currentPaymentType === 'monthly') {
        // Generate monthly payment rows
        generateMonthlyPaymentRows();
      }
    }
  }, [semesters, currentPaymentType, selectedBatch, generateMonthlyPaymentRows]);

  // Handle batch selection to load semesters
  const handleBatchChange = async (batchId: string | number) => {
    const batch = batches.find((b) => String(b.id) === String(batchId));
    setSelectedBatch(batch);

    // Set academic year from batch and disable the field
    if (batch?.academicYear) {
      form.setFieldValue('academicYear', batch.academicYear);
    }

    if (batch?.course?.durationInSemesters) {
      try {
        // Load semesters for this specific batch
        await loadSemesters({ batchId: Number(batchId), page: 1, limit: 100 });
      } catch (error) {
        console.error('Failed to load semesters for batch:', error);
      }
    } else {
      setSemesterOptions([]);
      setPaymentRows([]);
      setMonthlyPaymentRows([]);
    }
  };

  // Payment rows are automatically generated based on batch selection
  // No need for add/delete functionality since batch has fixed number of semesters

  // Update payment row
  const updatePaymentRow = (id: string, field: keyof PaymentRow, value: any) => {
    setPaymentRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  // Submit function for one-time payment
  const handleOneTimeSubmit = async (values: Partial<IFeeStructure>) => {
    try {
      // Validate basic form values
      const formTotalFees = Number(values.totalFees) || 0;
      const formAdmissionFee = Number(values.admissionFee) || 0;
      const formDiscountType = values.discountType;
      const formDiscountAmount = Number(values.discountAmount) || 0;

      // Validate admission fee doesn't exceed total fees
      if (formAdmissionFee >= formTotalFees) {
        toast.error('Admission fee cannot be greater than or equal to total fees');
        return;
      }

      // Validate discount amounts
      if (
        formDiscountType === DiscountType.PERCENT &&
        (formDiscountAmount < 0 || formDiscountAmount > 100)
      ) {
        toast.error('Percentage discount must be between 0 and 100');
        return;
      }
      if (formDiscountType === DiscountType.FIXED && formDiscountAmount < 0) {
        toast.error('Fixed discount amount cannot be negative');
        return;
      }

      // Validate that discount doesn't exceed remaining amount after admission fee
      const remainingAfterAdmission = formTotalFees - formAdmissionFee;
      if (formDiscountType === DiscountType.FIXED && formDiscountAmount > remainingAfterAdmission) {
        toast.error(
          `Fixed discount amount (${formDiscountAmount}) cannot exceed the remaining amount after admission fee (${remainingAfterAdmission})`,
        );
        return;
      }

      const payload = { ...values };
      // Remove calculation-only fields from submission
      delete (payload as any).dueDateDaysBeforeStart;
      delete (payload as any).dueDateDaysBeforeMonthStart;
      await createFeeStructure(payload as IFeeStructureCreate);
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/fee-structures');
      }
    } catch (error: unknown) {
      handleSubmitError(error);
    }
  };

  // Submit function for installment payments
  const handleInstallmentSubmit = async (values: Partial<IFeeStructure>) => {
    try {
      // Validate basic form values
      const formTotalFees = Number(values.totalFees) || 0;
      const formAdmissionFee = Number(values.admissionFee) || 0;
      const formDiscountType = values.discountType;
      const formDiscountAmount = Number(values.discountAmount) || 0;

      // Validate admission fee doesn't exceed total fees
      if (formAdmissionFee >= formTotalFees) {
        toast.error('Admission fee cannot be greater than or equal to total fees');
        return;
      }

      // Validate discount amounts
      if (
        formDiscountType === DiscountType.PERCENT &&
        (formDiscountAmount < 0 || formDiscountAmount > 100)
      ) {
        toast.error('Percentage discount must be between 0 and 100');
        return;
      }
      if (formDiscountType === DiscountType.FIXED && formDiscountAmount < 0) {
        toast.error('Fixed discount amount cannot be negative');
        return;
      }

      // Validate that discount doesn't exceed remaining amount after admission fee
      const remainingAfterAdmission = formTotalFees - formAdmissionFee;
      if (formDiscountType === DiscountType.FIXED && formDiscountAmount > remainingAfterAdmission) {
        toast.error(
          `Fixed discount amount (${formDiscountAmount}) cannot exceed the remaining amount after admission fee (${remainingAfterAdmission})`,
        );
        return;
      }

      // Validate that all installment rows have required fields
      const invalidRows = paymentRows.filter(
        (row) => !row.paymentLabel || row.amount <= 0 || !row.dueDate,
      );

      if (invalidRows.length > 0) {
        const errorDetails = invalidRows
          .map((row) => {
            const missingFields = [];
            if (!row.paymentLabel) missingFields.push('Payment Label');
            if (row.amount <= 0) missingFields.push('Amount');
            if (!row.dueDate) missingFields.push('Due Date');

            return `Row ${row.sequenceNo}: Missing ${missingFields.join(', ')}`;
          })
          .join('\n');

        toast.error(`Please fill in all required fields:\n${errorDetails}`);
        return;
      }

      // Validate that sum of semester amounts equals the amount after admission fee and discount
      const totalSemesterAmounts = paymentRows.reduce((sum, row) => sum + row.amount, 0);

      // Calculate expected amount after admission fee and discount
      let expectedAmountAfterDiscount = remainingAfterAdmission;

      if (formDiscountType === DiscountType.PERCENT && formDiscountAmount > 0) {
        expectedAmountAfterDiscount = remainingAfterAdmission * (1 - formDiscountAmount / 100);
      } else if (formDiscountType === DiscountType.FIXED && formDiscountAmount > 0) {
        expectedAmountAfterDiscount = remainingAfterAdmission - formDiscountAmount;
      }

      expectedAmountAfterDiscount = Math.max(0, expectedAmountAfterDiscount);

      if (Math.abs(totalSemesterAmounts - expectedAmountAfterDiscount) > 0.01) {
        toast.error(
          `Amount mismatch: Expected ${expectedAmountAfterDiscount.toFixed(2)} after admission fee (${formAdmissionFee}) and discount (${formDiscountType === 'percent' ? formDiscountAmount + '%' : formDiscountAmount}), but sum of semester amounts is ${totalSemesterAmounts.toFixed(2)}`,
        );
        return;
      }

      // Create single fee structure with installment plans
      const { dueDateDaysBeforeStart, dueDateDaysBeforeMonthStart, ...submissionValues } =
        values as any; // Remove calculation-only fields
      const payload: IFeeStructureBulkCreate = {
        ...submissionValues,
        totalFees: Number(values.totalFees) || 0,
        admissionFee: Number(values.admissionFee) || 0,
        discountAmount: Number(values.discountAmount) || 0,
        feeInstallmentPlans: paymentRows.map(
          (row) =>
            ({
              sequenceNo: row.sequenceNo,
              paymentLabel: row.paymentLabel,
              semesterId: Number(row.semester) || 0,
              durationMonths: row.durationMonths,
              amount: row.amount,
              discountAmount: row.discountAmount,
              dueDate: row.dueDate ? row.dueDate.format('YYYY-MM-DD') : '',
            }) as Omit<IFeeInstallmentPlanCreate, 'feeStructureId'>,
        ),
      } as IFeeStructureBulkCreate;

      console.log('Creating fee structure with installment plans:', payload);
      await createFeeStructureBulk(payload);
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: `${entityName} with Installment Plans` }));

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/fee-structures');
      }
    } catch (error: unknown) {
      handleSubmitError(error);
    }
  };

  // Submit function for monthly payments
  const handleMonthlySubmit = async (values: Partial<IFeeStructure>) => {
    try {
      // Validate basic form values
      const formTotalFees = Number(values.totalFees) || 0;
      const formAdmissionFee = Number(values.admissionFee) || 0;
      const formDiscountType = values.discountType;
      const formDiscountAmount = Number(values.discountAmount) || 0;

      // Validate admission fee doesn't exceed total fees
      if (formAdmissionFee >= formTotalFees) {
        toast.error('Admission fee cannot be greater than or equal to total fees');
        return;
      }

      // Validate discount amounts
      if (
        formDiscountType === DiscountType.PERCENT &&
        (formDiscountAmount < 0 || formDiscountAmount > 100)
      ) {
        toast.error('Percentage discount must be between 0 and 100');
        return;
      }
      if (formDiscountType === DiscountType.FIXED && formDiscountAmount < 0) {
        toast.error('Fixed discount amount cannot be negative');
        return;
      }

      // Validate that discount doesn't exceed remaining amount after admission fee
      const remainingAfterAdmission = formTotalFees - formAdmissionFee;
      if (formDiscountType === DiscountType.FIXED && formDiscountAmount > remainingAfterAdmission) {
        toast.error(
          `Fixed discount amount (${formDiscountAmount}) cannot exceed the remaining amount after admission fee (${remainingAfterAdmission})`,
        );
        return;
      }

      // Validate that all monthly rows have required fields (exclude break months from amount validation)
      const invalidRows = monthlyPaymentRows.filter(
        (row) =>
          !row.paymentLabel || (!row.isBreak && row.amount <= 0) || (!row.isBreak && !row.dueDate),
      );

      if (invalidRows.length > 0) {
        const errorDetails = invalidRows
          .map((row) => {
            const missingFields = [];
            if (!row.paymentLabel) missingFields.push('Payment Label');
            if (!row.isBreak && row.amount <= 0) missingFields.push('Amount');
            if (!row.isBreak && !row.dueDate) missingFields.push('Due Date');

            return `Row ${row.sequenceNo}: Missing ${missingFields.join(', ')}`;
          })
          .join('\n');

        toast.error(`Please fill in all required fields:\n${errorDetails}`);
        return;
      }

      // Validate that sum of monthly amounts equals the amount after admission fee and discount
      const totalMonthlyAmounts = monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0);

      // Calculate expected amount after admission fee and discount
      let expectedAmountAfterDiscount = remainingAfterAdmission;

      if (formDiscountType === DiscountType.PERCENT && formDiscountAmount > 0) {
        expectedAmountAfterDiscount = remainingAfterAdmission * (1 - formDiscountAmount / 100);
      } else if (formDiscountType === DiscountType.FIXED && formDiscountAmount > 0) {
        expectedAmountAfterDiscount = remainingAfterAdmission - formDiscountAmount;
      }

      expectedAmountAfterDiscount = Math.max(0, expectedAmountAfterDiscount);

      if (Math.abs(totalMonthlyAmounts - expectedAmountAfterDiscount) > 0.01) {
        toast.error(
          `Amount mismatch: Expected ${expectedAmountAfterDiscount.toFixed(2)} after admission fee (${formAdmissionFee}) and discount (${formDiscountType === 'percent' ? formDiscountAmount + '%' : formDiscountAmount}), but sum of monthly amounts is ${totalMonthlyAmounts.toFixed(2)}`,
        );
        return;
      }

      // Create single fee structure with monthly installment plans
      const { dueDateDaysBeforeStart, dueDateDaysBeforeMonthStart, ...submissionValues } =
        values as any; // Remove calculation-only fields
      const payload: IFeeStructureBulkCreate = {
        ...submissionValues,
        totalFees: Number(values.totalFees) || 0,
        admissionFee: Number(values.admissionFee) || 0,
        discountAmount: Number(values.discountAmount) || 0,
        feeInstallmentPlans: monthlyPaymentRows.map(
          (row) =>
            ({
              sequenceNo: row.sequenceNo,
              paymentLabel: row.paymentLabel,
              semesterId: row.semesterId,
              durationMonths: 1, // Monthly payments are always 1 month
              amount: row.isBreak ? 0 : row.amount, // Ensure break months have amount = 0
              discountAmount: row.isBreak ? 0 : row.discountAmount, // Ensure break months have discount = 0
              dueDate: row.dueDate ? row.dueDate.format('YYYY-MM-DD') : '',
            }) as Omit<IFeeInstallmentPlanCreate, 'feeStructureId'>,
        ),
      } as IFeeStructureBulkCreate;

      console.log('Creating fee structure with monthly plans:', payload);
      await createFeeStructureBulk(payload);
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: `${entityName} with Monthly Plans` }));

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/fee-structures');
      }
    } catch (error: unknown) {
      handleSubmitError(error);
    }
  };

  // Main submit handler that routes to appropriate function based on payment type
  const handleSubmit = async (values: Partial<IFeeStructure>) => {
    const paymentType = values.paymentType;

    if (paymentType === PaymentType.ONE_TIME) {
      await handleOneTimeSubmit(values);
    } else if (paymentType === PaymentType.INSTALLMENT) {
      await handleInstallmentSubmit(values);
    } else if (paymentType === PaymentType.MONTHLY) {
      await handleMonthlySubmit(values);
    } else {
      toast.error('Please select a valid payment type');
    }
  };

  // Helper function to handle submit errors
  const handleSubmitError = (error: unknown) => {
    let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
      name: entityName,
      defaultValue: `Failed to create ${entityName.toLowerCase()}`,
    });

    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
    } else {
      errorMessage = getErrorMessage(error);
    }

    toast.error(errorMessage);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const saveAsDraft = () => {
    console.log('saveAsDraft');
  };

  return (
    <div style={{ padding: '12px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={actionStatus.status === Status.LOADING}
      >
        <Card title="Fee Template Configuration" style={{ marginBottom: 16 }}>
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="templateName"
                  label={t(LOCALE_KEYS.TEMPLATE_NAME)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.TEMPLATE_NAME),
                      }),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="batchId"
                  label={t(LOCALE_KEYS.BATCH)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BATCH) }),
                    },
                  ]}
                >
                  <Select
                    placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={handleBatchChange}
                  >
                    {batches.map((batch) => (
                      <Select.Option key={batch.id} value={batch.id} label={batch.name}>
                        {batch.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="academicYear"
                  label={t(LOCALE_KEYS.ACADEMIC_YEAR)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.ACADEMIC_YEAR),
                      }),
                    },
                  ]}
                  help="Automatically set from selected batch"
                >
                  <Input
                    placeholder="e.g., 2025-2026"
                    disabled={true}
                    style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* <Col span={8}>
        <Form.Item
        name="semesterId"
        label={t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' })}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SEMESTER) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
          options={semesters.map((semester) => ({
            label: semester.name,
            value: semester.id,
          }))}
        />
      </Form.Item>
        </Col> */}
              <Col span={8}>
                <Form.Item
                  name="paymentType"
                  label={t(LOCALE_KEYS.PAYMENT_TYPE)}
                  initialValue={PAYMENT_TYPE_OPTIONS[0]?.value}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.PAYMENT_TYPE),
                      }),
                    },
                  ]}
                >
                  <StatusSelect options={PAYMENT_TYPE_OPTIONS} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="totalFees"
                  label={t(LOCALE_KEYS.TOTAL_FEES)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.TOTAL_FEES),
                      }),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="admissionFee"
                  label={t(LOCALE_KEYS.ADMISSION_FEE)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.ADMISSION_FEE),
                      }),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="discountType"
                  initialValue={DISCOUNT_TYPE_OPTIONS[0]?.value}
                  label={t(LOCALE_KEYS.DISCOUNT_TYPE)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.DISCOUNT_TYPE),
                      }),
                    },
                  ]}
                >
                  <StatusSelect options={DISCOUNT_TYPE_OPTIONS} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="discountAmount"
                  label={t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' })}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.DISCOUNT_AMOUNT),
                      }),
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="currency"
                  label={t(LOCALE_KEYS.CURRENCY)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CURRENCY) }),
                    },
                  ]}
                >
                  <Select placeholder={t(LOCALE_KEYS.SELECT_CURRENCY)}>
                    <Select.Option value="SAR">SAR</Select.Option>
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="EUR">EUR</Select.Option>
                    <Select.Option value="GBP">GBP</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Show different due date fields based on payment type */}
              {currentPaymentType === 'installment' && (
                <Col span={8}>
                  <Form.Item
                    name="dueDateDaysBeforeStart"
                    label="Due Date Days Before Semester Start"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter due date days before semester start',
                      },
                    ]}
                    help="Number of days before semester start date to set as due date"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={365}
                      placeholder="e.g., 30"
                      onChange={(value) => {
                        // Recalculate due dates when this value changes
                        if (value && paymentRows.length > 0) {
                          recalculateDueDates(value);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              )}

              {currentPaymentType === 'monthly' && (
                <Col span={8}>
                  <Form.Item
                    name="dueDateDaysBeforeMonthStart"
                    label="Due Date Days Before Month Start"
                    rules={[
                      { required: true, message: 'Please enter due date days before month start' },
                    ]}
                    help="Number of days before the start of each month to set as due date"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={365}
                      placeholder="e.g., 15"
                      onChange={(value) => {
                        // Recalculate monthly due dates when this value changes
                        if (value && monthlyPaymentRows.length > 0) {
                          recalculateMonthlyDueDates(value);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />
              </Col>
            </Row>
          </>
        </Card>

        {/* Course Information Card - Show when batch is selected */}
        {selectedBatch && (
          <Card
            title="Course Information"
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: '16px' }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Course Name:</strong>
                </div>
                <div style={{ color: '#1890ff', fontSize: '14px' }}>
                  {selectedBatch.course?.name || 'N/A'}
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Duration (Semesters):</strong>
                </div>
                <div style={{ color: '#52c41a', fontSize: '14px' }}>
                  {selectedBatch.course?.durationInSemesters || 'N/A'} semesters
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Batch Year:</strong>
                </div>
                <div style={{ color: '#722ed1', fontSize: '14px' }}>
                  {selectedBatch.academicYear || 'N/A'}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Installment Payment Details Section - Only show when batch is selected AND payment type is installment */}
        {selectedBatch && currentPaymentType === 'installment' && (
          <Card title="Fee Structure Details (Installment)" style={{ marginBottom: 16 }}>
            {/* Show helpful note when no semesters exist */}
            {semesters.length === 0 && (
              <div
                style={{
                  padding: '12px 16px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  border: '1px solid #ffd591',
                  fontSize: '13px',
                }}
              >
                <p style={{ color: '#d46b08', margin: 0 }}>
                  <strong>Note:</strong> This batch is configured for{' '}
                  {selectedBatch.course?.durationInSemesters || 0} semesters, but no semester
                  records exist yet. You'll need to create the semester records first to generate
                  fee structure rows.
                </p>
              </div>
            )}

            {/* Show warning when some semesters are missing */}
            {semesters.length > 0 &&
              semesters.length < selectedBatch.course?.durationInSemesters && (
                <div
                  style={{
                    padding: '12px 16px',
                    marginBottom: '16px',
                    borderRadius: '6px',
                    border: '1px solid #ffccc7',
                    fontSize: '13px',
                  }}
                >
                  <p style={{ color: '#cf1322', margin: 0, marginBottom: '8px' }}>
                    <strong>⚠️ Warning:</strong> This batch is configured for{' '}
                    {selectedBatch.course?.durationInSemesters || 0} semesters, but only{' '}
                    {semesters.length} semester records were found.
                  </p>
                  <p style={{ color: '#434343', margin: 0, marginBottom: '8px', fontSize: '12px' }}>
                    <strong>Missing semesters:</strong> {getMissingSemesterNumbers()}
                  </p>
                  <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                    You can proceed with the available semesters, but consider creating the missing
                    ones for a complete fee structure.
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <Button
                      type="primary"
                      danger
                      size="small"
                      onClick={() => {
                        if (selectedBatch) {
                          sessionStorage.setItem(
                            'batchForSemesterCreation',
                            JSON.stringify({
                              batchId: selectedBatch.id,
                              batchName: selectedBatch.name,
                              courseName: selectedBatch.course?.name,
                              durationInSemesters: selectedBatch.course?.durationInSemesters,
                              missingSemesters: getMissingSemesterNumbers(),
                            }),
                          );
                        }
                        router.push('/semesters/create');
                      }}
                      style={{ marginRight: '8px' }}
                    >
                      Create Missing Semesters
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      onClick={() => window.open('/semesters', '_blank')}
                    >
                      View All Semesters
                    </Button>
                  </div>
                </div>
              )}

            {/* Show break semester information */}
            {(() => {
              const breakInfo = getBreakSemesterInfo();
              if (breakInfo) {
                return (
                  <div
                    style={{
                      padding: '12px 16px',
                      marginBottom: '16px',
                      borderRadius: '6px',
                      border: '1px solid #d9f7be',
                      backgroundColor: '#f6ffed',
                      fontSize: '13px',
                    }}
                  >
                    <p style={{ color: '#389e0d', margin: 0, marginBottom: '4px' }}>
                      <strong>ℹ️ Break Semesters Excluded:</strong> {breakInfo.count} break semester
                      {breakInfo.count !== 1 ? 's' : ''} ({breakInfo.names}){' '}
                      {breakInfo.count !== 1 ? 'are' : 'is'} excluded from fee calculations.
                    </p>
                    <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                      Only active semesters are included in the installment payment structure.
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Show totals summary for installment payments */}
            {paymentRows.length > 0 && (
              <div
                style={{
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  border: '1px solid #e1e4e8',
                }}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <strong>Total Fees:</strong> {Number(totalFees || 0).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Admission Fee:</strong>{' '}
                    {Number(form.getFieldValue('admissionFee') || 0).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Remaining After Admission:</strong>{' '}
                    {Math.max(
                      0,
                      Number(totalFees || 0) - Number(form.getFieldValue('admissionFee') || 0),
                    ).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>After Discount:</strong>{' '}
                    {(() => {
                      const totalFeesNumber = Number(totalFees || 0);
                      const admissionFee = Number(form.getFieldValue('admissionFee') || 0);
                      const discountType = form.getFieldValue('discountType');
                      const discountAmount = Number(form.getFieldValue('discountAmount') || 0);

                      const remainingFees = totalFeesNumber - admissionFee;
                      let discountedFees = remainingFees;

                      if (discountType === 'percent' && discountAmount > 0) {
                        discountedFees = remainingFees * (1 - discountAmount / 100);
                      } else if (discountType === 'fixed' && discountAmount > 0) {
                        discountedFees = remainingFees - discountAmount;
                      }

                      return Math.max(0, discountedFees).toFixed(2);
                    })()}
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '8px' }}>
                  <Col span={6}>
                    <strong>Semester Sum ({paymentRows.length} active semesters):</strong>{' '}
                    {formatForDisplay(
                      paymentRows.reduce((sum, row) => sum + row.amount, 0),
                    ).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Amount Per Semester:</strong>{' '}
                    {paymentRows.length > 0
                      ? formatForDisplay(
                          paymentRows.reduce((sum, row) => sum + row.amount, 0) /
                            paymentRows.length,
                        ).toFixed(2)
                      : '0.00'}
                  </Col>
                  <Col span={6}>
                    <strong>Total Discount Applied:</strong>{' '}
                    {formatForDisplay(
                      paymentRows.reduce((sum, row) => sum + row.discountAmount, 0),
                    ).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Difference:</strong>{' '}
                    {formatForDisplay(
                      Math.abs(
                        Number(totalFees || 0) -
                          (Number(form.getFieldValue('admissionFee') || 0) +
                            paymentRows.reduce((sum, row) => sum + row.amount, 0)),
                      ),
                    ).toFixed(2)}
                  </Col>
                </Row>
                <Row style={{ marginTop: '12px' }}>
                  <Col span={24}>
                    <Button
                      type="dashed"
                      size="small"
                      onClick={() => {
                        const totalFeesNumber = Number(totalFees || 0);
                        if (totalFeesNumber > 0 && paymentRows.length > 0) {
                          const nonBreakSemesterCount = paymentRows.length; // Use actual number of non-break semesters
                          const amountPerSemester = calculateAmountPerPeriod(
                            totalFeesNumber,
                            nonBreakSemesterCount,
                          );
                          const discountPerSemester = calculateDiscountPerPeriod(
                            totalFeesNumber,
                            nonBreakSemesterCount,
                          );

                          setPaymentRows((prev) =>
                            prev.map((row) => ({
                              ...row,
                              amount: amountPerSemester,
                              discountAmount: discountPerSemester,
                            })),
                          );
                        }
                      }}
                      disabled={!totalFees || paymentRows.length === 0}
                    >
                      Auto-Distribute Remaining Fees Across {paymentRows.length} Active Semesters
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {listStatus.status === Status.LOADING ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <p>Loading semester data...</p>
              </div>
            ) : semesters.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#ff4d4f',
                  borderRadius: '6px',
                  border: '1px solid #ffccc7',
                }}
              >
                <p style={{ color: '#cf1322', fontWeight: 500, marginBottom: '12px' }}>
                  ⚠️ No semesters found for this batch
                </p>
                <p style={{ color: '#434343', marginBottom: '16px' }}>
                  This batch has {selectedBatch?.course?.durationInSemesters || 0} semesters
                  configured, but no semester records exist.
                </p>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>
                  You need to create semester records before you can generate fee structure rows.
                </p>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    // Store the current batch info in sessionStorage for the semester creation form
                    if (selectedBatch) {
                      sessionStorage.setItem(
                        'batchForSemesterCreation',
                        JSON.stringify({
                          batchId: selectedBatch.id,
                          batchName: selectedBatch.name,
                          courseName: selectedBatch.course?.name,
                          durationInSemesters: selectedBatch.course?.durationInSemesters,
                        }),
                      );
                    }
                    router.push('/semesters/create');
                  }}
                  style={{ marginRight: '8px' }}
                >
                  Create Semesters
                </Button>
                <Button type="default" onClick={() => window.open('/semesters', '_blank')}>
                  View All Semesters
                </Button>
              </div>
            ) : paymentRows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <p>Select a batch to automatically generate fee structure rows for each semester</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  Each row represents a fee structure for a specific semester
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    padding: '8px 12px',
                    marginBottom: '16px',
                    borderRadius: '4px',
                    border: '1px solid #91d5ff',
                    fontSize: '12px',
                  }}
                >
                  💡 <strong>Tip:</strong> The auto-distribute function will: 1) Subtract admission
                  fee from total fees, 2) Apply discount (percent or fixed), 3) Divide remaining
                  amount across all semesters, 4) Set discount amount per semester. You can also
                  manually adjust individual semester amounts.
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Semester
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Start Date
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Sequence No
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Payment Label
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Duration (Months)
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Amount
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Discount Amount
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRows.map((row) => (
                        <tr key={row.id}>
                          <td style={{ padding: '12px' }}>
                            <Select
                              style={{ width: '100%' }}
                              placeholder="Select Semester"
                              disabled={true}
                              value={row.semester}
                              onChange={(value) => updatePaymentRow(row.id, 'semester', value)}
                              options={semesterOptions}
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <Input
                              value={
                                row.semesterStartDate
                                  ? dayjs(row.semesterStartDate).format('YYYY-MM-DD')
                                  : 'N/A'
                              }
                              disabled
                              style={{
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <Input
                              value={row.sequenceNo}
                              disabled
                              style={{ textAlign: 'center' }}
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <Input
                              placeholder="e.g., Tuition Fee"
                              value={row.paymentLabel}
                              onChange={(e) =>
                                updatePaymentRow(row.id, 'paymentLabel', e.target.value)
                              }
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <InputNumber
                              style={{ width: '100%', backgroundColor: '#f5f5f5', color: '#666' }}
                              min={1}
                              value={row.durationMonths}
                              disabled
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <InputNumber
                              style={{ width: '100%' }}
                              min={0}
                              step={0.01}
                              placeholder="0.00"
                              value={formatForDisplay(row.amount)}
                              onChange={(value) => updatePaymentRow(row.id, 'amount', value)}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <InputNumber
                              style={{ width: '100%' }}
                              min={0}
                              step={0.01}
                              placeholder="0.00"
                              value={formatForDisplay(row.discountAmount)}
                              onChange={(value) =>
                                updatePaymentRow(row.id, 'discountAmount', value)
                              }
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                            />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <DatePicker
                              style={{ width: '100%' }}
                              placeholder="mm/dd/yyyy"
                              value={row.dueDate}
                              onChange={(date) => updatePaymentRow(row.id, 'dueDate', date)}
                              status={!row.dueDate ? 'error' : undefined}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Monthly Payment Details Section - Only show when batch is selected AND payment type is monthly */}
        {selectedBatch && currentPaymentType === 'monthly' && (
          <Card title="Monthly Payment Details" style={{ marginBottom: 16 }}>
            {/* Show helpful note when no semesters exist */}
            {semesters.length === 0 && (
              <div
                style={{
                  padding: '12px 16px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  border: '1px solid #ffd591',
                  fontSize: '13px',
                }}
              >
                <p style={{ color: '#d46b08', margin: 0 }}>
                  <strong>Note:</strong> This batch is configured for{' '}
                  {selectedBatch.course?.durationInSemesters || 0} semesters, but no semester
                  records exist yet. You'll need to create the semester records first to generate
                  monthly payment rows.
                </p>
              </div>
            )}

            {/* Show warning when some semesters are missing */}
            {semesters.length > 0 &&
              semesters.length < selectedBatch.course?.durationInSemesters && (
                <div
                  style={{
                    padding: '12px 16px',
                    marginBottom: '16px',
                    borderRadius: '6px',
                    border: '1px solid #ffccc7',
                    fontSize: '13px',
                  }}
                >
                  <p style={{ color: '#cf1322', margin: 0, marginBottom: '8px' }}>
                    <strong>⚠️ Warning:</strong> This batch is configured for{' '}
                    {selectedBatch.course?.durationInSemesters || 0} semesters, but only{' '}
                    {semesters.length} semester records were found.
                  </p>
                  <p style={{ color: '#434343', margin: 0, marginBottom: '8px', fontSize: '12px' }}>
                    <strong>Missing semesters:</strong> {getMissingSemesterNumbers()}
                  </p>
                  <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                    You can proceed with the available semesters, but consider creating the missing
                    ones for a complete fee structure.
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <Button
                      type="primary"
                      danger
                      size="small"
                      onClick={() => {
                        if (selectedBatch) {
                          sessionStorage.setItem(
                            'batchForSemesterCreation',
                            JSON.stringify({
                              batchId: selectedBatch.id,
                              batchName: selectedBatch.name,
                              courseName: selectedBatch.course?.name,
                              durationInSemesters: selectedBatch.course?.durationInSemesters,
                              missingSemesters: getMissingSemesterNumbers(),
                            }),
                          );
                        }
                        router.push('/semesters/create');
                      }}
                      style={{ marginRight: '8px' }}
                    >
                      Create Missing Semesters
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      onClick={() => window.open('/semesters', '_blank')}
                    >
                      View All Semesters
                    </Button>
                  </div>
                </div>
              )}

            {/* Show monthly totals summary for monthly payments */}
            {currentPaymentType === 'monthly' && monthlyPaymentRows.length > 0 && (
              <div
                style={{
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  border: '1px solid #e1e4e8',
                }}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <strong>Total Fees:</strong> {Number(totalFees || 0).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Admission Fee:</strong>{' '}
                    {Number(form.getFieldValue('admissionFee') || 0).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Remaining After Admission:</strong>{' '}
                    {Math.max(
                      0,
                      Number(totalFees || 0) - Number(form.getFieldValue('admissionFee') || 0),
                    ).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>After Discount:</strong>{' '}
                    {(() => {
                      const totalFeesNumber = Number(totalFees || 0);
                      const admissionFee = Number(form.getFieldValue('admissionFee') || 0);
                      const discountType = form.getFieldValue('discountType');
                      const discountAmount = Number(form.getFieldValue('discountAmount') || 0);

                      const remainingFees = totalFeesNumber - admissionFee;
                      let discountedFees = remainingFees;

                      if (discountType === 'percent' && discountAmount > 0) {
                        discountedFees = remainingFees * (1 - discountAmount / 100);
                      } else if (discountType === 'fixed' && discountAmount > 0) {
                        discountedFees = remainingFees - discountAmount;
                      }

                      return Math.max(0, discountedFees).toFixed(2);
                    })()}
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '8px' }}>
                  <Col span={6}>
                    <strong>Monthly Sum:</strong>{' '}
                    {formatForDisplay(
                      monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0),
                    ).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Amount Per Month:</strong>{' '}
                    {(() => {
                      const activeMonths = monthlyPaymentRows.filter((row) => !row.isBreak);
                      return activeMonths.length > 0
                        ? formatForDisplay(
                            monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0) /
                              activeMonths.length,
                          ).toFixed(2)
                        : '0.00';
                    })()}
                  </Col>
                  <Col span={6}>
                    <strong>Total Discount Applied:</strong>{' '}
                    {formatForDisplay(
                      monthlyPaymentRows.reduce((sum, row) => sum + row.discountAmount, 0),
                    ).toFixed(2)}
                  </Col>
                  <Col span={6}>
                    <strong>Difference:</strong>{' '}
                    {formatForDisplay(
                      Math.abs(
                        Number(totalFees || 0) -
                          (Number(form.getFieldValue('admissionFee') || 0) +
                            monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0)),
                      ),
                    ).toFixed(2)}
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '8px' }}>
                  <Col span={24}>
                    <strong>Semesters:</strong>{' '}
                    {(() => {
                      const uniqueSemesters = [
                        ...new Set(monthlyPaymentRows.map((row) => row.semesterName)),
                      ];
                      return uniqueSemesters.length;
                    })()}{' '}
                    (
                    {(() => {
                      const uniqueSemesters = [
                        ...new Set(monthlyPaymentRows.map((row) => row.semesterName)),
                      ];
                      return uniqueSemesters.join(', ');
                    })()}
                    )
                  </Col>
                </Row>
                <Row style={{ marginTop: '12px' }}>
                  <Col span={24}>
                    <Button
                      type="dashed"
                      size="small"
                      onClick={() => {
                        const totalFeesNumber = Number(totalFees || 0);
                        if (totalFeesNumber > 0 && monthlyPaymentRows.length > 0) {
                          const activeMonths = monthlyPaymentRows.filter((row) => !row.isBreak);
                          const activeMonthCount = activeMonths.length;

                          if (activeMonthCount > 0) {
                            const amountPerMonth = calculateAmountPerPeriod(
                              totalFeesNumber,
                              activeMonthCount,
                            );
                            const discountPerMonth = calculateDiscountPerPeriod(
                              totalFeesNumber,
                              activeMonthCount,
                            );

                            setMonthlyPaymentRows((prev) =>
                              prev.map((row) => ({
                                ...row,
                                amount: row.isBreak ? 0 : amountPerMonth,
                                discountAmount: row.isBreak ? 0 : discountPerMonth,
                              })),
                            );
                          }
                        }
                      }}
                      disabled={!totalFees || monthlyPaymentRows.length === 0}
                    >
                      Auto-Distribute Remaining Fees Across{' '}
                      {monthlyPaymentRows.filter((row) => !row.isBreak).length} Active Months
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {listStatus.status === Status.LOADING ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <p>Loading semester data...</p>
              </div>
            ) : semesters.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#ff4d4f',
                  borderRadius: '6px',
                  border: '1px solid #ffccc7',
                }}
              >
                <p style={{ color: '#cf1322', fontWeight: 500, marginBottom: '12px' }}>
                  ⚠️ No semesters found for this batch
                </p>
                <p style={{ color: '#434343', marginBottom: '16px' }}>
                  This batch has {selectedBatch?.course?.durationInSemesters || 0} semesters
                  configured, but no semester records exist.
                </p>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>
                  You need to create semester records before you can generate monthly payment rows.
                </p>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    // Store the current batch info in sessionStorage for the semester creation form
                    if (selectedBatch) {
                      sessionStorage.setItem(
                        'batchForSemesterCreation',
                        JSON.stringify({
                          batchId: selectedBatch.id,
                          batchName: selectedBatch.name,
                          courseName: selectedBatch.course?.name,
                          durationInSemesters: selectedBatch.course?.durationInSemesters,
                        }),
                      );
                    }
                    router.push('/semesters/create');
                  }}
                  style={{ marginRight: '8px' }}
                >
                  Create Semesters
                </Button>
                <Button type="default" onClick={() => window.open('/semesters', '_blank')}>
                  View All Semesters
                </Button>
              </div>
            ) : monthlyPaymentRows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <p>Select a batch to automatically generate monthly payment rows</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  Each row represents a monthly payment within a semester
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    padding: '8px 12px',
                    marginBottom: '16px',
                    borderRadius: '4px',
                    border: '1px solid #91d5ff',
                    fontSize: '12px',
                  }}
                >
                  💡 <strong>Tip:</strong> The auto-distribute function will: 1) Subtract admission
                  fee from total fees, 2) Apply discount (percent or fixed), 3) Divide remaining
                  amount across all months, 4) Set discount amount per month. You can also manually
                  adjust individual monthly amounts.
                </div>
                <div style={{ overflowX: 'auto' }}>
                  {(() => {
                    // Group monthly payment rows by semester
                    const groupedBySemester = monthlyPaymentRows.reduce((groups: any, row) => {
                      const semesterName = row.semesterName;
                      if (!groups[semesterName]) {
                        groups[semesterName] = [];
                      }
                      groups[semesterName].push(row);
                      return groups;
                    }, {});

                    return Object.entries(groupedBySemester).map(
                      ([semesterName, rows]: [string, any]) => (
                        <div key={semesterName} style={{ marginBottom: '24px' }}>
                          {/* Semester Header */}
                          <div
                            style={{
                              padding: '12px 16px',
                              border: '1px solid #e1e4e8',
                              borderRadius: '6px 6px 0 0',
                              borderBottom: 'none',
                              fontWeight: 600,
                              color: '#24292e',
                              fontSize: '14px',
                            }}
                          >
                            📚 {semesterName} - {rows.length} month{rows.length !== 1 ? 's' : ''}
                          </div>

                          {/* Monthly Payments Table for this Semester */}
                          <table
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              border: '1px solid #e1e4e8',
                            }}
                          >
                            <thead>
                              <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Month
                                </th>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Sequence No
                                </th>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Payment Label
                                </th>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Break
                                </th>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Amount
                                </th>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Discount Amount
                                </th>
                                <th
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                  }}
                                >
                                  Due Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row: any) => (
                                <tr
                                  key={row.id}
                                  style={{
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: row.isBreak ? '#f5f5f5' : 'transparent',
                                    opacity: row.isBreak ? 0.6 : 1,
                                  }}
                                >
                                  <td style={{ padding: '10px 12px' }}>
                                    <Input
                                      value={row.monthName}
                                      disabled
                                      style={{ textAlign: 'center', border: 'none' }}
                                    />
                                  </td>
                                  <td style={{ padding: '10px 12px' }}>
                                    <Input
                                      value={row.sequenceNo}
                                      disabled
                                      style={{ textAlign: 'center', border: 'none' }}
                                    />
                                  </td>
                                  <td style={{ padding: '10px 12px' }}>
                                    <Input
                                      placeholder="e.g., Monthly Fee"
                                      value={row.paymentLabel}
                                      disabled={row.isBreak}
                                      onChange={(e) => {
                                        setMonthlyPaymentRows((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id
                                              ? { ...r, paymentLabel: e.target.value }
                                              : r,
                                          ),
                                        );
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <input
                                      type="checkbox"
                                      checked={row.isBreak}
                                      onChange={(e) =>
                                        handleMonthBreakChange(row.id, e.target.checked)
                                      }
                                      style={{ transform: 'scale(1.2)' }}
                                    />
                                  </td>
                                  <td style={{ padding: '10px 12px' }}>
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      min={0}
                                      step={0.01}
                                      placeholder="0.00"
                                      value={formatForDisplay(row.amount)}
                                      disabled={row.isBreak}
                                      onChange={(value) => {
                                        setMonthlyPaymentRows((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id ? { ...r, amount: value || 0 } : r,
                                          ),
                                        );
                                      }}
                                      formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                      }
                                    />
                                  </td>
                                  <td style={{ padding: '10px 12px' }}>
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      min={0}
                                      step={0.01}
                                      placeholder="0.00"
                                      value={formatForDisplay(row.discountAmount)}
                                      disabled={row.isBreak}
                                      onChange={(value) => {
                                        setMonthlyPaymentRows((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id
                                              ? { ...r, discountAmount: value || 0 }
                                              : r,
                                          ),
                                        );
                                      }}
                                      formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                      }
                                    />
                                  </td>
                                  <td style={{ padding: '10px 12px' }}>
                                    <DatePicker
                                      style={{ width: '100%' }}
                                      placeholder="Select due date"
                                      value={row.dueDate}
                                      disabled={row.isBreak}
                                      onChange={(date) => {
                                        setMonthlyPaymentRows((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id ? { ...r, dueDate: date } : r,
                                          ),
                                        );
                                      }}
                                      status={!row.dueDate ? 'error' : undefined}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ),
                    );
                  })()}
                </div>
              </>
            )}
          </Card>
        )}

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={actionStatus.status === Status.LOADING}
            >
              {t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
            </Button>
            {/* <Button onClick={saveAsDraft} disabled={actionStatus.status === Status.LOADING}>
            {t('draft')}
          </Button> */}
            <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
              {t('cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FeeStructureFormBulk;
