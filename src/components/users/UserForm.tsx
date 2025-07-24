'use client';

import React, {useEffect} from 'react';
import {Button, Form, Input, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useUsers} from '@/hooks/useUsers';
import {IUserCreate, IUserUpdate} from '@/types/user';
import {Status} from '@/types/common';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';
import {getErrorMessage} from '@/types/errors';

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
  embedded = false
}) => {
  const t = useTranslations();
  const entityName = t('user', { defaultValue: 'User' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { addUser, editUser, actionStatus } = useUsers();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: IUserCreate | IUserUpdate) => {
    try {
      if (mode === 'create') {
        await addUser(values as IUserCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/users');
        }
      } else if (mode === 'edit' && userId) {
        await editUser(userId, values as IUserUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/users/${userId}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || t('failed_name', { name: entityName });
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
    return mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName });
  };

  const formContent = (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        aria-label={`${mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName })} form`}
        role="form"
      >
        <Form.Item
          name="firstName"
          label={t('firstName')}
          rules={[{ required: true, message: t('pleaseEnterFirstName') }]}
        >
          <Input
            placeholder={t('firstName')}
            aria-label={t('firstName')}
            aria-required="true"
            aria-describedby="firstName-help"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t('lastName')}
          rules={[{ required: true, message: t('pleaseEnterLastName') }]}
        >
          <Input
            placeholder={t('lastName')}
            aria-label={t('lastName')}
            aria-required="true"
            aria-describedby="lastName-help"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('email')}
          rules={[
            { required: true, message: t('pleaseEnterEmail') },
            { type: 'email', message: t('pleaseEnterValidEmail') }
          ]}
        >
          <Input
            placeholder={t('email')}
            type="email"
            aria-label={t('email')}
            aria-required="true"
            aria-describedby="email-help"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t('phone')}
          rules={[
            { pattern: /^[0-9+\-\s()]*$/, message: t('pleaseEnterValidPhone') }
          ]}
        >
          <Input
            placeholder={t('phone')}
            type="tel"
            aria-label={t('phone')}
            aria-describedby="phone-help"
          />
        </Form.Item>

        {mode === 'create' && (
          <Form.Item
            name="password"
            label={t('password')}
            rules={[
              { required: true, message: t('pleaseEnterPassword') },
              { min: 6, message: t('passwordMinLength') }
            ]}
          >
            <Input.Password
              placeholder={t('password')}
              aria-label={t('password')}
              aria-required="true"
              aria-describedby="password-help"
            />
          </Form.Item>
        )}

        <Form.Item
          name="status"
          label={t('status')}
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('status')}
            aria-label={t('status')}
            aria-required="true"
            aria-describedby="status-help"
          >
            <Select.Option value="active" aria-label={t('active')}>{t('active')}</Select.Option>
            <Select.Option value="inactive" aria-label={t('inactive')}>{t('inactive')}</Select.Option>
            <Select.Option value="pending" aria-label={t('pending')}>{t('pending')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}
        >
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
                aria-label={t('cancel') + ' button'}
              >
                {t('cancel')}
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
        <div style={{ padding: '24px' }}>
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            role="main"
            aria-labelledby="form-title"
          >
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
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
