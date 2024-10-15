import express from 'express';
import { getInventory, addItem } from '../controllers/inventoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 특정 캐릭터의 인벤토리 조회 라우트 (JWT 인증 필요)
router.get('/:characterId', authMiddleware, getInventory);

// 캐릭터에 아이템 추가 라우트 (JWT 인증 필요)
router.post('/:characterId/add', authMiddleware, addItem);

export default router;
