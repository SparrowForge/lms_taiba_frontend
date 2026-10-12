"use client"

import { useAuth } from "@/hooks/useAuth"
import { LockOutlined, MailOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space, Typography, message } from "antd"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { toast } from "react-toastify"

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { handleForgotPassword } = useAuth()

  const onFinish = async (values: { email: string }) => {
    console.log(values)
    setLoading(true)
    const res = await handleForgotPassword(values)
    console.log("Forgot password email:", res)
    if (res.success) {
      toast.success(res?.message)
      router.push("/reset-password")
      setLoading(false)
    }

  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#1F4BCA]">
      {/* Left Component - Same as login page */}
      <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center">
        <div className="text-white text-center px-8">
          <h1 className="text-4xl font-bold mb-4">Secure Your Account</h1>
          <p className="text-lg opacity-90">
            Enter your registered email to get a code and start your reset password process.
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

          <Card
            style={{ width: '100%', maxWidth: 420 }}
            bordered={false}
            bodyStyle={{ padding: 32 }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Header */}
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Title level={3} style={{ marginBottom: 0 }}>
                  Forgot Password
                </Title>
                <Text type="secondary">
                  Enter your email address and we’ll send you a link to reset your
                  password.
                </Text>
              </Space>

              {/* Form */}
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="example@email.com"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 8 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    icon={<LockOutlined />}
                  >
                    Send Reset Code
                  </Button>
                </Form.Item>
              </Form>

              {/* Footer */}
              <Text type="secondary" style={{ textAlign: "center" }}>
                Remember your password?{" "}
                <a onClick={() => router.push("/login")}>Back to Login</a>
              </Text>
            </Space>
          </Card>

        </div>
      </div>
    </div>

  )
}
