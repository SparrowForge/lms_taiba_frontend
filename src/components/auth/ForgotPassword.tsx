"use client"

import { useAuth } from "@/hooks/useAuth"
import { LockOutlined, MailOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space, Typography, message } from "antd"
import { useRouter } from "next/navigation"
import { use, useState } from "react"

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {handleForgotPassword} = useAuth()

  const onFinish = async (values: { email: string }) => {
    console.log(values)
      await handleForgotPassword({ email: values.email })
      console.log("Forgot password email:", values.email)


  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Card
        style={{ width: 420 }}
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
                Send Reset Link
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
  )
}
