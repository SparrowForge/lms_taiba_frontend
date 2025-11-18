'use client';

import { DollarOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Drawer, Form, Select, Spin, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useFeeStructures } from '@/hooks/useFeeStructures';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { IFeeInstallmentPlan } from '@/types/feeInstallmentPlan';
import { IFeeStructure } from '@/types/feeStructure';

const { Text } = Typography;

interface AssignFeeStructureDrawerProps {
  studentId?: number;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignFeeStructureDrawer: React.FC<AssignFeeStructureDrawerProps> = ({
  studentId,
  visible,
  onClose,
  onSuccess,
}) => {
  const { t } = useLocalization();
  const [form] = Form.useForm();
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<IFeeStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasExistingFeeStructure, setHasExistingFeeStructure] = useState(false);

  const {
    feeStructures,
    loadFeeStructures,
    selectedFeeStructure: loadedFeeStructure,
    loadFeeStructure,
    detailsStatus,
    setSelected,
  } = useFeeStructures();
  const { editStudent, students } = useStudents();

  // Load fee structures for dropdown and pre-select student's current fee structure
  useEffect(() => {
    if (visible) {
      loadFeeStructures({ page: 1, limit: 100 });

      // Pre-select student's current fee structure if they have one
      if (studentId) {
        const student = students.find((s) => s.id === studentId);
        if (student && student.feeStructureId) {
          // Set the form value to the student's current fee structure
          form.setFieldsValue({
            feeStructureId: student.feeStructureId.toString(),
          });
          // Set the selected fee structure for display
          setSelectedFeeStructure(student.feeStructure);
          // Mark that student has existing fee structure
          setHasExistingFeeStructure(true);
        } else {
          setHasExistingFeeStructure(false);
        }
      }
    }
  }, [visible, loadFeeStructures, studentId, students, form, setSelectedFeeStructure]);

  // Load selected fee structure details
  useEffect(() => {
    if (selectedFeeStructure) {
      loadFeeStructure(selectedFeeStructure.id);
    }
  }, [selectedFeeStructure, loadFeeStructure]);

