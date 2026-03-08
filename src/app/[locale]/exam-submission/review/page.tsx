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
import { Status } from "@/enums"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/ui/PageHeader"

import { useExamSubmissions } from "@/hooks/useExamSubmissions"
import { useLocalization } from "@/hooks/useLocalization"

import { getErrorMessage } from "@/types/errors"
import { IExamSubmissionReviewItem } from "@/types/examSubmission"




const { Title, Text } = Typography
const { TextArea } = Input

type ReviewState = {
  [questionId: number]: {
    pointsObtained?: number
    feedback?: string
  }
}



const ExamSubmissionReviewPage = () => {
  const { loadExamSubmission, selectedExamSubmission, reviewExamSubmission, actionStatus } = useExamSubmissions()

  const searchParams = useSearchParams()
  const submissionId = searchParams.get("submissionId")

  const [reviews, setReviews] = useState<ReviewState>({})
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const { t } = useLocalization()
  const entityName = t(LOCALE_KEYS.EXAM_SUBMISSION);

  useEffect(() => {
    if (submissionId) {
      loadExamSubmission(Number(submissionId))
    }
  }, [loadExamSubmission, submissionId])


  const handleSubmitReview = async () => {
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
      router.back();
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

            <Card style={{ display: "flex", justifyContent: "space-between" }}>
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
                height: "65vh",
                overflowY: "auto",
                paddingRight: 8,
                margin: "0 24px"
              }}
            >
              {
                selectedExamSubmission?.answers?.map((answer: any, index: number) => {
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

                        {
                          answer.answerText !== null ? (
                            <>
                              {/* Student Answer */}
                              <Card type="inner" title="Student Answer">
                                {/* <Text>{answer.answerText}</Text> */}
                                <div dangerouslySetInnerHTML={{ __html: answer.answerText || "" }} />
                              </Card>
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

                            </>)
                            : <Card type="inner" title="Student Answer">
                              <Text>
                                <strong>Selected Option:</strong>{" "}
                                {answer.selectedOption ?? "-"}
                              </Text>
                            </Card>
                        }
                      </Space>
                    </Card>
                  )
                }
                )}
            </div>


            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                padding: "12px 64px",
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
