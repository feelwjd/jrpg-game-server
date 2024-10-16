import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

//인벤토리 조회
export const getInventory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { characterId } = req.params;

  if (!req.user || typeof req.user === 'string') {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }

  try {
    const inventory = await prisma.item.findMany({
      where: { characterId: Number(characterId) },
    });
    res.status(200).json({ inventory });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Error fetching inventory', error: error.message });
    return;
  }
};

//아이템 추가
export const addItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { characterId } = req.params;
  const { itemName, itemType } = req.body;

  if (!req.user || typeof req.user === 'string') {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }

  try {
    const item = await prisma.item.create({
      data: {
        name: itemName,
        type: itemType,
        characterId: Number(characterId),
      },
    });
    res.status(201).json({ message: 'Item added successfully', item });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Error adding item', error: error.message });
    return;
  }
};

// 아이템 장착
export const equipItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { characterId, itemId } = req.params;

  if (!req.user || typeof req.user === 'string') {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }

  try {
    // 아이템 장착 처리 (이미 장착된 아이템이 있으면 장착 해제)
    await prisma.item.updateMany({
      where: { characterId: Number(characterId), equipped: true },
      data: { equipped: false },
    });

    // 새로운 아이템 장착
    const updatedItem = await prisma.item.update({
      where: { id: Number(itemId) },
      data: { equipped: true },
    });

    res.status(200).json({ message: 'Item equipped successfully', updatedItem });
  } catch (error: any) {
    res.status(400).json({ message: 'Error equipping item', error: error.message });
  }
};

// 아이템 삭제
export const deleteItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { itemId } = req.params;

  if (!req.user || typeof req.user === 'string') {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }

  try {
    await prisma.item.delete({
      where: { id: Number(itemId) },
    });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: 'Error deleting item', error: error.message });
  }
};
