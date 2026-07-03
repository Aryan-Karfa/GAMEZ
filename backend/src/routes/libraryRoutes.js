import { Router } from 'express';
import * as libraryController from '../controllers/libraryController.js';
import { validateAddGame, validateUpdateEntry } from '../validators/libraryValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, libraryController.getLibrary);
router.get('/:id', authMiddleware, libraryController.getEntryDetails);
router.post('/', authMiddleware, validateAddGame, libraryController.addGame);
router.patch('/:id', authMiddleware, validateUpdateEntry, libraryController.updateEntry);
router.delete('/:id', authMiddleware, libraryController.deleteEntry);

export default router;
