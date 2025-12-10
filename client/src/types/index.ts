export interface User {
  id: string
  fullName: string
  registrationNumber: string
  department: string
  email: string
  isAdmin?: boolean
}

export interface Question {
  id: string
  title: string
  description: string
  brokenCode: string
  expectedAnswer: string
  timeLimit: number
}

export interface Answer {
  questionId: string
  answer: string
}

export interface Submission {
  id: string
  userId: string
  answers: Answer[]
  totalScore: number | null
  submittedAt: string
  user: User
}

export interface QuizResult {
  submission: Submission
  questionResults: Array<{
    questionId: string
    answer: string
    score: number | null
    isCorrect: boolean | null
  }>
}