import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware'; // 미들웨어에서 정의한 타입

const prisma = new PrismaClient();

export const createCharacter = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, class: charClass } = req.body;

  if (!req.user || typeof req.user === 'string') {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }

  const userId = req.user.id;
  try {
    const character = await prisma.character.create({
      data: {
        name,
        class: charClass,
        ownerId: userId,
      },
    });
    res.status(201).json({ message: 'Character created successfully', character });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating character', error: error.message });
    return;
  }
};

export const getCharacters = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || typeof req.user === 'string') {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }

  const userId = req.user.id;
  try {
    const characters = await prisma.character.findMany({
      where: { ownerId: userId },
    });
    res.status(200).json({ characters });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Error fetching characters', error: error.message });
    return;
  }
};
