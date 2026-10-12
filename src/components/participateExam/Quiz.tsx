"use client"

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import {
  Button,
  Card,
  Col,
  Radio,
  Row,
  Typography,
  Form,
  Empty,
} from "antd"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useAuth } from "@/hooks/useAuth"
import { useExams } from "@/hooks/useExams"
import { useQuestionSets } from "@/hooks/useQuestionSets"

import LexicalEditor from "../ui/LexicalEditor"


interface QuizParticipantProps {
  onSubmit?: (payload: any) => Promise<void>
  title?: string
}

const { Title, Text } = Typography

export default function Quiz({
  onSubmit,
  title = "Quiz",
}: QuizParticipantProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const [remainingTime, setRemainingTime] = useState(0)
  const [isExamActive, setIsExamActive] = useState(false)
  const autoSubmittedRef = useRef(false)

  const [form] = Form.useForm()

  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")

  const { selectedExam, loadExam } = useExams()
  const { selectedQuestionSet, loadQuestionSet } = useQuestionSets()


  useEffect(() => {
    if (examId) loadExam(Number(examId))
  }, [examId, loadExam])


  useEffect(() => {
    if (selectedExam?.selectedQuestionSetId) {
      loadQuestionSet(Number(selectedExam.selectedQuestionSetId))
    }
  }, [selectedExam?.selectedQuestionSetId, loadQuestionSet])


  useEffect(() => {
    if (!selectedExam?.examDatetime || !selectedExam?.duration?.minutes) return

    const examStart = new Date(selectedExam.examDatetime).getTime()
    const durationMs = selectedExam.duration.minutes * 60 * 1000
    const examEnd = examStart + durationMs

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


  const currentItem = selectedQuestionSet?.items?.[currentQuestionIndex]
  const currentQuestion = currentItem?.question

  const isDescriptiveQuestion =
    !currentQuestion?.options || currentQuestion.options.length === 0

  const optionLabels = ["a", "b", "c", "d"]
  const optionLetters = ["A", "B", "C", "D"]

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`
  }


  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestionSet?.items.length - 1) {
      setCurrentQuestionIndex((p) => p + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((p) => p - 1)
    }
  }


  const handleSubmit = async () => {
    if (submitting) return

    const formValues = form.getFieldsValue(true)

    const payload = {
      examId: selectedExam?.id,
      studentId: user?.student?.id,
      courseId: selectedQuestionSet?.courseId,
      subjectId: selectedQuestionSet?.subjectId,
      answers: selectedQuestionSet?.items.map((item, index) => ({
        questionId: item.questionId,
        selectedOption: item.question.options?.length
          ? optionLabels.indexOf(answers[index]) + 1 || null
          : null,
        answerText: item.question.options?.length
          ? null
          : formValues[`answer_${index}`] ?? "",
      })),
      status: "submitted",
    }

    try {
      setSubmitting(true)
      await onSubmit?.(payload)
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentQuestion) return null

  if (!isExamActive) {
    <Empty description="No Content" />
  }


  return (
    <Form form={form} layout="vertical">
      <div className="min-h-screen p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[24, 16]}>
            {/* Left Sidebar */}
            <Col xs={24} sm={8} md={6}>
              <Card title={title} size="small" className="sm:sticky sm:top-6">
                {/* Wrapping row of question chips on phones, vertical list from sm up */}
                <div className="flex flex-row flex-wrap gap-2 sm:flex-col">
                  {selectedQuestionSet?.items?.map((_, idx) => (
                    <Card
                      key={idx}
                      size="small"
                      hoverable
                      onClick={() => setCurrentQuestionIndex(idx)}
                    >
                      <Text strong>Q{idx + 1}</Text>
                    </Card>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Right Panel */}
            <Col xs={24} sm={16} md={18}>
              <Card
                title={`Question ${currentQuestionIndex + 1} of ${selectedQuestionSet?.items.length}`}
                extra={<Text strong>⏱ {formatTime(remainingTime)}</Text>}
              >
                <Title level={4}>{currentQuestion.questionText}</Title>

                {isDescriptiveQuestion ? (
                  <Form.Item
                    name={`answer_${currentQuestionIndex}`}
                    rules={[{ required: true, message: "Answer is required" }]}
                  >
                    <LexicalEditor />
                  </Form.Item>
                ) : (
                  <Radio.Group
                    // disabled={!isExamActive}
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
                )}

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
                      // disabled={!isExamActive}
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
    </Form>
  )
}
