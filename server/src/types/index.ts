export interface User {
  id: string
  fullName: string
  registrationNumber: string
  department: string
  email: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  title: string
  description: string
  brokenCode: string
  expectedAnswer: string
  timeLimit: number
  createdAt: Date
  updatedAt: Date
}

export interface Answer {
  id: string
  answer: string
  score: number | null
  isCorrect: boolean | null
  questionId: string
  submissionId: string
}

export interface Submission {
  id: string
  userId: string
  totalScore: number | null
  submittedAt: Date
  user: User
  answers: Answer[]
}

export interface CreateUserData {
  fullName: string
  registrationNumber: string
  department: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AnswerData {
  questionId: string
  answer: string
}

export interface SubmitAnswersData {
  answers: AnswerData[]
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

export interface ExportData {
  id: string
  fullName: string
  registrationNumber: string
  department: string
  email: string
  questionId: string
  questionTitle: string
  response: string
  score: number | null
  totalScore: number | null
  submittedAt: Date
}