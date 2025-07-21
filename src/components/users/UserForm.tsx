'use client';

import React, {useEffect} from 'react';
import {Button, Form, Input, message, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useUsers} from '@/hooks/useUsers';
import {IUserCreate, IUserUpdate} from '@/types/user';

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
  const { addUser, editUser } = useUsers();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: IUserCreate | IUserUpdate) => {
    try {
      if (mode === 'create') {
        await addUser(values as IUserCreate);
        messageApi.success('User created successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/users');
        }
      } else if (mode === 'edit' && userId) {
        await editUser(userId, values as IUserUpdate);
        messageApi.success('User updated successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/users/${userId}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${mode} user`;
      messageApi.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // const getTitle = () => {
  //   return mode === 'create' ? 'Create User' : 'Edit User';
  // };

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
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { pattern: /^[0-9+\-\s()]*$/, message: 'Please enter a valid phone number' }
          ]}
        >
          <Input placeholder="Enter phone number" />
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
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role' }]}
        >
          <Select placeholder="Select role">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="teacher">Teacher</Select.Option>
            <Select.Option value="student">Student</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}>
          <Space size={embedded ? 'small' : 'large'}>
            <Button
              type="primary"
              htmlType="submit"
              size={embedded ? 'middle' : 'large'}
              style={{ minWidth: embedded ? '80px' : '120px' }}
            >
              {getSubmitText()}
            </Button>
            <Button
              onClick={handleCancel}
              size={embedded ? 'middle' : 'large'}
              style={{ minWidth: embedded ? '80px' : '120px' }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );

  return (
    <>
      {contextHolder}
      {embedded ? (
        formContent
      ) : (
        <div style={{ padding: '24px' }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {formContent}
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
