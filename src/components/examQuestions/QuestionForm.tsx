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
  Spin,
  Typography,
} from "antd";

const { Option } = Select;
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { Status } from "@/enums";
import { EntityStatus } from "@/enums/status";
import { DIFFICULTY_LEVEL_OPTIONS } from "@/enums/difficulty-level.enum";
import { IQuestion } from "@/enums/question";

import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { useExamQuestions } from "@/hooks/useExamQuestions";
import { useSubjects } from "@/hooks/useSubjects";

import { IExamQuestionBulkCreate } from "@/types/examQuestion";
import { getErrorMessage } from "@/types/errors";

const { Text } = Typography;

interface QuestionFormProps {
  mode: "create" | "edit";
  initialQuestions?: IQuestion[];
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: (payload: IExamQuestionBulkCreate) => Promise<void>;
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
  const { user } = useAuth();
  const { selectedCourse, loadCourse } = useCourses();
  const { selectedSubject, loadSubject } = useSubjects();
  const { actionStatus } = useExamQuestions();

  const [questions, setQuestions] = useState<IQuestion[]>(initialQuestions);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [questionType, setQuestionType] = useState("mcq")

  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  // Load subject
  useEffect(() => {
    if (subjectId) loadSubject(Number(subjectId));
  }, [subjectId, loadSubject]);

  // Load course
  useEffect(() => {
    if (selectedSubject?.course.id) {
      loadCourse(Number(selectedSubject.course.id));
    }
  }, [selectedSubject?.course.id, loadCourse]);

