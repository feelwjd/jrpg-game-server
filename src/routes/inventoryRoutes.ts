import express from 'express';
import { getInventory, addItem, equipItem, deleteItem } from '../controllers/inventoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 특정 캐릭터의 인벤토리 조회 라우트 (JWT 인증 필요)
router.get('/:characterId', authMiddleware, getInventory);

// 캐릭터에 아이템 추가 라우트 (JWT 인증 필요)
router.post('/:characterId/add', authMiddleware, addItem);

// 캐릭터 아이템 장착 라우트 (JWT 인증 필요)
router.put('/:characterId/equip/:itemId', authMiddleware, equipItem);

// 특정 캐릭터의 인벤토리의 아이템 삭제 (JWT 인증 필요)
router.delete('/:itemId', authMiddleware, deleteItem);

export default router;
