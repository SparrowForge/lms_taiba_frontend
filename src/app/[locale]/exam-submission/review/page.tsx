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
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/ui/PageHeader"

import { useExamSubmissions } from "@/hooks/useExamSubmissions"
import { useLocalization } from "@/hooks/useLocalization"

import { getErrorMessage } from "@/types/errors"
import { IExamSubmissionReviewItem } from "@/types/examSubmission"
import { Status } from "@/enums"




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
  const { loadExamSubmission, selectedExamSubmission, reviewExamSubmission, actionStatus } = useExamSubmissions()

  const searchParams = useSearchParams()
  const submissionId = searchParams.get("submissionId")

  const [reviews, setReviews] = useState<ReviewState>({})
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const  {t}  = useLocalization()
  const entityName = t(LOCALE_KEYS.EXAM_SUBMISSION);

  useEffect(() => {
    if (submissionId) {
      loadExamSubmission(Number(submissionId))
    }
  }, [loadExamSubmission, submissionId])

  const answersNeedingReview = useMemo(() => {
    return (
      selectedExamSubmission?.answers?.filter(
        (ans: any) => ans.answerText !== null
      ) || []
    )
  }, [selectedExamSubmission])

  const handleSubmitReview = async() => {
    const payload = {
      reviews: Object.entries(reviews).map(([questionId, value]) => ({
        questionId: Number(questionId),
        pointsObtained: value.pointsObtained ?? 0,
        feedback: value.feedback ?? "",
      })),
    }

    try {
      await reviewExamSubmission(Number(submissionId), payload as { reviews: IExamSubmissionReviewItem[] });
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
      router.push('/exam-submissions');
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to update ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }

    // console.log("SUBMIT REVIEW PAYLOAD:", payload)



    setSubmitted(true)
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
                  const review = reviews[answer.questionId] || {}

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
                        {submitted ? (
                          <Card type="inner" title="Review">
                            <Text>
                              <strong>Points:</strong>{" "}
                              {review.pointsObtained ?? 0}
                            </Text>
                            <br />
                            <Text>
                              <strong>Feedback:</strong>{" "}
                              {review.feedback || "-"}
                            </Text>
                          </Card>
                        ) : (
                          <Row gutter={16}>
                            <Col span={6}>
                              <InputNumber
                                min={0}
                                placeholder="Points"
                                style={{ width: "100%" }}
                                value={review.pointsObtained}
                                onChange={(value) =>
                                  setReviews((prev) => ({
                                    ...prev,
                                    [answer.questionId]: {
                                      ...prev[answer.questionId],
                                      pointsObtained:
                                        value === null ? undefined : value,
                                    },
                                  }))
                                }
                              />
                            </Col>

                            <Col span={18}>
                              <TextArea
                                rows={2}
                                placeholder="Feedback"
                                value={review.feedback}
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
                <Button type="primary" onClick={handleSubmitReview} loading={actionStatus.status === Status.LOADING}>
                  Submit Review
                </Button>
              </div>

          </>
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}

export default ExamSubmissionReviewPage
