"use client"

import { Button, Card, Col, Radio, Row, Space, Typography } from "antd"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { useState, useMemo } from "react"

interface QuestionOption {
  text: string
  order: number
}

interface Question {
  questionText: string
  options: QuestionOption[]
  correctOptionNumber: string
  difficultyLevel: "easy" | "medium" | "hard"
  courseId?: number
  subjectId?: number
  facultyId?: number
  id?: string
}

interface QuizParticipantProps {
  questions: Question[]
  onSubmit?: (answers: Record<number, string>) => Promise<void>
  onCancel?: () => void
  title?: string
  isLoading?: boolean
}

const { Title, Text } = Typography

export default function QuizParticipant({
  questions,
  onSubmit,
  onCancel,
  title = "Quiz",
  isLoading = false,
}: QuizParticipantProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const optionLabels = ["a", "b", "c", "d"]
  const optionLetters = ["A", "B", "C", "D"]

  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      if (onSubmit) {
        await onSubmit(answers)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const currentAnswer = answers[currentQuestionIndex] || ""
  const progressPercentage = useMemo(
    () => Math.round(((currentQuestionIndex + 1) / questions.length) * 100),
    [currentQuestionIndex, questions.length],
  )

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "#52c41a"
      case "medium":
        return "#faad14"
      case "hard":
        return "#ff4d4f"
      default:
        return "#1677ff"
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Row gutter={24}>
          {/* Left Sidebar - Question Numbers */}
          <Col xs={24} sm={8} md={6}>
            <Card
              title={title}
              size="small"
              className="sticky top-6"
              style={{ maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                {questions.map((_, idx) => {
                  const isAnswered = idx in answers
                  const isCurrentQuestion = idx === currentQuestionIndex

                  return (
                    <Card
                      key={idx}
                      size="small"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className="cursor-pointer transition-all"
                      style={{
                        border: isCurrentQuestion ? "2px solid #1677ff" : "1px solid #d9d9d9",
                        backgroundColor: isCurrentQuestion ? "#e6f7ff" : isAnswered ? "#f6ffed" : "transparent",
                      }}
                      hoverable
                    >
                      <div className="flex items-center justify-between">
                        <Text strong>Q{idx + 1}</Text>
                        {isAnswered && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: isCurrentQuestion ? "#1677ff" : "#52c41a",
                            }}
                          />
                        )}
                      </div>
                    </Card>
                  )
                })}
              </Space>

              {/* Progress */}
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Text type="secondary" className="text-xs">
                  Progress: {progressPercentage}%
                </Text>
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 2,
                    marginTop: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercentage}%`,
                      height: "100%",
                      backgroundColor: "#1677ff",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Panel - Question Content */}
          <Col xs={24} sm={16} md={18}>
            {currentQuestion && (
              <Card
                title={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
                extra={
                  <span
                    style={{
                      color: getDifficultyColor(currentQuestion.difficultyLevel),
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {currentQuestion.difficultyLevel}
                  </span>
                }
              >
                {/* Question Text */}
                <div style={{ marginBottom: 32 }}>
                  <Title level={4} className="text-lg mb-4">
                    {currentQuestion.questionText}
                  </Title>
                </div>

                {/* Options */}
                <div
                  style={{
                    marginBottom: 32,
                  }}
                >
                  <Radio.Group
                    value={currentAnswer}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    style={{ display: "flex", flexDirection: "column", gap: 12 }}
                  >
                    {currentQuestion.options.map((option, idx) => (
                      <Card
                        key={idx}
                        hoverable
                        style={{
                          border: currentAnswer === optionLabels[idx] ? "2px solid #1677ff" : "1px solid #d9d9d9",
                          backgroundColor: currentAnswer === optionLabels[idx] ? "#e6f7ff" : "transparent",
                          cursor: "pointer",
                          padding: 12,
                        }}
                      >
                        <Radio value={optionLabels[idx]}>
                          <span className="ml-2">
                            <strong>{optionLetters[idx]}.</strong> {option.text}
                          </span>
                        </Radio>
                      </Card>
                    ))}
                  </Radio.Group>
                </div>

                {/* Navigation Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "space-between",
                    marginTop: 24,
                  }}
                >
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    size="large"
                  >
                    Previous
                  </Button>

                  <Space>
                    {onCancel && (
                      <Button size="large" onClick={onCancel}>
                        Cancel
                      </Button>
                    )}
                    {currentQuestionIndex === questions.length - 1 ? (
                      <Button type="primary" size="large" onClick={handleSubmit} loading={submitting || isLoading}>
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button type="primary" icon={<ArrowRightOutlined />} onClick={handleNext} size="large">
                        Next
                      </Button>
                    )}
                  </Space>
                </div>

                {/* Answer Summary */}
                <div
                  style={{
                    marginTop: 24,
                    padding: 12,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 4,
                  }}
                >
                  <Text type="secondary" className="text-xs">
                    Answered: {Object.keys(answers).length} of {questions.length} questions
                  </Text>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  )
}
