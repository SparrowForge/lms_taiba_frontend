"use client"

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { Button, Card, Col, Radio, Row, Space, Typography } from "antd"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useExams } from "@/hooks/useExams"
import { useQuestionSets } from "@/hooks/useQuestionSets"

interface QuizParticipantProps {
  onSubmit?: (payload: any) => Promise<void>
  onCancel?: () => void
  title?: string
}

const { Title, Text } = Typography

export default function Quiz({
  onSubmit,
  onCancel,
  title = "Quiz",
}: QuizParticipantProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const [remainingTime, setRemainingTime] = useState(0)
  const [isExamActive, setIsExamActive] = useState(false)

  const autoSubmittedRef = useRef(false)

  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")

  const { selectedExam, loadExam } = useExams()
  const { selectedQuestionSet, loadQuestionSet } = useQuestionSets()

  /* ---------------- Load exam ---------------- */
  useEffect(() => {
    if (examId) {
      loadExam(Number(examId))
    }
  }, [examId, loadExam])

  /* ---------------- Load question set ---------------- */
  useEffect(() => {
    if (selectedExam?.selectedQuestionSetId) {
      loadQuestionSet(Number(selectedExam.selectedQuestionSetId))
    }
  }, [selectedExam?.selectedQuestionSetId, loadQuestionSet])

  /* ---------------- Exam timer ---------------- */
  useEffect(() => {
    if (!selectedExam?.examDatetime || !selectedExam?.duration) return

    const examStart = new Date(selectedExam.examDatetime).getTime()
    const durationHours =
      selectedExam.duration?.hours ?? selectedExam.duration ?? 0
    const examEnd = examStart + durationHours * 60 * 60 * 1000

    const interval = setInterval(() => {
      const now = Date.now()

      if (now < examStart) {
        setIsExamActive(false)
        setRemainingTime(examEnd - examStart)
        return
      }

      if (now >= examEnd) {
        setIsExamActive(false)
        setRemainingTime(0)

        if (!autoSubmittedRef.current) {
          autoSubmittedRef.current = true
          handleSubmit()
        }

        clearInterval(interval)
        return
      }

      setIsExamActive(true)
      setRemainingTime(examEnd - now)
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedExam])

  /* ---------------- Helpers ---------------- */
  const currentItem = selectedQuestionSet?.items?.[currentQuestionIndex]
  const currentQuestion = currentItem?.question

  const optionLabels = ["a", "b", "c", "d"]
  const optionLetters = ["A", "B", "C", "D"]

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

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

  /* ---------------- Handlers ---------------- */
  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }))
  }

  const handleNext = () => {
    if (
      currentQuestionIndex <
      selectedQuestionSet.items.length - 1
    ) {
      setCurrentQuestionIndex((p) => p + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((p) => p - 1)
    }
  }

  /* ---------------- Build submit payload ---------------- */
  const buildSubmitPayload = () => {
    if (!selectedExam || !selectedQuestionSet) return null

    return {
      examId: selectedExam.id,
      questionSetId: selectedQuestionSet.id,
      courseId: selectedQuestionSet.courseId,
      subjectId: selectedQuestionSet.subjectId,
      semesterId: selectedQuestionSet.semesterId,
      batchId: selectedQuestionSet.batchId,
      startedAt: selectedExam.examDatetime,
      submittedAt: new Date().toISOString(),
      durationInSeconds:
        (selectedExam.duration?.hours ?? 0) * 60 * 60,
      answers: Object.entries(answers).map(
        ([index, selectedOption]) => {
          const item =
            selectedQuestionSet.items[Number(index)]

          return {
            questionId: item.questionId,
            selectedOption,
          }
        }
      ),
    }
  }

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (submitting) return

    const payload = buildSubmitPayload()
    if (!payload) return

    try {
      setSubmitting(true)
      await onSubmit?.(payload)
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentQuestion) return null

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Row gutter={24}>
          {/* Left Sidebar */}
          <Col xs={24} sm={8} md={6}>
            <Card
              title={title}
              size="small"
              className="sticky top-6"
              style={{ maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                {selectedQuestionSet?.items?.map((_, idx) => {
                  const isAnswered = idx in answers
                  const isCurrent = idx === currentQuestionIndex

                  return (
                    <Card
                      key={idx}
                      size="small"
                      hoverable
                      onClick={() => setCurrentQuestionIndex(idx)}
                      style={{
                        border: isCurrent
                          ? "2px solid #1677ff"
                          : "1px solid #d9d9d9",
                        backgroundColor: isCurrent
                          ? "#e6f7ff"
                          : isAnswered
                          ? "#f6ffed"
                          : "transparent",
                      }}
                    >
                      <Text strong>Q{idx + 1}</Text>
                    </Card>
                  )
                })}
              </Space>
            </Card>
          </Col>

          {/* Right Panel */}
          <Col xs={24} sm={16} md={18}>
            <Card
              title={`Question ${currentQuestionIndex + 1} of ${selectedQuestionSet?.items.length}`}
              extra={
                <Space>
                  <Text strong type={remainingTime < 300000 ? "danger" : undefined}>
                    ⏱ {formatTime(remainingTime)}
                  </Text>
                  <Text
                    style={{
                      color: getDifficultyColor(
                        currentQuestion.difficultyLevel
                      ),
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {currentQuestion.difficultyLevel}
                  </Text>
                </Space>
              }
            >
              <Title level={4}>{currentQuestion.questionText}</Title>

              <Radio.Group
                disabled={!isExamActive}
                value={answers[currentQuestionIndex]}
                onChange={(e) => handleOptionChange(e.target.value)}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {currentQuestion.options.map((opt, idx) => (
                  <Card key={idx} hoverable>
                    <Radio value={optionLabels[idx]}>
                      <strong>{optionLetters[idx]}.</strong> {opt}
                    </Radio>
                  </Card>
                ))}
              </Radio.Group>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 24,
                }}
              >
                <Button
                  icon={<ArrowLeftOutlined />}
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePrev}
                >
                  Previous
                </Button>

                {currentQuestionIndex ===
                selectedQuestionSet?.items.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={!isExamActive}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
