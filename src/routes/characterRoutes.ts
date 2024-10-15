import express from 'express';
import { createCharacter, getCharacters } from '../controllers/characterController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 캐릭터 생성 라우트 (JWT 인증 필요)
router.post('/create', authMiddleware, createCharacter);

// 사용자 캐릭터 목록 조회 라우트 (JWT 인증 필요)
router.get('/', authMiddleware, getCharacters);

export default router;
