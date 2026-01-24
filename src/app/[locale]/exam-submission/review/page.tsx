"use client"

import {
  Button,
  Card,
  Divider,
  Empty,
  Input,
  InputNumber,
  Row,
  Col,
  Space,
  Typography,
} from "antd"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/ui/PageHeader"
import { useExamSubmissions } from "@/hooks/useExamSubmissions"

const { Title, Text } = Typography
const { TextArea } = Input

type ReviewState = {
  [questionId: number]: {
    pointsObtained?: number
    feedback?: string
  }
}
// const mockExamSubmission = {
//   id: 1,
//   examId: 45,
//   studentId: 19,
//   status: "submitted",
//   answers: [
//     {
//       questionId: 101,
//       answerText: "Machine learning is a subset of AI that enables systems to learn from data.",
//       selectedOption: null,
//     },
//     {
//       questionId: 102,
//       answerText: "Supervised learning uses labeled data, while unsupervised learning does not.",
//       selectedOption: null,
//     },
//     {
//       questionId: 103,
//       answerText: null,
//       selectedOption: "B",
//     },
//     {
//       questionId: 104,
//       answerText:
//         "Overfitting occurs when a model learns noise instead of patterns, reducing generalization.",
//       selectedOption: null,
//     },
//   ],
//   exam: {
//     id: 45,
//     name: "Machine Learning – Quiz 1",
//     marks: 20,
//   },
//   student: {
//     id: 19,
//     firstName: "Ahnaf",
//     lastName: "Nabil",
//   },
// }


const ExamSubmissionReviewPage = () => {
  const { loadExamSubmission, selectedExamSubmission } = useExamSubmissions()
  const searchParams = useSearchParams()
  const submissionId = searchParams.get("submissionId")

  const [reviews, setReviews] = useState<ReviewState>({})

  useEffect(() => {
    if (submissionId) {
      loadExamSubmission(Number(submissionId))
    }
  }, [loadExamSubmission, submissionId])

  const answersNeedingReview = useMemo(() => {
    return selectedExamSubmission?.answers?.filter(
      (ans: any) => ans.answerText !== null
    ) || []
  }, [selectedExamSubmission])

  const handleSubmitReview = () => {
    const payload = {
      reviews: Object.entries(reviews).map(([questionId, value]) => ({
        questionId: Number(questionId),
        pointsObtained: value.pointsObtained ?? 0,
        feedback: value.feedback ?? "",
      })),
    }

    console.log("SUBMIT REVIEW PAYLOAD:", payload)

    // 👉 TODO: call submit review API
    // submitExamReview(payload)
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title="Exam Submission Review" />

        {!selectedExamSubmission ? (
          <Empty description="Loading submission..." />
        ) : (
          <>
            {/* 🔹 Exam & Student Info */}
            <Card>
              <Title level={4}>{selectedExamSubmission.exam.name}</Title>
              <Text>
                Student:{" "}
                <strong>
                  {selectedExamSubmission.student.firstName}{" "}
                  {selectedExamSubmission.student.lastName}
                </strong>
              </Text>
            </Card>

            <Divider />

            {/* 🔹 Scrollable Review Area */}
            <div
              style={{
                maxHeight: "65vh",
                overflowY: "auto",
                paddingRight: 8,
              }}
            >
              {answersNeedingReview.length === 0 ? (
                <Empty description="No descriptive answers to review" />
              ) : (
                answersNeedingReview.map((answer: any, index: number) => {
                  const review = reviews[answer.questionId]

                  return (
                    <Card
                      key={answer.questionId}
                      style={{ marginBottom: 16 }}
                      title={`Question ${index + 1}`}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Text type="secondary">
                          Question ID: {answer.questionId}
                        </Text>

                        {/* Student Answer */}
                        <Card type="inner" title="Student Answer">
                          <Text>{answer.answerText}</Text>
                        </Card>

                        {/* Review Section */}
                        {review?.pointsObtained !== undefined ? (
                          <Card type="inner" title="Review">
                            <Text>
                              <strong>Points:</strong>{" "}
                              {review.pointsObtained}
                            </Text>
                            <br />
                            <Text>
                              <strong>Feedback:</strong>{" "}
                              {review.feedback}
                            </Text>
                          </Card>
                        ) : (
                          <Row gutter={16}>
                            <Col span={6}>
                              <InputNumber
                                min={0}
                                placeholder="Points"
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                  setReviews((prev) => ({
                                    ...prev,
                                    [answer.questionId]: {
                                      ...prev[answer.questionId],
                                      pointsObtained: value ?? 0,
                                    },
                                  }))
                                }
                              />
                            </Col>

                            <Col span={18}>
                              <TextArea
                                rows={2}
                                placeholder="Feedback"
                                onChange={(e) =>
                                  setReviews((prev) => ({
                                    ...prev,
                                    [answer.questionId]: {
                                      ...prev[answer.questionId],
                                      feedback: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </Col>
                          </Row>
                        )}
                      </Space>
                    </Card>
                  )
                })
              )}
            </div>

            {/* 🔹 Sticky Submit Button */}
            {answersNeedingReview.length > 0 && (
              <div
                style={{
                  position: "sticky",
                  bottom: 0,
                  background: "#fff",
                  padding: "12px 0",
                  borderTop: "1px solid #f0f0f0",
                  textAlign: "right",
                }}
              >
                <Button type="primary" onClick={handleSubmitReview}>
                  Submit Review
                </Button>
              </div>
            )}
          </>
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}

export default ExamSubmissionReviewPage
