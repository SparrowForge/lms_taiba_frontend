'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useUsers} from '@/hooks/useUsers';

import {getErrorMessage} from '@/types/errors';
import {IUserCreate, IUserUpdate} from '@/types/user';

import FormLayout from '../layout/FormLayout';
import StatusSelect from '../ui/StatusSelect';

interface UserFormProps {
  mode: 'create' | 'edit';
  userId?: number;
  initialValues?: Partial<IUserCreate | IUserUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean; // If true, don't show own styling (for use in drawer/modal)
}

const UserForm: React.FC<UserFormProps> = ({
  mode,
  userId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { addUser, editUser, actionStatus } = useUsers();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: IUserCreate | IUserUpdate) => {
    try {
      if (mode === 'create') {
        await addUser(values as IUserCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/users');
        }
      } else if (mode === 'edit' && userId) {
        await editUser(userId, values as IUserUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/users/${userId}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        getErrorMessage(error) || t(LOCALE_KEYS.FAILED_NAME, { name: entityName });
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

  const getSubmitText = () => {
    return mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });
  };

  const formContent = (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={mode === 'edit' ? initialValues : undefined}
        aria-label={`${mode === 'create' ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName }) : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} form`}
        role="form"
      >
        <Form.Item
          name="firstName"
          label={t(LOCALE_KEYS.FIRST_NAME)}
          rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_FIRST_NAME) }]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.FIRST_NAME)}
            aria-label={t(LOCALE_KEYS.FIRST_NAME)}
            aria-required="true"
            aria-describedby="firstName-help"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t(LOCALE_KEYS.LAST_NAME)}
          rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_LAST_NAME) }]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.LAST_NAME)}
            aria-label={t(LOCALE_KEYS.LAST_NAME)}
            aria-required="true"
            aria-describedby="lastName-help"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t(LOCALE_KEYS.EMAIL)}
          rules={[
            { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_EMAIL) },
            { type: 'email', message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL) },
          ]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.EMAIL)}
            type="email"
            aria-label={t(LOCALE_KEYS.EMAIL)}
            aria-required="true"
            aria-describedby="email-help"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t(LOCALE_KEYS.PHONE)}
          rules={[{ pattern: /^[0-9+\-\s()]*$/, message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_PHONE) }]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.PHONE)}
            type="tel"
            aria-label={t(LOCALE_KEYS.PHONE)}
            aria-describedby="phone-help"
          />
        </Form.Item>

        {mode === 'create' && (
          <Form.Item
            name="password"
            label={t(LOCALE_KEYS.PASSWORD)}
            rules={[
              { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_PASSWORD) },
              { min: 6, message: t(LOCALE_KEYS.PASSWORD_MIN_LENGTH) },
            ]}
          >
            <Input.Password
              placeholder={t(LOCALE_KEYS.PASSWORD)}
              aria-label={t(LOCALE_KEYS.PASSWORD)}
              aria-required="true"
              aria-describedby="password-help"
            />
          </Form.Item>
        )}

        <Form.Item
          name="status"
          label={t(LOCALE_KEYS.STATUS)}
          rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_STATUS) }]}
        >
          <StatusSelect options={ENTITY_STATUS_OPTIONS} />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}>
          <div role="group" aria-label="Form actions">
            <Space size={embedded ? 'small' : 'large'}>
              <Button
                loading={actionStatus.status === Status.LOADING}
                type="primary"
                htmlType="submit"
                size={embedded ? 'middle' : 'large'}
                style={{ minWidth: embedded ? '80px' : '120px' }}
                aria-label={`${getSubmitText()} button`}
              >
                {getSubmitText()}
              </Button>
              <Button
                onClick={handleCancel}
                size={embedded ? 'middle' : 'large'}
                style={{ minWidth: embedded ? '80px' : '120px' }}
                aria-label={t(LOCALE_KEYS.CANCEL) + ' button'}
              >
                {t(LOCALE_KEYS.CANCEL)}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </>
  );

  return (
    <>
      {embedded ? (
        formContent
      ) : (
        <FormLayout>
          {/* <h1
              id="form-title"
              style={{
                marginBottom: '24px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              {mode === 'create' ? 'Create New User' : 'Edit User'}
            </h1> */}
          {formContent}
        </FormLayout>
      )}
    </>
  );
};

export default UserForm;
