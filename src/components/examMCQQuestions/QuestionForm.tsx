"use client";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useLocalization } from "@/hooks/useLocalization";
import { getErrorMessage } from "@/types/errors";
import {
  IQuestion,
  IQuestionOption,
  IQuestionsPayload,
} from "@/enums/question";
import { useSubjects } from "@/hooks/useSubjects";
import { useCourses } from "@/hooks/useCourses";
import { IExamMCQMultipleQuestion } from "@/types/examMCQQuestion";
import { useAuth } from "@/hooks/useAuth";

const { Text } = Typography;

interface QuestionFormProps {

  mode: "create" | "edit";
  initialQuestions?: IQuestion[];
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: (payload: IQuestionsPayload) => Promise<void>;
  isLoading?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  mode,
  initialQuestions = [],
  onSuccess,
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  const {user} = useAuth()
  const { t } = useLocalization();
  const router = useRouter();
  const {selectedCourse, loadCourse} = useCourses()
  const {selectedSubject, loadSubject} = useSubjects()
  const [questions, setQuestions] = useState<IQuestion[]>(initialQuestions);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams()
  const subjectId = searchParams.get("subjectId")

  useEffect(()=>{
    if(subjectId){
      loadSubject(Number(subjectId))
    }
  },[loadSubject, subjectId])

  useEffect(()=>{
    if(selectedSubject?.course.id){
      loadCourse(Number(selectedSubject?.course.id))
    }
  },[loadCourse, selectedSubject?.course.id])



  

