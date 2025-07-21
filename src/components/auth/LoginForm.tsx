'use client'

import {Button, Card, Form, Input} from 'antd'
import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {useAuth} from '@/hooks/useAuth'
import type {LoginCredentials} from '@/types/auth'
import {toast, ToastContainer} from 'react-toastify'

export const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth()
  const [form] = Form.useForm()

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      await login(values)
      //show toast message using nextjs toast
      toast.success('Login successful!')
    } catch (error) {
      // Error is already handled by Redux store and displayed via error state
      console.error('Login failed:', error)
    }
  }

  // Clear error when form changes
  const handleFormChange = () => {
    if (error) {
      clearError()
    }
  }

  return (
    <>
    <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={true}/>
      <Card
        title={
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-600">
              Welcome back to LMS Taiba Admin Panel
            </p>
          </div>
        }
        style={{ width: 600}}
        className="shadow-lg rounded-lg"
      >
      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </Form.Item>

        {/* API Error Display */}
        {error && (
          <div className="mb-4">
            <div className="ant-form-item-explain ant-form-item-explain-error">
              <div className="ant-form-item-explain-error">{error}</div>
            </div>
          </div>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            size="large"
            className="h-12 text-base font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {`Don't have an account?{' '}`}
          <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Contact administrator
          </a>
        </p>
      </div>
      </Card>
    </>
  )
}
