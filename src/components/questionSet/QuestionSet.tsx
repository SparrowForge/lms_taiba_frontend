import React, { useState } from 'react'

import QuestionSetForm from './QuestionSetForm'
import QuestionsTable from './QuestionsTable'

export interface FormState {
  name: string;
  descriptionText: string;
  status: string;
}


const mockQuestions = [
  {
    id: 1,
    examId: 1,
    questionOrder: 1,
    questionText: "What is 2 + 2?",
    correctOptionNumber: 2,
    options: ["3", "4", "5", "6"],
    status: "active",
    createdAt: "2025-11-10T07:00:37.641Z",
    updatedAt: "2025-11-10T07:00:37.641Z",
    deletedAt: null,
  },
  {
    id: 2,
    examId: 1,
    questionOrder: 2,
    questionText: "What is the capital of France?",
    correctOptionNumber: 1,
    options: ["Paris", "London", "Berlin", "Madrid"],
    status: "active",
    createdAt: "2025-11-10T07:00:37.641Z",
    updatedAt: "2025-11-10T07:00:37.641Z",
    deletedAt: null,
  },
  {
    id: 3,
    examId: 1,
    questionOrder: 3,
    questionText: "Which planet is known as the Red Planet?",
    correctOptionNumber: 3,
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    status: "inactive",
    createdAt: "2025-11-10T07:00:37.641Z",
    updatedAt: "2025-11-10T07:00:37.641Z",
    deletedAt: null,
  },
]

const QuestionSet = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number[]>([])

  const [questionSetformData, setQuestionSetFormData] = useState<FormState>({
    name: "",
    descriptionText: "",
    status: "active",
  });
  const handleChange = (key: keyof FormState, value: string) => {
    setQuestionSetFormData(prev => ({ ...prev, [key]: value }));
  };




  return (
    <div>
      <QuestionSetForm formData={questionSetformData} setFormData={setQuestionSetFormData} changeHandler={handleChange} />
      <QuestionsTable
        questions={mockQuestions}
        selectedQuestions={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        
      />
    </div>
  )
}

export default QuestionSet
