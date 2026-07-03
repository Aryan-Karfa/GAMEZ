import { Router } from 'express';
import authRoutes from './authRoutes.js';
import gameRoutes from './gameRoutes.js';
import libraryRoutes from './libraryRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import preferencesRoutes from './preferencesRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/library', libraryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/preferences', preferencesRoutes);

export default router;
