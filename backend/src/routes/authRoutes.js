import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