  const handleFeeStructureChange = (feeStructureId: string) => {
    const feeStructure = feeStructures.find((fs) => fs.id === parseInt(feeStructureId));
    setSelectedFeeStructure(feeStructure || null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      await editStudent(studentId!, {
        feeStructureId: parseInt(values.feeStructureId),
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to assign fee structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Only clear if student doesn't have an existing fee structure
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.feeStructureId) {
      form.resetFields();
      setSelectedFeeStructure(null);
      setSelected(null);
    }
    onClose();
  };

  // Clear form and selection when drawer closes (but preserve if student has existing fee structure)
  useEffect(() => {
    if (!visible) {
      // Only clear if student doesn't have an existing fee structure
      const student = students.find((s) => s.id === studentId);
      if (!student || !student.feeStructureId) {
        form.resetFields();
        setSelectedFeeStructure(null);
        setSelected(null);
      }
    }
  }, [visible, form, setSelected, studentId, students]);

  const currentFeeStructure = loadedFeeStructure || selectedFeeStructure;

  return (
    <Drawer
      key={studentId} // Force remount when studentId changes
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarOutlined />
          {t(LOCALE_KEYS.ASSIGN_FEE_STRUCTURE, { defaultValue: 'Assign Fee Structure' })}
        </div>
      }
      width={800}
      open={visible}
      onClose={handleClose}
      destroyOnClose={true}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={handleClose}>
            {hasExistingFeeStructure
              ? t(LOCALE_KEYS.CLOSE, { defaultValue: 'Close' })
              : t(LOCALE_KEYS.CANCEL)}
          </Button>
          {!hasExistingFeeStructure && (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!selectedFeeStructure}
            >
              {t(LOCALE_KEYS.ASSIGN, { defaultValue: 'Assign' })}
            </Button>
          )}
        </div>
      }
    >
      {hasExistingFeeStructure && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
          }}
        >
          <Text type="success">
            {t(LOCALE_KEYS.STUDENT_ALREADY_HAS_FEE_STRUCTURE, {
              defaultValue: 'This student already has a fee structure assigned.',
            })}
          </Text>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          name="feeStructureId"
          label={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) })}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) }),
            },
          ]}
        >
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) })}
            showSearch
            optionFilterProp="label"
            onChange={handleFeeStructureChange}
            options={feeStructures.map((fs) => ({
              label: fs.templateName,
              value: fs.id.toString(),
            }))}
            style={{ width: '100%' }}
            disabled={hasExistingFeeStructure}
          />
        </Form.Item>
      </Form>

      {currentFeeStructure && (
        <Card
          title={t(LOCALE_KEYS.DETAILS_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) })}
          style={{ marginTop: '16px' }}
        >
          {detailsStatus.status === Status.LOADING ? (
            <Spin />
          ) : (
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t(LOCALE_KEYS.TEMPLATE_NAME)}>
                {currentFeeStructure.templateName}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.ACADEMIC_YEAR)}>
                {currentFeeStructure.academicYear}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.PAYMENT_TYPE)}>
                {currentFeeStructure.paymentType}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.TOTAL_FEES)}>
                <Text strong>
                  {currentFeeStructure.currency} {currentFeeStructure.totalFees}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.ADMISSION_FEE)}>
                {currentFeeStructure.currency} {currentFeeStructure.admissionFee}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.DISCOUNT_TYPE)}>
                {currentFeeStructure.discountType}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.DISCOUNT_AMOUNT)}>
                {currentFeeStructure.currency} {currentFeeStructure.discountAmount}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.CURRENCY)}>
                {currentFeeStructure.currency}
              </Descriptions.Item>
              {currentFeeStructure.remarks && (
                <Descriptions.Item label={t(LOCALE_KEYS.REMARKS)}>
                  {currentFeeStructure.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Card>
      )}

      {currentFeeStructure &&
        currentFeeStructure.installmentPlans &&
        currentFeeStructure.installmentPlans.length > 0 && (
          <Card
            title={t(LOCALE_KEYS.FEE_INSTALLMENT_PLANS, { defaultValue: 'Installment Plans' })}
            style={{ marginTop: '16px' }}
          >
            <Table
              dataSource={currentFeeStructure.installmentPlans}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: t(LOCALE_KEYS.SEQUENCE_NO),
                  dataIndex: 'sequenceNo',
                  key: 'sequenceNo',
                  width: 80,
                  render: (value: number) => <Text strong>#{value}</Text>,
                },
                {
                  title: t(LOCALE_KEYS.PAYMENT_LABEL),
                  dataIndex: 'paymentLabel',
                  key: 'paymentLabel',
                  render: (text: string) => <Text>{text}</Text>,
                },
                {
                  title: t(LOCALE_KEYS.AMOUNT),
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (amount: number, record: IFeeInstallmentPlan) => (
                    <Text strong>
                      {currentFeeStructure?.currency} {amount.toLocaleString()}
                    </Text>
                  ),
                },
                {
                  title: t(LOCALE_KEYS.DISCOUNT_AMOUNT),
                  dataIndex: 'discountAmount',
                  key: 'discountAmount',
                  render: (discount: number) => (
                    <Text type={discount > 0 ? 'success' : 'secondary'}>
                      {currentFeeStructure?.currency} {discount.toLocaleString()}
                    </Text>
                  ),
                },
                {
                  title: t(LOCALE_KEYS.DURATION_MONTHS),
                  dataIndex: 'durationMonths',
                  key: 'durationMonths',
                  render: (months: number) =>
                    `${months} ${t(LOCALE_KEYS.MONTH, { defaultValue: 'months' })}`,
                },
                {
                  title: t(LOCALE_KEYS.DUE_DATE),
                  dataIndex: 'dueDate',
                  key: 'dueDate',
                  render: (date: string) => new Date(date).toLocaleDateString(),
                },
              ]}
            />
          </Card>
        )}
    </Drawer>
  );
};

export default AssignFeeStructureDrawer;
