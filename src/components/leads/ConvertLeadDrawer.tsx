'use client';

import { Alert, Button, DatePicker, Drawer, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useBranches } from '@/hooks/useBranches';
import { useCourses } from '@/hooks/useCourses';
import { useLeads } from '@/hooks/useLeads';
import { useSections } from '@/hooks/useSections';

import { ILead, ILeadConvert } from '@/types/lead';

interface Props {
  lead: ILead | null;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * Converts a lead into a student. Fields left blank fall back to the lead's
 * own values, which is why nothing here is required except a course - and
 * that only when the lead has none.
 */
const ConvertLeadDrawer: React.FC<Props> = ({ lead, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { convertLead, actionStatus } = useLeads();
  const { courses, loadCourses } = useCourses();
  const { batches, loadBatches } = useBatches();
  const { branches, loadBranches } = useBranches();
  const { sections, loadSections } = useSections();

  useEffect(() => {
    if (!visible) return;
    loadCourses({ page: 1, limit: 100 });
    loadBatches({ page: 1, limit: 100 });
    loadBranches({ page: 1, limit: 100 });
    loadSections({ page: 1, limit: 100 });
  }, [visible, loadCourses, loadBatches, loadBranches, loadSections]);

  useEffect(() => {
    if (visible && lead) {
      form.setFieldsValue({
        courseId: lead.courseId ?? undefined,
        batchId: lead.batchId ?? undefined,
        branchId: lead.branchId ?? undefined,
        admissionDate: dayjs(),
      });
    }
  }, [visible, lead, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!lead) return;
    try {
      const result = await convertLead(lead.id, {
        ...values,
        admissionDate: values.admissionDate
          ? (values.admissionDate as dayjs.Dayjs).format('YYYY-MM-DD')
          : undefined,
      } as ILeadConvert);

      toast.success(`Converted to student #${result.student.id}`);
      onSuccess();
      router.push(`/students/${result.student.id}`);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError?.response?.data?.message || 'Failed to convert lead');
    }
  };

  const loading = actionStatus.status === Status.LOADING;

  return (
    <Drawer
      key={lead?.id}
      title={lead ? `Convert ${lead.firstName} ${lead.lastName} to a student` : 'Convert lead'}
      width={560}
      open={visible}
      onClose={onCancel}
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="This creates a student record and closes the lead as Enrolled."
        description="The lead is kept for funnel reporting and becomes read-only. Anything left blank below is taken from the lead."
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={loading}>
        <Form.Item name="applicationNo" label="Application number">
          <Input id="convert-applicationNo" placeholder="Leave blank to assign later" />
        </Form.Item>

        <Form.Item name="admissionDate" label="Admission date">
          <DatePicker id="convert-admissionDate" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="courseId"
          label="Course"
          rules={[{ required: true, message: 'A course is required to enroll' }]}
        >
          <Select
            id="convert-courseId"
            showSearch
            optionFilterProp="label"
            options={courses.map((c) => ({ label: c.name, value: c.id }))}
          />
        </Form.Item>

        <Form.Item name="batchId" label="Batch">
          <Select
            id="convert-batchId"
            allowClear
            showSearch
            optionFilterProp="label"
            options={batches.map((b) => ({ label: b.name, value: b.id }))}
          />
        </Form.Item>

        <Form.Item name="sectionId" label="Section">
          <Select
            id="convert-sectionId"
            allowClear
            showSearch
            optionFilterProp="label"
            options={sections.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>

        <Form.Item name="branchId" label="Branch">
          <Select
            id="convert-branchId"
            allowClear
            showSearch
            optionFilterProp="label"
            options={branches.map((b) => ({ label: b.name, value: b.id }))}
          />
        </Form.Item>

        <Form.Item name="note" label="Note">
          <Input.TextArea id="convert-note" rows={2} />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Convert to student
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default ConvertLeadDrawer;
