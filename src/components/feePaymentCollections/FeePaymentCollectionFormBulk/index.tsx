'use client';

import { Button, Card, Col, Drawer, Form, Row, Space, Spin } from 'antd';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useFeePaymentFormDetails } from '@/hooks/useFeePaymentFormDetails';
import { useFeePaymentFormStudent } from '@/hooks/useFeePaymentFormStudent';
import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import type {
  IFeePaymentCollection,
  IFeePaymentCollectionBulk,
  IFeePaymentCollectionCreate,
} from '@/types/feePaymentCollection';

import { feePaymentCollectionService } from '@/services/feePaymentCollectionService';

import AllFeesPaidView from './AllFeesPaidView';
import FeePaymentCollectionCard from './FeePaymentCollectionCard';
import FeePaymentDetailsCard from './FeePaymentDetailsCard';
import StudentSelectorCard from './StudentSelectorCard';
import FeeStructureInvoice from '@/components/feeStructures/FeeStructureInvoice';

export interface FeePaymentCollectionFormBulkProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FeePaymentCollectionFormBulk({
  onSuccess,
  onCancel,
}: FeePaymentCollectionFormBulkProps) {
  const { t } = useLocalization();
  const router = useRouter();
  const pathname = usePathname();
  const [form] = Form.useForm();

  const studentState = useFeePaymentFormStudent();
  const {
    studentId,
    studentWithFeeInfo,
    noStudentInParam,
    detailsStatus,
    listStatus,
    courses,
    batches,
    students,
    selectedCourseId,
    setSelectedCourseId,
    selectedBatchId,
    setSelectedBatchId,
    selectedStudentId,
    setSelectedStudentId,
    handleApplyStudent,
  } = studentState;

  const detailsState = useFeePaymentFormDetails(studentWithFeeInfo);
  const {
    feePaymentDetailsRows,
    originalRows,
    studentFeeInstallmentPlans,
    allPlansPaidFromAPI,
    distributeAmountPaid,
    resetRowsToOriginal,
  } = detailsState;

  const { actionStatus } = useFeePaymentCollections();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });

  const [invoiceVisible, setInvoiceVisible] = React.useState(false);
  const invoiceRef = React.useRef<HTMLDivElement | null>(null);

  const handleDownloadInvoice = () => {
    if (!invoiceRef.current) return;

    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
              padding: 24px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              font-size: 12px;
            }
            th {
              background: #f0f2f5;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    if (studentId) {
      form.setFieldsValue({ studentId: parseInt(studentId) });
    }
  }, [studentId, form]);

  useEffect(() => {
    if (studentWithFeeInfo) {
      form.setFieldsValue({
        paymentDate: dayjs(),
        currency: studentWithFeeInfo.feeStructure?.currency,
        feeStructureId: studentWithFeeInfo.feeStructure?.id,
      });
    }
  }, [studentWithFeeInfo, form]);

  const handleSubmit = async (values: Partial<IFeePaymentCollection>) => {
    try {
      const totalRemainingBalance = originalRows.reduce((sum, row) => sum + row.balanceAmount, 0);
      if (values.amountPaid != null && values.amountPaid > totalRemainingBalance) {
        toast.error(
          `Amount paid (${values.amountPaid}) cannot exceed total remaining balance (${totalRemainingBalance.toFixed(2)})`,
        );
        return;
      }

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

      const paymentDetailsData = feePaymentDetailsRows
        .filter((row) => (row.newAmountPaid || 0) > 0)
        .map((row) => ({
          paymentId: 0,
          feeInstallmentPlanId: row.feeInstallmentPlanId,
          feeTitle: row.feeTitle,
          amountDue: row.amountDue,
          amountPaid: row.newAmountPaid || 0,
          balanceAmount: row.balanceAmount,
        }));

      const bulkSubmissionData: IFeePaymentCollectionBulk = {
        paymentCollection: paymentCollectionData,
        paymentDetails: paymentDetailsData,
      };

      await feePaymentCollectionService.createFeePaymentCollectionBulk(bulkSubmissionData);
      toast.success('Fee payment collection created successfully!');
      if (onSuccess) onSuccess();
      else if (studentId) {
        const locale = pathname.split('/')[1] || 'en';
        router.push(`/${locale}/students/${studentId}`);
      } else {
        router.back();
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  if (studentId && detailsStatus.status === Status.LOADING) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>{t(LOCALE_KEYS.LOADING)}...</div>
      </div>
    );
  }

  if (allPlansPaidFromAPI && studentWithFeeInfo?.paymentCollections) {
    return (
      <AllFeesPaidView
        studentId={studentId}
        studentWithFeeInfo={studentWithFeeInfo}
        t={t}
      />
    );
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Card style={{ margin: '0 auto', padding: '24px' }} role="main" aria-labelledby="form-title">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={actionStatus.status === Status.LOADING}
        >
          <StudentSelectorCard
            noStudentInParam={noStudentInParam as boolean}
            studentId={studentId}
            studentWithFeeInfo={studentWithFeeInfo}
            courses={courses}
            batches={batches}
            students={students}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            selectedBatchId={selectedBatchId}
            setSelectedBatchId={setSelectedBatchId}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            onApplyStudent={handleApplyStudent}
            studentsLoading={listStatus.status === Status.LOADING && selectedBatchId != null}
            t={t}
          />

          {!noStudentInParam && (
            <>
              {studentWithFeeInfo?.feeStructure && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <Button type="default" onClick={() => setInvoiceVisible(true)}>
                    {t(LOCALE_KEYS.INVOICE, { defaultValue: 'Invoice' })}
                  </Button>
                </div>
              )}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <FeePaymentCollectionCard
                    form={form}
                    studentId={studentId}
                    studentFeeStructure={studentWithFeeInfo?.feeStructure}
                    studentWithFeeInfo={studentWithFeeInfo}
                    originalRows={originalRows}
                    onDistributeAmount={distributeAmountPaid}
                    onResetRows={resetRowsToOriginal}
                    t={t}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <FeePaymentDetailsCard
                    feePaymentDetailsRows={feePaymentDetailsRows}
                    studentFeeInstallmentPlans={studentFeeInstallmentPlans}
                    t={t}
                  />
                </Col>
              </Row>
              <Form.Item>
                <Space className="mt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={actionStatus.status === Status.LOADING}
                  >
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
      </Card>
      <Drawer
        title={t(LOCALE_KEYS.INVOICE, { defaultValue: 'Invoice' })}
        width={720}
        open={invoiceVisible}
        onClose={() => setInvoiceVisible(false)}
        destroyOnClose
        extra={
          <Button type="primary" onClick={handleDownloadInvoice}>
            Download PDF
          </Button>
        }
      >
        {studentWithFeeInfo?.feeStructure && (
          <div ref={invoiceRef}>
            <FeeStructureInvoice
              feeStructure={studentWithFeeInfo.feeStructure}
              installmentPlans={studentWithFeeInfo.feeStructure.installmentPlans || []}
              selectedDiscountTemplates={studentWithFeeInfo.student.discountTemplates ?? []}
              isInternational={!!studentWithFeeInfo.student.profile?.isInternational}
              paymentCollections={studentWithFeeInfo.paymentCollections}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
