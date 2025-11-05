'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Spin } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';

import type { LoginCredentials } from '@/types/auth';
import { getErrorMessage } from '@/types/errors';

import SocialLogin from './SocialLogin';
import Link from 'next/link';

export const LoginForm = () => {
  const { t } = useLocalization();
  const { login, isLoading, error, clearError } = useAuth();
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState("")

  // Simple solution: Show loading for 500ms, then show form
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      await login(values);
      //show toast message using nextjs toast
      toast.success('Login successful!');
    } catch (error: unknown) {
      // Error is already handled by Redux store and displayed via error state
      console.error('Login failed:', error);
      toast.error(getErrorMessage(error) || 'Login failed!');
      setShowError(getErrorMessage(error))
    }
  };

  // Clear error when form changes
  const handleFormChange = () => {
    if (error) {
      clearError();
    }
  };

  // Show loading spinner for 500ms
  if (!showForm) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" style={{ color: '#000' }} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={true} />
      <Card style={{ width: 400, padding: '0px' }} className="shadow-lg rounded-lg">
        <div className="flex justify-center items-center pt-4 pb-2">
          <Image src="/logo2.PNG" alt="logo" width={80} height={80} />
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          layout="vertical"
          size="small" // changed from "large" → smaller inputs
          className="[&_.ant-form-item]:mb-2 [&_.ant-form-item-label]:mb-0" // reduce spacing between items
        >
          <Form.Item
            name="email"
            label={
              <span className="text-gray-500 text-[15px] font-semibold">
                {t(LOCALE_KEYS.EMAIL_USERNAME)}
              </span>
            }
            style={{ marginBottom: 8 }} // controls spacing to next item
            className="[&_.ant-form-item-label]:mb-0" // removes label→input gap
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              disabled={isLoading}
              className="h-8 text-sm"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <div className="text-gray-500 text-[15px]">
                <h1>{t(LOCALE_KEYS.PASSWORD)}</h1>
              </div>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
              { min: 6, message: 'Password must be at least 6 characters!' },
              // {
              //   pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
              //   message: "Password must contain letters and numbers!",
              // },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              disabled={isLoading}
              className="h-9 text-sm" // reduced height
            />
          </Form.Item>

          {/* API Error Display */}
          {error || showError && (
            <div className="mb-4">
              <div className="ant-form-item-explain ant-form-item-explain-error">
                <div className="ant-form-item-explain-error">{error || showError}</div>
              </div>
            </div>
          )}
          <div className="text-center flex justify-end">
            <Link href=""> <p className="text-sm text-[#1e45bf]">{t(LOCALE_KEYS.FORGET_PASSWORD)}</p></Link>
          </div>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="middle"
                className="h-9 text-base font-medium mb-0"
                disabled={
                  isLoading ||
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().some(({ errors }) => errors.length > 0)
                }
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            )}
          </Form.Item>

        </Form>
        <SocialLogin />
        {/* Footer */}
        {/* <div className="text-center mt-4">
        {/* <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {`Don't have an account?{' '}`}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
            >
              Contact administrator
            </Link>
          </p>
        </div> */}
      </Card>
    </>
  );
};