  // Ensure at least 1 question exists
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
          courseId: Number(selectedCourse?.id),
          subjectId: Number(selectedSubject?.id),
        },
      ]);
      setSelectedQuestionIndex(0);
    }
  }, []);


  const handleTypeChange = (value: string) => {
    setQuestionType(value)
  }

  // VALIDATION
  const validationErrors = useMemo(() => {
    const errors: Record<number, string[]> = {};

    questions.forEach((q, idx) => {
      const err: string[] = [];
      if (!q.questionText) err.push("Question text is required");
      if ((q.options ?? []).some((opt) => !opt.text)) err.push("All options must have text");

      if (err.length) errors[idx] = err;
    });

    return errors;
  }, [questions]);

  const hasErrors = Object.keys(validationErrors).length > 0;

  const canMcqSubmit = useMemo(() => {
    return (
      questions.length > 0 &&
      !hasErrors &&
      questions.every(
        (q) =>
          q.questionText &&
          (q.options ?? []).every((o) => o.text)
      )
    );
  }, [questions, hasErrors]);

  const canWrittenSubmit = useMemo(() => {
    return (
      questions.length > 0 &&
      questions.every(
        (q) => q.questionText
      )
    );
  }, [questions]);

  // ADD QUESTION
  const addQuestion = () => {
    const newQ: IQuestion = {
      questionText: "",
      options: [
        { text: "", order: 0 },
        { text: "", order: 1 },
        { text: "", order: 2 },
        { text: "", order: 3 },
      ],
      correctOptionNumber: 1,
      difficultyLevel: "easy",
      courseId: Number(selectedCourse?.id),
      subjectId: Number(selectedSubject?.id),
    };

    setQuestions((prev) => [...prev, newQ]);
    setSelectedQuestionIndex(questions.length);
  };

  // REMOVE QUESTION
  const removeQuestion = () => {
    if (questions.length === 1) {
      message.warning("At least one question is required");
      return;
    }

    const updated = questions.filter((_, i) => i !== selectedQuestionIndex);
    setQuestions(updated);
    setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1));
  };

  // UPDATE FIELD
  const updateQuestionField = (field: keyof IQuestion, value: any) => {
    const updated = [...questions];
    updated[selectedQuestionIndex] = {
      ...updated[selectedQuestionIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  // UPDATE OPTION TEXT
  const updateOptionText = (index: number, value: string) => {
    const updated = [...questions];
    const q = updated[selectedQuestionIndex];
    if (q?.options?.[index]) q.options[index].text = value;
    setQuestions(updated);
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      if (questionType === "mcq" && !canMcqSubmit) {
        toast.error("Please fix all errors before submitting");
        return;
      } else if (questionType === "written" && !canWrittenSubmit) {
        toast.error("Please fix all errors before submitting");
        return
      }


      setSubmitting(true);

      const formattedMcqQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: (q.options ?? []).map((o) => o.text),
        correctOptionNumber: Number(q.correctOptionNumber), 
        courseId: selectedCourse?.id ?? 0,
        subjectId: selectedSubject?.id ?? 0,
        facultyId: user?.faculty?.id ?? 0,          
        difficultyLevel: q.difficultyLevel,          
        status: EntityStatus.ACTIVE,
      }));


      const formattedWrittenQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: [] as string[],
        correctOptionNumber: '',
        courseId: selectedCourse?.id ?? 0,
        subjectId: selectedSubject?.id ?? 0,
        facultyId: user?.faculty?.id ?? 0, 
        difficultyLevel: q.difficultyLevel,   
        status: EntityStatus.ACTIVE,
      }));

      const finalPayload: IExamQuestionBulkCreate = {
        questions: questionType === "mcq" ? formattedMcqQuestions : formattedWrittenQuestions,
      };

      if (onSubmit) await onSubmit(finalPayload);

      toast.success(`${mode === "create" ? "Created" : "Updated"} ${questions.length} question(s)`);

      setQuestions([])
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const q = questions[selectedQuestionIndex];
  const errors = validationErrors[selectedQuestionIndex] || [];

  return (
    <div className="p-6 min-h-screen">
      <Row gutter={24}>
        {/* LEFT PANEL */}
        <Col span={8}>
          <Card size="small" title="Questions">
            <p className="font-medium text-md">Course: {selectedCourse?.name}</p>
            <p className="font-medium text-md">Subject: {selectedSubject?.name}</p>
            <p className="font-medium text-md">Faculty: {user?.faculty?.fullName}</p>
            <div style={{ paddingTop: 4, paddingBottom: 8 }}>
              <label className="font-medium text-md">Question Type</label>
              <Select
                placeholder="Select question type"
                className="w-full"
                onChange={handleTypeChange}
                allowClear
                defaultValue="mcq"
              >
                <Option value="mcq">MCQ</Option>
                <Option value="written">Written</Option>
              </Select>
            </div>
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
                {validationErrors[idx] && <Text type="danger"> • Error</Text>}
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

        {/* RIGHT PANEL */}
        <Col span={16}>
          {
            questionType === "mcq" ? <Card title={`Question ${selectedQuestionIndex + 1}`} size="small">

              <Form.Item
                label="Question Text"
                validateStatus={!q?.questionText && errors.length ? "error" : ""}
                help={!q?.questionText && errors.length ? "Question text is required" : ""}
              >
                <Input.TextArea
                  rows={3}
                  value={q?.questionText}
                  onChange={(e) => updateQuestionField("questionText", e.target.value)}
                />
              </Form.Item>


              <Text strong>Options</Text>
              <br />
              <br />

              {(q?.options ?? []).map((opt, idx) => {
                const labels = ["A", "B", "C", "D"];
                const key = ["a", "b", "c", "d"][idx] as "a" | "b" | "c" | "d";
                const isCorrect = q.correctOptionNumber === key;

                return (
                  <Form.Item
                    key={idx}
                    label={`Option ${labels[idx]}`}
                    required
                    validateStatus={!opt.text && errors.length ? "error" : ""}
                    help={
                      !opt.text
                        ? "Option text required"
                        : isCorrect
                          ? "✓ Correct Answer"
                          : ""
                    }
                  >
                    <Input
                      value={opt.text}
                      onChange={(e) => updateOptionText(idx, e.target.value)}
                    />
                  </Form.Item>
                );
              })}

              {/* Correct + Difficulty */}
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Correct Option">
                    <Select
                      value={q?.correctOptionNumber}
                      onChange={(val) => updateQuestionField("correctOptionNumber", val)}
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
                      onChange={(val) => updateQuestionField("difficultyLevel", val)}
                      options={DIFFICULTY_LEVEL_OPTIONS}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting || actionStatus.status === Status.LOADING}
                // disabled={!canMcqSubmit}
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: 18,
                }}
              >
                {actionStatus.status === Status.LOADING ? <Spin /> : `Submit Questions (${questions.length})`}
              </Button>

              {onCancel && (
                <Button
                  style={{ width: "100%", marginTop: 8, height: 40 }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </Card> :
              <Card title={`Question ${selectedQuestionIndex + 1}`} size="small">
                {/* Question Text */}
                <Form.Item
                  label="Question Text"
                  validateStatus={!q?.questionText && errors.length ? "error" : ""}
                  help={!q?.questionText && errors.length ? "Question text is required" : ""}
                >
                  <Input.TextArea
                    rows={3}
                    value={q?.questionText}
                    onChange={(e) => updateQuestionField("questionText", e.target.value)}
                  />
                </Form.Item>

                {/* Correct + Difficulty */}
                <Row gutter={12}>
                  <Col span={12}>

                  </Col>

                  <Col span={12}>
                    <Form.Item label="Difficulty Level">
                      <Select
                        value={q?.difficultyLevel}
                        onChange={(val) => updateQuestionField("difficultyLevel", val)}
                        options={DIFFICULTY_LEVEL_OPTIONS}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitting || actionStatus.status === Status.LOADING}
                  // disabled={!canWrittenSubmit}
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: 18,
                  }}
                >
                  {actionStatus.status === Status.LOADING ? <Spin /> : `Submit Questions (${questions.length})`}
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
          }


        </Col>
      </Row>
    </div>
  );
};

export default QuestionForm;
