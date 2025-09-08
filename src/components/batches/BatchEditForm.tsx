'use client';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useLocalization } from '@/hooks/useLocalization';
import { useSemesters } from '@/hooks/useSemesters';

import { IBatch, IBatchUpdate } from '@/types/batch';
import { getErrorMessage } from '@/types/errors';
import { ISemester } from '@/types/semester';

import { StatusSelectFormItem } from '../ui/StatusSelect';

const { Text } = Typography;

interface BatchEditFormProps {
  batchId: number;
  initialValues?: Partial<IBatchUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BatchEditForm: React.FC<BatchEditFormProps> = ({
  batchId,
  initialValues,
  onSuccess,
  onCancel,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { editBatchWithSemesters, actionStatus, selectedBatch } = useBatches();
  const { semesters, loadSemesters, listStatus } = useSemesters();

  // Local state for managing semester updates
  const [localSemesters, setLocalSemesters] = useState<ISemester[]>([]);

  useEffect(() => {
    loadSemesters({ page: 1, limit: 100 });
  }, [loadSemesters]);

  // Update local semesters when semesters are loaded
  useEffect(() => {
    if (semesters.length > 0) {
      setLocalSemesters(semesters);
    }
  }, [semesters]);

  // Update semester data
  const updateSemester = (index: number, field: keyof ISemester, value: any) => {
    const updatedSemesters = [...localSemesters];
    updatedSemesters[index] = { ...updatedSemesters[index], [field]: value };
    setLocalSemesters(updatedSemesters);
  };

  const handleSubmit = async (values: Partial<IBatch>) => {
    try {
      const batchPayload = {
        ...values,
        startDate: values.startDate
          ? dayjs(values.startDate as unknown as string | Date).toISOString()
          : undefined,
        endDate: values.endDate
          ? dayjs(values.endDate as unknown as string | Date).toISOString()
          : undefined,
      };

      // Prepare semester data for update
      const semesterPayload = localSemesters.map((semester) => ({
        id: semester.id,
        name: semester.name,
        termNo: semester.termNo,
        startDate: semester.startDate,
        endDate: semester.endDate,
        status: semester.status,
        remarks: semester.remarks,
        isBreak: semester.isBreak,
      }));

      // Update batch with semesters in single API call
      const updateData = {
        batch: batchPayload as IBatchUpdate,
        semesters: semesterPayload,
      };

      await editBatchWithSemesters(batchId, updateData);

      toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/batches/${batchId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to update ${entityName.toLowerCase()}`,
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
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const batchFormContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        startDate: initialValues?.startDate ? dayjs(initialValues.startDate) : undefined,
        endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
      }}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item name="courseId" label={t(LOCALE_KEYS.COURSE)}>
        <Select disabled={true} value={selectedBatch?.courseId}>
          {selectedBatch?.course && (
            <Select.Option key={selectedBatch.course.id} value={selectedBatch.course.id}>
              {selectedBatch.course.name} ({selectedBatch.course.durationInSemesters} semesters)
            </Select.Option>
          )}
        </Select>
      </Form.Item>
      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="academicYear"
        label={t(LOCALE_KEYS.ACADEMIC_YEAR)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACADEMIC_YEAR) }),
          },
        ]}
      >
        <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="session"
        label={t(LOCALE_KEYS.SESSION)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SESSION) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="intakeCapacity"
        label={t(LOCALE_KEYS.INTAKE_CAPACITY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INTAKE_CAPACITY) }),
          },
        ]}
      >
        <InputNumber min={1} max={10000} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="startDate"
        label={t(LOCALE_KEYS.START_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.START_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label={t(LOCALE_KEYS.END_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.END_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />
      <Form.Item
        name="remarks"
        label={t(LOCALE_KEYS.REMARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) }),
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.UPDATE_NAME, { name: entityName })}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={`Edit ${entityName}`} style={{ height: 'fit-content' }}>
            {batchFormContent}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={`Semesters (${localSemesters.length})`} style={{ height: 'fit-content' }}>
            {listStatus.status === Status.LOADING ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text>Loading semesters...</Text>
              </div>
            ) : localSemesters.length > 0 ? (
              localSemesters.map((semester, index) => (
                <Card
                  key={semester.id}
                  size="small"
                  style={{ marginBottom: 16 }}
                  title={`Semester ${semester.termNo}`}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.NAME)} style={{ marginBottom: 8 }}>
                        <Input
                          value={semester.name}
                          onChange={(e) => updateSemester(index, 'name', e.target.value)}
                          placeholder="Semester name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.TERM_NO)} style={{ marginBottom: 8 }}>
                        <InputNumber
                          value={semester.termNo}
                          onChange={(value) => updateSemester(index, 'termNo', value)}
                          min={1}
                          max={20}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.START_DATE)} style={{ marginBottom: 8 }}>
                        <DatePicker
                          value={semester.startDate ? dayjs(semester.startDate) : undefined}
                          onChange={(date) =>
                            updateSemester(index, 'startDate', date ? date.toISOString() : '')
                          }
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.END_DATE)} style={{ marginBottom: 8 }}>
                        <DatePicker
                          value={semester.endDate ? dayjs(semester.endDate) : undefined}
                          onChange={(date) =>
                            updateSemester(index, 'endDate', date ? date.toISOString() : '')
                          }
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.STATUS)} style={{ marginBottom: 8 }}>
                        <Select
                          value={semester.status}
                          onChange={(value) => updateSemester(index, 'status', value)}
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="inactive">Inactive</Select.Option>
                          <Select.Option value="completed">Completed</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.REMARKS)} style={{ marginBottom: 8 }}>
                        <Input
                          value={semester.remarks}
                          onChange={(e) => updateSemester(index, 'remarks', e.target.value)}
                          placeholder="Remarks"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={t(LOCALE_KEYS.IS_BREAK)} style={{ marginBottom: 8 }}>
                        <Switch
                          value={semester.isBreak}
                          onChange={(value: boolean) => updateSemester(index, 'isBreak', value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text>No semesters found for this batch.</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BatchEditForm;
