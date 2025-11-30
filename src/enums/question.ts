// Question and Answer types for quiz management
export interface IQuestion {
  id?: number
  questionText: string
  options: IQuestionOption[]
  correctOptionNumber: "a" | "b" | "c" | "d" // a=0, b=1, c=2, d=3
  difficultyLevel: "easy" | "medium" | "hard"
  courseId: number
  subjectId: number
}

export interface IQuestionOption {
  text: string
  order: number // 0=a, 1=b, 2=c, 3=d
}

export interface IQuestionsPayload {
  courseId: number
  subjectId: number
  questions: IQuestion[]
}

export interface IQuestionsUpdate {
  courseId: number
  subjectId: number
  questions: IQuestion[]
}
