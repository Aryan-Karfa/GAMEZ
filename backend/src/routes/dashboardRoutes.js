import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, dashboardController.getDashboardSummary);
router.get('/continue-playing', authMiddleware, dashboardController.getContinuePlaying);

export default router;
