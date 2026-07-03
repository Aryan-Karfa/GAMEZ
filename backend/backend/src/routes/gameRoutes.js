import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', optionalAuthMiddleware, gameController.searchGames);
router.get('/suggestions', optionalAuthMiddleware, gameController.getSearchSuggestions);
router.get('/:rawgId', gameController.getGameDetails);

export default router;
