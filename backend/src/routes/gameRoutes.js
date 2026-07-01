import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';

const router = Router();

router.get('/search', gameController.searchGames);
router.get('/:rawgId', gameController.getGameDetails);

export default router;