  // ------------------------------------------
  // Initialize at least 1 question (IMPORTANT)
  // ------------------------------------------
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions([
        {
          questionText: "",
          options: [
            { text: "", order: 0 },
            { text: "", order: 1 },
            { text: "", order: 2 },
            { text: "", order: 3 },
          ],
          correctOptionNumber: "a",
          difficultyLevel: "easy",
          courseId:selectedCourse?.id,
          subjectId:selectedSubject?.id,
          facultyId:user?.faculty.id
        },
      ]);
      setSelectedQuestionIndex(0);
    }
  }, []);

  // ------------------------------------------
  // Memoized validation
  // ------------------------------------------
  const validationErrors = useMemo(() => {
    const errors: { [key: number]: string[] } = {};

    questions.forEach((q, idx) => {
      const e: string[] = [];

      if (!q?.questionText.trim()) e.push("Question text is required");
      if (q?.options.some((o) => !o.text.trim()))
        e.push("All options must have text");

      if (e.length > 0) errors[idx] = e;
    });

    return errors;
  }, [questions]);

  const hasErrors = useMemo(
    () => Object.keys(validationErrors).length > 0,
    [validationErrors]
  );

  const canSubmit = useMemo(() => {
    return (
      questions.length > 0 &&
      !hasErrors &&
      questions.every(
        (q) =>
          q?.questionText.trim() &&
          q?.options.every((opt) => opt.text.trim())
      )
    );
  }, [questions, hasErrors]);

  // ------------------------------------------
  // Add Question
  // ------------------------------------------
  const addQuestion = () => {
    const newQ: IQuestion = {
      questionText: "",
      options: [
        { text: "", order: 0 },
        { text: "", order: 1 },
        { text: "", order: 2 },
        { text: "", order: 3 },
      ],
      correctOptionNumber: "a",
      difficultyLevel: "easy",
      courseId:selectedCourse?.id,
      subjectId:selectedSubject?.id,
    };

    setQuestions((prev) => [...prev, newQ]);
    setSelectedQuestionIndex(questions.length); // move to new question
  };

  // ------------------------------------------
  // Remove Question
  // ------------------------------------------
  const removeQuestion = () => {
    if (questions.length === 1) {
      message.warning("At least one question is required");
      return;
    }

    const updated = questions.filter(
      (_, idx) => idx !== selectedQuestionIndex
    );
    setQuestions(updated);
    setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1));
  };

  // ------------------------------------------
  // Update Question Fields
  // ------------------------------------------
  const updateQuestionField = (field: keyof IQuestion, value: any) => {
    const updated = [...questions];
    updated[selectedQuestionIndex] = {
      ...updated[selectedQuestionIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const updateOptionText = (optIndex: number, text: string) => {
    const updated = [...questions];
    updated[selectedQuestionIndex]?.options[optIndex].text = text;
    setQuestions(updated);
  };

  // ------------------------------------------
  // Submit Handler
  // ------------------------------------------
const handleSubmit = async () => {
  try {
    if (!canSubmit) {
      message.error("Please fix all errors before submitting");
      return;
    }

    setSubmitting(true);

    // Submit ARRAY ONLY (not wrapped)
    const finalPayload: IExamMCQMultipleQuestion[] = questions.map((q) => ({
      ...q,
      courseId: selectedCourse?.id,
      subjectId: selectedSubject?.id,
      facultyId: user?.faculty.id
    }));

    if (onSubmit) await onSubmit(finalPayload);

    toast.success(
      `${mode === "create" ? "Created" : "Updated"} ${
        questions.length
      } question(s) successfully`
    );

    if (onSuccess) onSuccess();
  } catch (err) {
    toast.error(getErrorMessage(err));
  } finally {
    setSubmitting(false);
  }
};


  // ------------------------------------------
  // Render
  // ------------------------------------------
  const q = questions[selectedQuestionIndex];
  const errors = validationErrors[selectedQuestionIndex] || [];

  return (
    <div className="p-6 min-h-screen">
      <Row gutter={24}>
        {/* Left Side Panel */}
        <Col span={8}>
          <Card size="small" title="Questions">
            <p className="font-medium text-md">Course: {selectedCourse?.name}</p>
            <p className="font-medium text-md">Subject: {selectedSubject?.name}</p>
            <p className="font-medium text-md">Faculty: {user?.faculty?.fullName}</p>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{ width: "100%", marginBottom: 12 }}
              onClick={addQuestion}
            >
              Add Question
            </Button>

            {questions.map((_, idx) => (
              <Card
                key={idx}
                size="small"
                style={{
                  marginBottom: 8,
                  cursor: "pointer",
                  border:
                    idx === selectedQuestionIndex
                      ? "2px solid #1677ff"
                      : "1px solid #d9d9d9",
                }}
                onClick={() => setSelectedQuestionIndex(idx)}
              >
                <Text strong>Question {idx + 1}</Text>
                {validationErrors[idx] && (
                  <Text type="danger"> • Error</Text>
                )}
              </Card>
            ))}

            <Button
              danger
              style={{ width: "100%", marginTop: 12 }}
              icon={<DeleteOutlined />}
              onClick={removeQuestion}
            >
              Remove Selected
            </Button>
          </Card>
        </Col>

        {/* Right Side Editor */}
        <Col span={16}>
          <Card title={`Question ${selectedQuestionIndex + 1}`} size="small">
            {/* Question Text */}
            <Form.Item
              label="Question Text"
              validateStatus={
                !q?.questionText.trim() && errors.length ? "error" : ""
              }
              help={
                !q?.questionText.trim() && errors.length
                  ? "Question text is required"
                  : ""
              }
            >
              <Input.TextArea
                rows={3}
                value={q?.questionText}
                onChange={(e) =>
                  updateQuestionField("questionText", e.target.value)
                }
              />
            </Form.Item>

            {/* Options */}
            <Text strong>Options</Text>
            <br />
            <br />

            {q?.options.map((opt, idx) => {
              const labels = ["A", "B", "C", "D"];
              const key = ["a", "b", "c", "d"][idx] as
                | "a"
                | "b"
                | "c"
                | "d";

              const isCorrect = q?.correctOptionNumber === key;

              return (
                <Form.Item
                  key={idx}
                  label={`Option ${labels[idx]}`}
                  required
                  validateStatus={
                    !opt.text.trim() && errors.length ? "error" : ""
                  }
                  help={
                    !opt.text.trim() && errors.length
                      ? "Option text required"
                      : isCorrect
                      ? "✓ Correct Answer"
                      : ""
                  }
                >
                  <Input
                    value={opt.text}
                    onChange={(e) =>
                      updateOptionText(idx, e.target.value)
                    }
                  />
                </Form.Item>
              );
            })}

            {/* Correct Answer + Difficulty */}
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Correct Option">
                  <Select
                    value={q?.correctOptionNumber}
                    onChange={(val) =>
                      updateQuestionField("correctOptionNumber", val)
                    }
                    options={[
                      { label: "Option A", value: "a" },
                      { label: "Option B", value: "b" },
                      { label: "Option C", value: "c" },
                      { label: "Option D", value: "d" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Difficulty Level">
                  <Select
                    value={q?.difficultyLevel}
                    onChange={(val) =>
                      updateQuestionField("difficultyLevel", val)
                    }
                    options={[
                      { label: "🟢 Easy", value: "easy" },
                      { label: "🟡 Medium", value: "medium" },
                      { label: "🔴 Hard", value: "hard" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit */}
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitting || isLoading}
              disabled={!canSubmit}
              style={{
                width: "100%",
                height: 40,
                marginTop: 18,
              }}
            >
              Submit Questions ({questions.length})
            </Button>

            {onCancel && (
              <Button
                style={{ width: "100%", marginTop: 8, height: 40 }}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionForm;
