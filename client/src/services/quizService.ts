import axios from 'axios'
import { Question, Answer, Submission, QuizResult } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const quizService = {
  async getQuestions(): Promise<Question[]> {
    const response = await api.get('/api/quiz')
    return response.data
  },

  async submitAnswers(answers: Answer[]): Promise<void> {
    await api.post('/api/quiz/answers', { answers })
  },

  async submitQuiz(answers: Answer[]): Promise<QuizResult> {
    const response = await api.post('/api/quiz/submit', { answers })
    return response.data
  },

  async getSubmission(submissionId: string): Promise<QuizResult> {
    const response = await api.get(`/api/quiz/submission/${submissionId}`)
    return response.data
  },

  async exportSubmissions(): Promise<Blob> {
    const response = await api.get('/api/admin/export', {
      responseType: 'blob',
    })
    return response.data
  },
}