import { Router } from 'express'
import {
  getQuestions,
  submitAnswers,
  submitQuiz,
  getSubmission,
} from '../controllers/quizController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.get('/', authenticateToken, getQuestions)
router.post('/answers', authenticateToken, submitAnswers)
router.post('/submit', authenticateToken, submitQuiz)
router.get('/submission/:id', authenticateToken, getSubmission)

export default router