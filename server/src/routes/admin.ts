import { Router } from 'express'
import { exportSubmissions, getSubmissions } from '../controllers/adminController'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

router.get('/export', authenticateToken, requireAdmin, exportSubmissions)
router.get('/submissions', authenticateToken, requireAdmin, getSubmissions)

export default router