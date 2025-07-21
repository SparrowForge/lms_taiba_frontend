'use client';

import React, {useEffect} from 'react';
import {Button, Form, Input, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useUsers} from '@/hooks/useUsers';
import {IUserCreate, IUserUpdate} from '@/types/user';
import {Status} from '@/types/common';
import {toast} from 'react-toastify';

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
        toast.success('User created successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/users');
        }
      } else if (mode === 'edit' && userId) {
        await editUser(userId, values as IUserUpdate);
        toast.success('User updated successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/users/${userId}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to ${mode} user`;
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
    return mode === 'create' ? 'Create User' : 'Update User';
  };

  const formContent = (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        aria-label={`${mode === 'create' ? 'Create' : 'Edit'} user form`}
        role="form"
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input 
            placeholder="Enter first name" 
            aria-label="First name"
            aria-required="true"
            aria-describedby="firstName-help"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input 
            placeholder="Enter last name" 
            aria-label="Last name"
            aria-required="true"
            aria-describedby="lastName-help"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            placeholder="Enter email address" 
            type="email"
            aria-label="Email address"
            aria-required="true"
            aria-describedby="email-help"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { pattern: /^[0-9+\-\s()]*$/, message: 'Please enter a valid phone number' }
          ]}
        >
          <Input 
            placeholder="Enter phone number" 
            type="tel"
            aria-label="Phone number"
            aria-describedby="phone-help"
          />
        </Form.Item>

        {mode === 'create' && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              placeholder="Enter password" 
              aria-label="Password"
              aria-required="true"
              aria-describedby="password-help"
            />
          </Form.Item>
        )}

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select 
            placeholder="Select status"
            aria-label="User status"
            aria-required="true"
            aria-describedby="status-help"
          >
            <Select.Option value="active" aria-label="Active status">Active</Select.Option>
            <Select.Option value="inactive" aria-label="Inactive status">Inactive</Select.Option>
            <Select.Option value="pending" aria-label="Pending status">Pending</Select.Option>
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
                aria-label="Cancel button"
              >
                Cancel
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
            <h1 
              id="form-title" 
              style={{ 
                marginBottom: '24px', 
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              {mode === 'create' ? 'Create New User' : 'Edit User'}
            </h1>
            {formContent}
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
