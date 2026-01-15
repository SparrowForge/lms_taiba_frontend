"use client"

import { useAuth } from "@/hooks/useAuth"
import {
  LockOutlined,
  CheckCircleOutlined,
  CodeOutlined,
} from "@ant-design/icons"
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  message,
} from "antd"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

const { Title, Text } = Typography

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const { handleResetPassword } = useAuth()

  const onFinish = async (values: {
    code: string
    password: string
    confirmPassword: string
  }) => {
    if (values.password !== values.confirmPassword) {
      return toast.error("Password doesn't match")
    }
    const data = {
      code: values.code,
      newPassword: values.password
    }
    setLoading(true)
    const res = await handleResetPassword(data)

    if (res.success) {
      toast.success("Password reset successfully")
      router.push("/login")
    }


  }

  return (

    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#1F4BCA]">
      {/* Left Component - Same as login page */}
      <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center">
        <div className="text-white text-center px-8">
          <h1 className="text-4xl font-bold mb-4">Secure Your Account</h1>
          <p className="text-lg opacity-90">
            Enter the verification code sent to your email and add a new password to complete the reset password process.
          </p>
        </div>
      </div>

      {/* Right Component - Verification Form */}
      <div className="w-full md:w-1/2 min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <Image src="/logo2.PNG" alt="logo" width={80} height={80} />
          </div>

          {/* Verification Card */}
          <Card
            style={{ width: 420 }}
            bordered={false}
            bodyStyle={{ padding: 32 }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Header */}
              <Space direction="vertical" size={4}>
                <Title level={3} style={{ marginBottom: 0 }}>
                  Reset Password
                </Title>
                <Text type="secondary">
                  Please enter your new password below.
                </Text>
              </Space>

              {/* Form */}
              <Form layout="vertical" onFinish={onFinish}>

                <Form.Item
                  label="Code"
                  name="code"
                  rules={[
                    { required: true, message: "Please enter your  code" },
                    { min: 6, message: "Code must be at least 6 digit" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<CodeOutlined />}
                    placeholder="Enter Code"
                  />
                </Form.Item>

                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your new password" },
                    { min: 8, message: "Password must be at least 8 characters" },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="New password"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error("Passwords do not match")
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Confirm password"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 8 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Reset Password
                  </Button>
                </Form.Item>
              </Form>

              {/* Footer */}
              <Text type="secondary" style={{ textAlign: "center" }}>
                Remembered your password?{" "}
                <a onClick={() => router.push("/login")}>Back to Login</a>
              </Text>
            </Space>
          </Card>
        </div>
      </div>
    </div>

  )
}
