import express from 'express';
import { startBattle } from '../controllers/battleController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 전투 시뮬레이션 라우트 (JWT 인증 필요)
router.post('/battle', authMiddleware, startBattle);

export default router;
