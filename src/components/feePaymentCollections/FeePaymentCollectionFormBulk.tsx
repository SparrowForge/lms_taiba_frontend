'use client';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { PAYMENT_MODE_OPTIONS, PAYMENT_STATUS_OPTIONS } from '@/enums/payment.enum';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import {
  IFeePaymentCollection,
  IFeePaymentCollectionBulk,
  IFeePaymentCollectionCreate,
} from '@/types/feePaymentCollection';

import { feePaymentCollectionService } from '@/services/feePaymentCollectionService';

import { StatusSelectFormItem } from '../ui/StatusSelect';

const { TextArea } = Input;

interface FeePaymentDetailsRow {
  id: string;
  feeInstallmentPlanId: number;
  feeTitle: string;
  amountDue: number;
  amountPaid: number;
  balanceAmount: number;
  status: 'paid' | 'partial' | 'due';
  newAmountPaid?: number;
  newBalanceAmount?: number;
}

interface FeePaymentCollectionFormBulkProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FeePaymentCollectionFormBulk: React.FC<FeePaymentCollectionFormBulkProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [studentFilter, setStudentFilter] = useState({
    courseId: undefined as number | undefined,
    batchId: undefined as number | undefined,
    sectionId: undefined as number | undefined,
  });

  const [form] = Form.useForm();
  const { actionStatus } = useFeePaymentCollections();
  const { loadStudentWithFeeInfo, studentWithFeeInfo, students, loadStudents, detailsStatus, listStatus } =
    useStudents();
  const { courses, loadCourses } = useCourses();
  const { batches, loadBatches } = useBatches();

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);



  // State for fee payment details rows
  const [feePaymentDetailsRows, setFeePaymentDetailsRows] = useState<FeePaymentDetailsRow[]>([]);
  const [originalRows, setOriginalRows] = useState<FeePaymentDetailsRow[]>([]);

  // Get studentId from URL parameters
  const studentId = searchParams.get('studentId');

  const noStudentInParam =
    !studentId ||
    (studentId &&
      detailsStatus.status !== Status.LOADING &&
      !studentWithFeeInfo?.student);

  // Load courses when showing student selector
  useEffect(() => {
    if (noStudentInParam) {
      loadCourses({ page: 1, limit: 99 });
    }
  }, [noStudentInParam, loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: 99, courseId: selectedCourseId });
      setSelectedBatchId(null);
      setSelectedStudentId(null);
    }
  }, [selectedCourseId, loadBatches]);

  useEffect(() => {
    if (selectedBatchId) {
      loadStudents({ page: 1, limit: 99, batchId: selectedBatchId });
      setSelectedStudentId(null);
    }
  }, [selectedBatchId, loadStudents]);

  const handleApplyStudent = () => {
    if (!selectedStudentId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('studentId', String(selectedStudentId));
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Load data on component mount when studentId in URL
  useEffect(() => {
    if (studentId) {
      loadStudentWithFeeInfo(parseInt(studentId));
      form.setFieldsValue({ studentId: parseInt(studentId) });
    }
  }, [studentId, loadStudentWithFeeInfo, form]);

  // Get student's fee structure and installment plans
  const studentFeeStructure = studentWithFeeInfo?.feeStructure;
  const studentFeeInstallmentPlans = studentWithFeeInfo?.feeStructure?.installmentPlans || [];

  // Calculate payment status for each installment plan
  const calculatePlanStatus = (planId: number, planAmount: number) => {
    if (!studentWithFeeInfo?.paymentCollections) {
      return { status: 'due', amountPaid: 0, balanceAmount: planAmount };
    }

    // Calculate total paid for this plan across all payment collections
    let totalPaid = 0;
    studentWithFeeInfo.paymentCollections.forEach((collection) => {
      if (collection.paymentDetails) {
        collection.paymentDetails.forEach((detail: any) => {
          if (detail.feeInstallmentPlanId === planId) {
            totalPaid += detail.amountPaid;
          }
        });
      }
    });

    const balanceAmount = planAmount - totalPaid;
    const status = balanceAmount === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'due';

    return { status, amountPaid: totalPaid, balanceAmount };
  };

  // Auto-generate fee payment details rows when student data is loaded
  useEffect(() => {
    if (
      studentWithFeeInfo?.feeStructure?.installmentPlans &&
      studentWithFeeInfo.feeStructure.installmentPlans.length > 0
    ) {
      // Sort installment plans by sequence number
      const sortedPlans = [...studentWithFeeInfo.feeStructure.installmentPlans].sort(
        (a, b) => a.sequenceNo - b.sequenceNo,
      );

      const autoRows: FeePaymentDetailsRow[] = sortedPlans.map((plan: any) => {
        const planStatus = calculatePlanStatus(plan.id, plan.amount);
        return {
          id: `plan-${plan.id}`,
          feeInstallmentPlanId: plan.id,
          feeTitle: plan.paymentLabel,
          amountDue: plan.amount,
          amountPaid: planStatus.amountPaid,
          balanceAmount: planStatus.balanceAmount,
          status: planStatus.status as 'paid' | 'partial' | 'due', // Add status to row
        };
      });
      setFeePaymentDetailsRows(autoRows);
      setOriginalRows(autoRows); // Store original state
    }
  }, [studentWithFeeInfo]);

  // Check if all plans are paid from API response (existing payment only)
  const allPlansPaidFromAPI =
    feePaymentDetailsRows.length > 0 &&
    feePaymentDetailsRows.every((row) => {
      // Check if the plan was already fully paid before any new payment
      const wasAlreadyPaid = row.amountPaid >= row.amountDue;
      return wasAlreadyPaid;
    });

  // Auto-fill form with default values
  useEffect(() => {
    if (studentWithFeeInfo) {
      form.setFieldsValue({
        paymentDate: dayjs(), // Current date
        currency: studentWithFeeInfo.feeStructure?.currency, // From fee structure
        feeStructureId: studentWithFeeInfo.feeStructure?.id,
      });
    }
  }, [studentWithFeeInfo, form]);

  const handleSubmit = async (values: Partial<IFeePaymentCollection>) => {
    try {
      console.log('=== SUBMIT DEBUG ===');
      console.log('Form values:', values);
      console.log('Amount paid type:', typeof values.amountPaid, values.amountPaid);

      // Validate amount paid against maximum allowed
      const totalRemainingBalance = originalRows.reduce((sum, row) => sum + row.balanceAmount, 0);
      if (values.amountPaid && values.amountPaid > totalRemainingBalance) {
        toast.error(
          `Amount paid (${values.amountPaid}) cannot exceed total remaining balance (${totalRemainingBalance.toFixed(2)})`,
        );
        return;
      }

      // Prepare fee payment collection data
      const paymentCollectionData: IFeePaymentCollectionCreate = {
        studentId: values.studentId!,
        feeStructureId: values.feeStructureId!,
        paymentDate: dayjs(values.paymentDate).toISOString(),
        paymentMode: values.paymentMode!,
        transactionRef: values.transactionRef!,
        amountPaid: values.amountPaid!,
        currency: values.currency!,
        status: values.status!,
        remarks: values.remarks || '',
      };

      // Prepare fee payment details data for bulk API
      // Only include rows that have new payment (regardless of final status)
      const paymentDetailsData = feePaymentDetailsRows
        .filter((row) => (row.newAmountPaid || 0) > 0)
        .map((row) => ({
          paymentId: 0,
          feeInstallmentPlanId: row.feeInstallmentPlanId,
          feeTitle: row.feeTitle,
          amountDue: row.amountDue,
          amountPaid: row.newAmountPaid || 0, // Only new payment amount
          balanceAmount: row.balanceAmount,
        }));

      // Prepare the bulk submission object
      const bulkSubmissionData: IFeePaymentCollectionBulk = {
        paymentCollection: paymentCollectionData,
        paymentDetails: paymentDetailsData,
      };

      // Calculate comprehensive summary
      const totalDue = feePaymentDetailsRows.reduce((sum, row) => sum + row.amountDue, 0);
      const previouslyPaid = feePaymentDetailsRows.reduce((sum, row) => sum + row.amountPaid, 0);
      const newPayment = feePaymentDetailsRows.reduce(
        (sum, row) => sum + (row.newAmountPaid || 0),
        0,
      );
      const totalPaid = previouslyPaid + newPayment;
      const remaining = feePaymentDetailsRows.reduce((sum, row) => sum + row.balanceAmount, 0);

      // Log the complete submission object
      console.log('=== FEE PAYMENT BULK SUBMISSION DATA ===');
      console.log('Bulk Data:', bulkSubmissionData);
      console.log('Summary:', {
        totalDue,
        previouslyPaid,
        newPayment,
        totalPaid,
        remaining,
        plansCovered: paymentDetailsData.length,
        plansTotal: feePaymentDetailsRows.length,
      });
      console.log('========================================');

      // Call the bulk API
      console.log('Calling API with:', bulkSubmissionData);
      const createdCollection =
        await feePaymentCollectionService.createFeePaymentCollectionBulk(bulkSubmissionData);

      console.log('Created Fee Payment Collection:', createdCollection);
      toast.success('Fee payment collection created successfully!');
      if (onSuccess) onSuccess();
      else if (studentId) {
        const locale = pathname.split('/')[1] || 'en';
        router.push(`/${locale}/students/${studentId}`);
      } else {
        router.back();
      }
    } catch (error: unknown) {
      console.error('Submit Error:', error);
      const errorMessage = getErrorMessage(error);
      console.error('Error Message:', errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  // Remove fee payment detail row
  const removeFeePaymentDetailRow = (id: string) => {
    setFeePaymentDetailsRows(feePaymentDetailsRows.filter((row) => row.id !== id));
  };

  // Update fee payment detail row
  const updateFeePaymentDetailRow = (id: string, field: keyof FeePaymentDetailsRow, value: any) => {
    setFeePaymentDetailsRows((rows) =>
      rows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          // Auto-calculate balance when amount paid changes
          if (field === 'amountPaid') {
            updatedRow.balanceAmount = updatedRow.amountDue - (value || 0);
          }
          return updatedRow;
        }
        return row;
      }),
    );
  };

  // Auto-distribute amount paid across fee payment details with smart prioritization
  const distributeAmountPaid = (totalAmountPaid: number) => {
    console.log('=== DISTRIBUTION START ===');
    console.log('Total amount to distribute:', totalAmountPaid);
    console.log('Current feePaymentDetailsRows:', feePaymentDetailsRows);
    console.log('Original rows:', originalRows);

    // Use originalRows as the base to avoid state inconsistencies
    const resetRows = originalRows.map((row) => ({
      ...row,
      // Keep existing amountPaid, only reset new payment amount
      newAmountPaid: 0,
      newBalanceAmount: row.balanceAmount,
    }));

    console.log(
      'Reset rows:',
      resetRows.map((r) => ({
        id: r.id,
        status: r.status,
        amountDue: r.amountDue,
        amountPaid: r.amountPaid,
        balanceAmount: r.balanceAmount,
        planId: r.feeInstallmentPlanId,
      })),
    );

    // Use the original order (already sorted by backend)
    const updatedRows = [...resetRows];
    let remainingAmount = totalAmountPaid;

    console.log('Distributing amount:', remainingAmount, 'across', resetRows.length, 'plans');

    // Distribute based on original order (sequence 1, 2, 3, 4...)
    for (let i = 0; i < resetRows.length && remainingAmount > 0; i++) {
      const currentRow = resetRows[i];

      console.log(`Processing plan ${i + 1}:`, {
        id: currentRow.id,
        status: currentRow.status,
        amountDue: currentRow.amountDue,
        amountPaid: currentRow.amountPaid,
        balanceAmount: currentRow.balanceAmount,
        remainingAmount,
      });

      // Skip paid plans
      if (currentRow.status === 'paid') {
        console.log('Skipping paid plan:', currentRow.id);
        continue;
      }

      // Calculate the remaining balance for this plan
      const remainingBalance = currentRow.amountDue - currentRow.amountPaid;

      // Ensure we don't pay more than the remaining balance
      const maxPayment = Math.min(remainingAmount, remainingBalance);

      console.log('Plan payment calculation:', {
        remainingBalance,
        maxPayment,
        remainingAmount,
      });

      if (maxPayment > 0) {
        updatedRows[i] = {
          ...currentRow,
          newAmountPaid: maxPayment,
          newBalanceAmount: remainingBalance - maxPayment,
        };
        remainingAmount -= maxPayment;
        console.log('Applied payment:', maxPayment, 'Remaining amount:', remainingAmount);
      }
    }

    // Convert back to the original format
    const finalRows = updatedRows.map((row) => {
      const newAmountPaid = row.newAmountPaid || 0;
      const newBalanceAmount = row.newBalanceAmount || row.balanceAmount;

      // Calculate the actual remaining balance after new payment
      const actualRemainingBalance = row.amountDue - (row.amountPaid + newAmountPaid);

      return {
        ...row,
        // Keep original amountPaid unchanged, only update newAmountPaid
        amountPaid: row.amountPaid, // Don't add newAmountPaid here
        balanceAmount: Math.max(0, actualRemainingBalance), // Ensure balance is never negative
        newAmountPaid: newAmountPaid,
        newBalanceAmount: Math.max(0, actualRemainingBalance),
        // Update status based on actual remaining balance
        status:
          actualRemainingBalance <= 0
            ? 'paid'
            : row.amountPaid + newAmountPaid > 0
              ? 'partial'
              : 'due',
      };
    });

    console.log(
      'Final distribution result:',
      finalRows.map((r) => ({
        id: r.id,
        status: r.status,
        newAmountPaid: r.newAmountPaid,
        newBalanceAmount: r.newBalanceAmount,
      })),
    );

    setFeePaymentDetailsRows(finalRows as FeePaymentDetailsRow[]);
  };

  // Get available fee installment plans from student's fee structure
  const getAvailableFeeInstallmentPlans = () => {
    return studentFeeInstallmentPlans;
  };

  // Table columns for fee payment details
  const feePaymentDetailsColumns = [
    {
      title: 'Seq',
      dataIndex: 'feeInstallmentPlanId',
      key: 'sequence',
      width: 60,
      render: (value: number) => {
        const plan = studentFeeInstallmentPlans.find((p) => p.id === value);
        return <Typography.Text strong>{plan?.sequenceNo || '-'}</Typography.Text>;
      },
    },
    {
      title: t(LOCALE_KEYS.FEE_TITLE, { defaultValue: 'Fee Title' }),
      dataIndex: 'feeTitle',
      key: 'feeTitle',
      render: (value: string) => <Typography.Text>{value}</Typography.Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusConfig = {
          paid: { color: 'success', text: 'Paid', icon: '✅' },
          partial: { color: 'warning', text: 'Partial', icon: '⚠️' },
          due: { color: 'danger', text: 'Due', icon: '❌' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Typography.Text type={config.color as any}>
            {config.icon} {config.text}
          </Typography.Text>
        );
      },
    },
    {
      title: t(LOCALE_KEYS.AMOUNT_DUE, { defaultValue: 'Amount Due' }),
      dataIndex: 'amountDue',
      key: 'amountDue',
      render: (value: number) => <Typography.Text>{value.toFixed(2)}</Typography.Text>,
    },
    {
      title: 'Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (value: number, record: FeePaymentDetailsRow) => {
        const totalPaid = value + (record.newAmountPaid || 0);
        return (
          <Typography.Text strong={totalPaid > 0} type={totalPaid > 0 ? 'success' : 'secondary'}>
            {totalPaid.toFixed(2)}
          </Typography.Text>
        );
      },
    },
    {
      title: t(LOCALE_KEYS.BALANCE_AMOUNT, { defaultValue: 'Balance' }),
      dataIndex: 'balanceAmount',
      key: 'balanceAmount',
      render: (value: number, record: FeePaymentDetailsRow) => {
        const currentBalance = record.newBalanceAmount || value;
        return (
          <Typography.Text type={currentBalance > 0 ? 'danger' : 'success'}>
            {currentBalance.toFixed(2)}
          </Typography.Text>
        );
      },
    },
    {
      title: 'New Payment',
      dataIndex: 'newAmountPaid',
      key: 'newAmountPaid',
      render: (value: number, record: FeePaymentDetailsRow) => {
        // Use record.newAmountPaid directly instead of value parameter
        const newPaymentAmount = record.newAmountPaid || 0;

        // Debug: Log the values
        console.log('New Payment Column Debug:', {
          value,
          newAmountPaid: record.newAmountPaid,
          newPaymentAmount,
          status: record.status,
          balanceAmount: record.balanceAmount,
          newBalanceAmount: record.newBalanceAmount,
          wasAlreadyPaid: record.amountPaid >= record.amountDue,
        });

        // Show "-" only if:
        // 1. No new payment amount (0 or undefined)
        // 2. Plan was already fully paid before this transaction (amountPaid >= amountDue)
        const wasAlreadyPaid = record.amountPaid >= record.amountDue;

        if (newPaymentAmount === 0) {
          return <Typography.Text type="success">-</Typography.Text>;
        }

        // Show new payment amount if there's a new payment
        return (
          <Typography.Text strong style={{ color: '#1890ff' }}>
            {newPaymentAmount.toFixed(2)}
          </Typography.Text>
        );
      },
    },
  ];

  // If all plans are paid from API response, show payment collections instead of form
  if (allPlansPaidFromAPI && studentWithFeeInfo?.paymentCollections) {
    const paymentCollectionsColumns = [
      {
        title: 'Payment Date',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
      },
      {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
      },
      {
        title: 'Transaction Ref',
        dataIndex: 'transactionRef',
        key: 'transactionRef',
      },
      {
        title: 'Amount Paid',
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        render: (value: number) =>
          `${value.toFixed(2)} ${studentWithFeeInfo.feeStructure?.currency || ''}`,
      },
      {
        title: 'Payment Details',
        dataIndex: 'paymentDetails',
        key: 'paymentDetails',
        render: (paymentDetails: any[]) => {
          if (!paymentDetails || paymentDetails.length === 0) {
            return <Typography.Text type="secondary">No details</Typography.Text>;
          }
          return (
            <div>
              {paymentDetails.map((detail, index) => (
                <div key={index} style={{ marginBottom: '4px', fontSize: '12px' }}>
                  <Typography.Text strong>{detail.feeTitle}:</Typography.Text>
                  <br />
                  <Typography.Text type="success">
                    {detail.amountPaid.toFixed(2)} {studentWithFeeInfo.feeStructure?.currency || ''}
                  </Typography.Text>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Typography.Text type={status === 'paid' ? 'success' : 'warning'}>
            {status.toUpperCase()}
          </Typography.Text>
        ),
      },
    ];

    return (
      <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
        <Card
          style={{
            margin: '0 auto',
            padding: '24px',
          }}
          role="main"
          aria-labelledby="form-title"
        >
          {/* Student Information Display */}
          {studentId && studentWithFeeInfo?.student && (
            <Card
              title={t(LOCALE_KEYS.STUDENT_INFORMATION, { defaultValue: 'Student Information' })}
              style={{ marginBottom: 24 }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Typography.Text strong>
                    {t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}:
                  </Typography.Text>
                  <br />
                  <Typography.Text>
                    {studentWithFeeInfo.student.firstName} {studentWithFeeInfo.student.lastName}
                  </Typography.Text>
                </Col>
                <Col span={8}>
                  <Typography.Text strong>
                    {t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' })}:
                  </Typography.Text>
                  <br />
                  <Typography.Text>{studentWithFeeInfo.student.applicationNo}</Typography.Text>
                </Col>
                <Col span={8}>
                  <Typography.Text strong>
                    {t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' })}:
                  </Typography.Text>
                  <br />
                  <Typography.Text>{studentWithFeeInfo.student.registrationNo}</Typography.Text>
                </Col>
              </Row>
            </Card>
          )}

          <Card title="All Fees Paid - Payment History">
            <Typography.Text
              type="success"
              style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}
            >
              ✅ All installment plans have been fully paid!
            </Typography.Text>

            <Table
              dataSource={studentWithFeeInfo.paymentCollections}
              columns={paymentCollectionsColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Card>
      </div>
    );
  }

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      {/* Student Information or Student Selection */}
      <Card
        title={t(LOCALE_KEYS.STUDENT_INFORMATION, { defaultValue: 'Student Information' })}
        style={{ marginBottom: 24 }}
      >
        {noStudentInParam ? (
          <>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
              {studentId
                ? t(LOCALE_KEYS.NOT_FOUND_NAME, { name: t(LOCALE_KEYS.STUDENT) }) +
                  ' Select course and batch to choose a student.'
                : 'Select course and batch, then choose a student for fee payment.'}
            </Typography.Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.COURSE)} <span style={{ color: 'red' }}>*</span>
                </Typography.Text>
                <Select
                  placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
                  style={{ width: '100%', marginTop: 8 }}
                  allowClear
                  value={selectedCourseId ?? undefined}
                  onChange={(v) => setSelectedCourseId(v ?? null)}
                  showSearch
                  optionFilterProp="label"
                  options={courses.map((c) => ({ value: c.id, label: c.name }))}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' })} <span style={{ color: 'red' }}>*</span>
                </Typography.Text>
                <Select
                  placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                    name: t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' }),
                  })}
                  style={{ width: '100%', marginTop: 8 }}
                  allowClear
                  value={selectedBatchId ?? undefined}
                  onChange={(v) => setSelectedBatchId(v ?? null)}
                  showSearch
                  optionFilterProp="label"
                  options={batches.map((b) => ({ value: b.id, label: b.name }))}
                  disabled={!selectedCourseId}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.STUDENT)} <span style={{ color: 'red' }}>*</span>
                </Typography.Text>
                <Select
                  placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) })}
                  style={{ width: '100%', marginTop: 8 }}
                  allowClear
                  value={selectedStudentId ?? undefined}
                  onChange={(v) => setSelectedStudentId(v ?? null)}
                  showSearch
                  optionFilterProp="label"
                  options={students.map((s) => ({
                    value: s.id,
                    label: `${s.firstName} ${s.lastName}${s.registrationNo ? ` (${s.registrationNo})` : ''}`,
                  }))}
                  disabled={!selectedBatchId}
                  loading={listStatus.status === Status.LOADING && selectedBatchId != null}
                />
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={handleApplyStudent}
                  disabled={!selectedStudentId}
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          studentWithFeeInfo?.student && (
            <Row gutter={16}>
              <Col span={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}:
                </Typography.Text>
                <br />
                <Typography.Text>
                  {studentWithFeeInfo.student.firstName} {studentWithFeeInfo.student.lastName}
                </Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' })}:
                </Typography.Text>
                <br />
                <Typography.Text>{studentWithFeeInfo.student.applicationNo}</Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' })}:
                </Typography.Text>
                <br />
                <Typography.Text>{studentWithFeeInfo.student.registrationNo}</Typography.Text>
              </Col>
            </Row>
          )
        )}
      </Card>

      {!noStudentInParam && (
      <>
      <Row gutter={[24, 24]}>
        {/* Left Column - Fee Payment Collection */}
        <Col xs={24} lg={12}>
          <Card
            title={t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
              defaultValue: 'Fee Payment Collection',
            })}
          >
            {/* Hidden field for studentId */}
            <Form.Item name="studentId" hidden>
              <Input value={parseInt(studentId || '0')} />
            </Form.Item>

            {/* Student's Fee Structure Information */}
            {studentFeeStructure && (
              <Row gutter={16}>
                <Col span={24}>
                  <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                    <Typography.Text strong>
                      {t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' })}:
                    </Typography.Text>
                    <br />
                    <Typography.Text>{studentFeeStructure.templateName}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {t(LOCALE_KEYS.TOTAL_FEES, { defaultValue: 'Total Fees' })}:{' '}
                      {studentFeeStructure.currency} {studentFeeStructure.totalFees}
                    </Typography.Text>
                  </div>
                </Col>
              </Row>
            )}

            {/* Hidden field for feeStructureId */}
            <Form.Item name="feeStructureId" hidden>
              <Input value={studentFeeStructure?.id || 0} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="paymentDate"
                  label={t(LOCALE_KEYS.PAYMENT_DATE, { defaultValue: 'Payment Date' })}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.PAYMENT_DATE),
                      }),
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PAYMENT_DATE) })}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentMode"
                  label={t(LOCALE_KEYS.PAYMENT_MODE, { defaultValue: 'Payment Mode' })}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.PAYMENT_MODE),
                      }),
                    },
                  ]}
                >
                  <Select
                    placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PAYMENT_MODE) })}
                  >
                    {PAYMENT_MODE_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {t(option.labelKey as any)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="transactionRef"
                  label={t(LOCALE_KEYS.TRANSACTION_REF, { defaultValue: 'Transaction Reference' })}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.TRANSACTION_REF),
                      }),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(LOCALE_KEYS.ENTER_NAME, {
                      name: t(LOCALE_KEYS.TRANSACTION_REF),
                    })}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="amountPaid"
                  label={t(LOCALE_KEYS.AMOUNT_PAID)}
                  rules={[
                    {
                      required: true,
                      message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                        name: t(LOCALE_KEYS.AMOUNT_PAID),
                      }),
                    },
                  ]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
                    type="number"
                    min={1}
                    step={1}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      console.log('Amount Paid Input Changed:', { value, type: typeof value });

                      // Set the form value explicitly
                      form.setFieldsValue({ amountPaid: value });

                      if (value && value > 0) {
                        distributeAmountPaid(value);
                      } else {
                        // Reset to original state, preserving previously paid amounts
                        setFeePaymentDetailsRows(
                          originalRows.map((row) => ({
                            ...row,
                            newAmountPaid: 0,
                            newBalanceAmount: row.balanceAmount,
                          })),
                        );
                      }
                      // Clear validation errors
                      form.setFields([
                        {
                          name: 'amountPaid',
                          errors: [],
                        },
                      ]);
                    }}
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                    Maximum allowed:{' '}
                    {originalRows.reduce((sum, row) => sum + row.balanceAmount, 0).toFixed(2)}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
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
                  <Select
                    placeholder={t(LOCALE_KEYS.SELECT_CURRENCY)}
                    disabled
                    value={studentWithFeeInfo?.feeStructure?.currency}
                  >
                    {studentWithFeeInfo?.feeStructure?.currency && (
                      <Select.Option value={studentWithFeeInfo.feeStructure.currency}>
                        {studentWithFeeInfo.feeStructure.currency}
                      </Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <StatusSelectFormItem options={PAYMENT_STATUS_OPTIONS} />
              </Col>
            </Row>

            <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
              <TextArea
                rows={3}
                placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) })}
              />
            </Form.Item>
          </Card>
        </Col>

        {/* Right Column - Fee Payment Details */}
        <Col xs={24} lg={12}>
          <Card title={t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' })}>
            {/* Summary Section */}
            {feePaymentDetailsRows.length > 0 && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  border: '1px solid #d9d9d9',
                }}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Typography.Text strong>Total Due:</Typography.Text>
                    <br />
                    <Typography.Text>
                      {feePaymentDetailsRows
                        .reduce((sum, row) => sum + row.amountDue, 0)
                        .toFixed(2)}
                    </Typography.Text>
                  </Col>
                  <Col span={6}>
                    <Typography.Text strong>Previously Paid:</Typography.Text>
                    <br />
                    <Typography.Text type="success">
                      {feePaymentDetailsRows
                        .reduce((sum, row) => sum + row.amountPaid, 0)
                        .toFixed(2)}
                    </Typography.Text>
                  </Col>
                  <Col span={6}>
                    <Typography.Text strong>New Payment:</Typography.Text>
                    <br />
                    <Typography.Text style={{ color: '#1890ff' }}>
                      {(() => {
                        const newPaymentTotal = feePaymentDetailsRows.reduce(
                          (sum, row) => sum + (row.newAmountPaid || 0),
                          0,
                        );
                        console.log('Summary New Payment Debug:', {
                          rows: feePaymentDetailsRows.map((row) => ({
                            id: row.id,
                            newAmountPaid: row.newAmountPaid,
                            status: row.status,
                          })),
                          total: newPaymentTotal,
                        });
                        return newPaymentTotal.toFixed(2);
                      })()}
                    </Typography.Text>
                  </Col>
                  <Col span={6}>
                    <Typography.Text strong>Remaining:</Typography.Text>
                    <br />
                    <Typography.Text type="danger">
                      {feePaymentDetailsRows
                        .reduce((sum, row) => sum + row.balanceAmount, 0)
                        .toFixed(2)}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '8px' }}>
                  <Col span={24}>
                    <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                      Total Paid (Previous + New):{' '}
                      {feePaymentDetailsRows
                        .reduce((sum, row) => sum + row.amountPaid + (row.newAmountPaid || 0), 0)
                        .toFixed(2)}
                    </Typography.Text>
                  </Col>
                </Row>
              </div>
            )}

            <Table
              dataSource={feePaymentDetailsRows}
              columns={feePaymentDetailsColumns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Form.Item>
        <Space className="mt-4">
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
      </>
      )}
    </Form>
  );

  if (studentId && detailsStatus.status === Status.LOADING) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>{t(LOCALE_KEYS.LOADING)}...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Card
        style={{
          margin: '0 auto',
          padding: '24px',
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </Card>
    </div>
  );
};

export default FeePaymentCollectionFormBulk;
