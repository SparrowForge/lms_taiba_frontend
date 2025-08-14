'use client';

import {Button, DatePicker, Form, Input, Select, Space, Switch} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useAddresses} from '@/hooks/useAddresses';
import {useLocalization} from '@/hooks/useLocalization';
import {useStudentProfiles} from '@/hooks/useStudentProfiles';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IStudentProfileCreate, IStudentProfileUpdate} from '@/types/studentProfile';

import FormLayout from '../layout/FormLayout';

interface StudentProfileFormProps {
  mode: 'create' | 'edit';
  studentProfileId?: number;
  initialValues?: Partial<IStudentProfileCreate | IStudentProfileUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  mode,
  studentProfileId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createStudentProfile, editStudentProfile, actionStatus } = useStudentProfiles();
  const { students, loadStudents } = useStudents();
  const { addresses, loadAddresses } = useAddresses();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadStudents({ page: 1, limit: 100 });
    loadAddresses({ page: 1, limit: 100 });
  }, [loadStudents, loadAddresses]);

  const handleSubmit = async (values: Partial<IStudentProfileCreate | IStudentProfileUpdate>) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createStudentProfile(payload as IStudentProfileCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/student-profiles');
        }
      } else if (mode === 'edit' && studentProfileId) {
        await editStudentProfile(studentProfileId, payload as IStudentProfileUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/student-profiles/${studentProfileId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
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

  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === 'edit' ? {
        ...initialValues,
        dob: initialValues?.dob ? dayjs(initialValues.dob) : undefined,
      } : undefined}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="studentId"
        label={t(LOCALE_KEYS.STUDENT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.STUDENT) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_STUDENT, { defaultValue: 'Select Student' })}
          options={students.map((student) => ({
            label: student.name,
            value: student.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="dob"
        label={t(LOCALE_KEYS.DATE_OF_BIRTH)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.DATE_OF_BIRTH) }) }]}
      >
        <DatePicker
          placeholder={t(LOCALE_KEYS.SELECT_DATE_OF_BIRTH, { defaultValue: 'Select date of birth' })}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label={t(LOCALE_KEYS.GENDER)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.GENDER) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_GENDER, { defaultValue: 'Select gender' })}
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="maritalStatus"
        label={t(LOCALE_KEYS.MARITAL_STATUS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.MARITAL_STATUS) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_MARITAL_STATUS, { defaultValue: 'Select marital status' })}
          options={[
            { label: 'Single', value: 'single' },
            { label: 'Married', value: 'married' },
            { label: 'Divorced', value: 'divorced' },
            { label: 'Widowed', value: 'widowed' },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="presentAddressId"
        label={t(LOCALE_KEYS.PRESENT_ADDRESS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.PRESENT_ADDRESS) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_PRESENT_ADDRESS, { defaultValue: 'Select present address' })}
          options={addresses.map((address) => ({
            label: address.name,
            value: address.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="permanentAddressId"
        label={t(LOCALE_KEYS.PERMANENT_ADDRESS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.PERMANENT_ADDRESS) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_PERMANENT_ADDRESS, { defaultValue: 'Select permanent address' })}
          options={addresses.map((address) => ({
            label: address.name,
            value: address.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label={t(LOCALE_KEYS.PHONE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.PHONE) }) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_PHONE, { defaultValue: 'Enter phone number' })} />
      </Form.Item>

      <Form.Item
        name="mobile"
        label={t(LOCALE_KEYS.MOBILE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.MOBILE) }) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_MOBILE, { defaultValue: 'Enter mobile number' })} />
      </Form.Item>

      <Form.Item
        name="email"
        label={t(LOCALE_KEYS.EMAIL)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.EMAIL) }) },
          { type: 'email', message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL, { defaultValue: 'Please enter a valid email' }) }
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_EMAIL, { defaultValue: 'Enter email address' })} />
      </Form.Item>

      <Form.Item
        name="isTransferred"
        label={t(LOCALE_KEYS.IS_TRANSFERRED)}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="transferInfo"
        label={t(LOCALE_KEYS.TRANSFER_INFO)}
      >
        <Input.TextArea rows={3} placeholder={t(LOCALE_KEYS.ENTER_TRANSFER_INFO, { defaultValue: 'Enter transfer information' })} />
      </Form.Item>

      <Form.Item
        name="isInternational"
        label={t(LOCALE_KEYS.IS_INTERNATIONAL)}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="identityType"
        label={t(LOCALE_KEYS.IDENTITY_TYPE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.IDENTITY_TYPE) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_IDENTITY_TYPE, { defaultValue: 'Select identity type' })}
          options={[
            { label: 'National ID', value: 'nid' },
            { label: 'Passport', value: 'passport' },
            { label: 'Driver License', value: 'driver_license' },
            { label: 'Other', value: 'other' },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="identityNo"
        label={t(LOCALE_KEYS.IDENTITY_NO)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.IDENTITY_NO) }) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_IDENTITY_NO, { defaultValue: 'Enter identity number' })} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default StudentProfileForm;
