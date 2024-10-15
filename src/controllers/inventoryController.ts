import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

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
