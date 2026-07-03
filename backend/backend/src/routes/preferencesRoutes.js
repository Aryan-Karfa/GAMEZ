import { Router } from 'express';
import * as preferencesController from '../controllers/preferencesController.js';
import { validateUpdatePreferences } from '../validators/preferencesValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, preferencesController.getPreferences);
router.patch('/', authMiddleware, validateUpdatePreferences, preferencesController.updatePreferences);

export default router;
