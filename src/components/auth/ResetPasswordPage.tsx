"use client"

import { useAuth } from "@/hooks/useAuth"
import {
  LockOutlined,
  CheckCircleOutlined,
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
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const { Title, Text } = Typography

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const {handleResetPassword} = useAuth()

  const onFinish = async (values: {
    password: string
    confirmPassword: string
  }) => {
    try {
      setLoading(true)

      if (!token) {
        message.error("Invalid or expired reset link.")
        return
      }

      // 🔗 API CALL GOES HERE
      console.log("Reset token:", token)
      console.log("New password:", values.password)

      message.success("Password reset successfully. You can now login.")

      router.push("/login")
    } catch (error) {
      message.error("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
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
  )
}
