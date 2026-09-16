'use client';

import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useBranches } from '@/hooks/useBranches';
import { useCourses } from '@/hooks/useCourses';
import { useLeads } from '@/hooks/useLeads';
import { useLocalization } from '@/hooks/useLocalization';
import { useUsers } from '@/hooks/useUsers';

import { getErrorMessage } from '@/types/errors';
import { ILead, ILeadCreate, ILeadUpdate } from '@/types/lead';

import FormLayout from '../layout/FormLayout';

interface Props {
  mode: 'create' | 'edit';
  leadId?: number;
  initialValues?: Partial<ILead>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const LeadForm: React.FC<Props> = ({
  mode,
  leadId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' });
  const router = useRouter();
  const [form] = Form.useForm();
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const { createLead, editLead, actionStatus, sources, loadSources, checkDuplicate } = useLeads();
  const { courses, loadCourses } = useCourses();
  const { batches, loadBatches } = useBatches();
  const { branches, loadBranches } = useBranches();
  const { users, loadUsers } = useUsers();

  useEffect(() => {
    loadSources();
    loadCourses({ page: 1, limit: 100 });
    loadBatches({ page: 1, limit: 100 });
    loadBranches({ page: 1, limit: 100 });
    loadUsers({ page: 1, limit: 100 });
  }, [loadSources, loadCourses, loadBatches, loadBranches, loadUsers]);

  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  // Dates arrive as ISO strings; Ant Design's pickers need dayjs objects.
  const formInitialValues = React.useMemo(() => {
    if (mode !== 'edit' || !initialValues) return undefined;
    return {
      ...initialValues,
      dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : undefined,
      expectedIntakeDate: initialValues.expectedIntakeDate
        ? dayjs(initialValues.expectedIntakeDate)
        : undefined,
      nextFollowUpAt: initialValues.nextFollowUpAt
        ? dayjs(initialValues.nextFollowUpAt)
        : undefined,
    };
  }, [mode, initialValues]);

  /**
   * Warns before the counsellor fills in a whole record the system will
   * reject with a 409 on submit.
   */
  const handleContactBlur = async () => {
    if (mode !== 'create') return;
    const email = form.getFieldValue('email') as string | undefined;
    const phone = form.getFieldValue('phone') as string | undefined;
    const duplicate = await checkDuplicate(email, phone);
    setDuplicateWarning(
      duplicate
        ? `An open lead already exists for this contact: ${duplicate.leadNo} (${duplicate.firstName} ${duplicate.lastName}).`
        : null,
    );
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? (values.dateOfBirth as dayjs.Dayjs).format('YYYY-MM-DD')
        : undefined,
      expectedIntakeDate: values.expectedIntakeDate
        ? (values.expectedIntakeDate as dayjs.Dayjs).format('YYYY-MM-DD')
        : undefined,
      nextFollowUpAt: values.nextFollowUpAt
        ? (values.nextFollowUpAt as dayjs.Dayjs).toISOString()
        : undefined,
    };

    try {
      if (mode === 'create') {
        await createLead(payload as ILeadCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/leads');
      } else if (mode === 'edit' && leadId) {
        await editLead(leadId, payload as ILeadUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/leads/${leadId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, { name: entityName });
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        errorMessage = getErrorMessage(error);
      }
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  const loading = actionStatus.status === Status.LOADING;

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={formInitialValues}
      onFinish={handleSubmit}
      disabled={loading}
    >
      {duplicateWarning && (
        <div
          role="alert"
          style={{
            marginBottom: 16,
            padding: '8px 12px',
            border: '1px solid #ffa940',
            background: '#fff7e6',
            borderRadius: 4,
            color: '#873800',
          }}
        >
          {duplicateWarning}
        </div>
      )}

      <Divider orientation="left">{t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' })}</Divider>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="firstName"
            label={t(LOCALE_KEYS.FIRST_NAME, { defaultValue: 'First name' })}
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input id="lead-firstName" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="middleName"
            label={t(LOCALE_KEYS.MIDDLE_NAME, { defaultValue: 'Middle name' })}
          >
            <Input id="lead-middleName" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="lastName"
            label={t(LOCALE_KEYS.LAST_NAME, { defaultValue: 'Last name' })}
            rules={[{ required: true, message: 'Last name is required' }]}
          >
            <Input id="lead-lastName" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="email"
            label={t(LOCALE_KEYS.EMAIL, { defaultValue: 'Email' })}
            rules={[{ type: 'email', message: 'Enter a valid email address' }]}
          >
            <Input id="lead-email" onBlur={handleContactBlur} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="phone" label={t(LOCALE_KEYS.PHONE, { defaultValue: 'Phone' })}>
            <Input id="lead-phone" onBlur={handleContactBlur} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="alternatePhone" label="Alternate phone">
            <Input id="lead-alternatePhone" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item name="gender" label={t(LOCALE_KEYS.GENDER, { defaultValue: 'Gender' })}>
            <Select
              id="lead-gender"
              allowClear
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="dateOfBirth" label="Date of birth">
            <DatePicker id="lead-dateOfBirth" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="city" label="City">
            <Input id="lead-city" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Source</Divider>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item name="sourceId" label="Lead source">
            <Select
              id="lead-sourceId"
              allowClear
              showSearch
              optionFilterProp="label"
              options={sources.map((s) => ({ label: s.name, value: s.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="campaign" label="Campaign">
            <Input id="lead-campaign" placeholder="e.g. Spring Fair 2026" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="referredBy" label="Referred by">
            <Input id="lead-referredBy" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Interest</Divider>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item name="courseId" label={t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' })}>
            <Select
              id="lead-courseId"
              allowClear
              showSearch
              optionFilterProp="label"
              options={courses.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="batchId" label={t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' })}>
            <Select
              id="lead-batchId"
              allowClear
              showSearch
              optionFilterProp="label"
              options={batches.map((b) => ({ label: b.name, value: b.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="branchId" label={t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' })}>
            <Select
              id="lead-branchId"
              allowClear
              showSearch
              optionFilterProp="label"
              options={branches.map((b) => ({ label: b.name, value: b.id }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Ownership</Divider>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item name="expectedIntakeDate" label="Expected intake">
            <DatePicker id="lead-expectedIntakeDate" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="assignedToUserId" label="Assigned counsellor">
            <Select
              id="lead-assignedToUserId"
              allowClear
              showSearch
              optionFilterProp="label"
              options={users.map((u) => ({
                label: u.email ?? `User #${u.id}`,
                value: u.id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="nextFollowUpAt" label="Next follow-up">
            <DatePicker id="lead-nextFollowUpAt" showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS, { defaultValue: 'Remarks' })}>
        <Input.TextArea id="lead-remarks" rows={3} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === 'create'
              ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
              : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName })}
          </Button>
          <Button onClick={handleCancel} disabled={loading}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default LeadForm;
