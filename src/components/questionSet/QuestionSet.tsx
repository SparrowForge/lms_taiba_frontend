import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

import { useExams } from '@/hooks/useExams';
import { useMcqQuestions } from '@/hooks/useMcqQuestions';
import { useQuestionSets } from '@/hooks/useQuestionSets';

import QuestionSetForm from './QuestionSetForm'
import QuestionsTable from './QuestionsTable'


export interface FormState {
  name: string;
  description: string;
  status: string;
}

const QuestionSet = () => {
  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")
  const { loadExam, selectedExam } = useExams()
  const [selectedQuestion, setSelectedQuestion] = useState<number[]>([])
  const { mcqQuestions, loadMcqQuestions } = useMcqQuestions()
  const {createQuestionSetWithQuestions, actionStatus} = useQuestionSets()
  const router = useRouter()

  const [questionSetformData, setQuestionSetFormData] = useState<FormState>({
    name: "",
    description: "",
    status: "active",
  });
  const handleChange = (key: keyof FormState, value: string) => {
    setQuestionSetFormData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (examId) {
      loadExam(Number(examId))
    }
  }, [loadExam, examId])

  useEffect(() => {
    loadMcqQuestions()
  }, [loadMcqQuestions])

  const handleQuestionsetSubmit = async() => {
    const questionSet = {
      ...questionSetformData,
      courseId: selectedExam?.courseId,
      subjectId: selectedExam?.subjectId,
      examId:Number(examId),
      semesterId: selectedExam?.semesterId,
      batchId: selectedExam?.batchId,
    }
    const data = {
      questionSet,
      questionIds: selectedQuestion
    }

    await createQuestionSetWithQuestions(data)
    toast.success(actionStatus.message)
    router.push(`/dashboard/course`)
  }



  return (
    <div>
      <QuestionSetForm formData={questionSetformData} setFormData={setQuestionSetFormData} changeHandler={handleChange} />
      <QuestionsTable
        questions={mcqQuestions}
        selectedQuestions={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        onSubmit={handleQuestionsetSubmit}
      />
    </div>
  )
}

export default QuestionSet
