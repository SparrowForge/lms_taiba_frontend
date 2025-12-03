"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button, Card, Divider, Space, Typography, Alert } from "antd"
import { CheckCircleOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

export default function ExamInstruction() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectId = searchParams.get("subjectId")
  const examId = searchParams.get("examId")

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,                // covers full screen
        overflowY: "auto",       // ALWAYS scrolls
        padding: 24,
        background: "#f5f5f5",
        zIndex: 1,               // stays above admin layout scroll locks
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <Card bordered={false} style={{ marginBottom: 50 }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            
            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ marginBottom: 8 }}>
                Exam Instructions
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Please read the following instructions carefully before starting
              </Text>
            </div>

            <Divider />

            {/* Alert */}
            <Alert
              message="Important"
              description="Once you start the exam, you will have a limited time to complete it."
              type="warning"
              showIcon
            />

            {/* Sections */}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {[
                {
                  title: "General Rules",
                  items: [
                    "Do not refresh the page",
                    "Do not navigate away",
                    "Submit before time runs out",
                    "Your progress is auto-saved",
                  ],
                },
                {
                  title: "Exam Format",
                  items: [
                    "Total Questions: 50",
                    "Duration: 2 hours",
                    "Multiple Choice + Short Answer",
                    "Negative Marking: -0.25",
                  ],
                },
                {
                  title: "Technical Requirements",
                  items: [
                    "Use desktop/tablet",
                    "Stable internet required",
                    "Chrome / Firefox / Safari recommended",
                    "Close background apps",
                  ],
                },
                {
                  title: "During the Exam",
                  items: [
                    "Read carefully",
                    "Mark questions for review",
                    "Review answers before submission",
                    "Submit when finished",
                  ],
                },
              ].map((section, idx) => (
                <div key={idx}>
                  <Title
                    level={4}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <CheckCircleOutlined style={{ color: "green" }} />
                    {section.title}
                  </Title>

                  <ul style={{ paddingLeft: 24, lineHeight: "1.6" }}>
                    {section.items.map((i, x) => (
                      <li key={x}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Space>

            <Divider />

            <Alert
              message="I have read and understood all instructions"
              type="success"
              showIcon
            />

            <Space
              style={{
                width: "100%",
                justifyContent: "center",
                paddingTop: 16,
              }}
            >
              <Button
                type="primary"
                size="large"
                style={{ paddingInline: 32, height: 48 }}
                onClick={() => router.push(`/participate-exam?subjectId=${subjectId}&examId=${examId}`)}
              >
                Start Exam
              </Button>

              <Button
                size="large"
                style={{ paddingInline: 32, height: 48 }}
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    </div>
  )
}
