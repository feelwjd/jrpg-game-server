import { Request, Response } from 'express';
import { simulateBattle } from '../wasm/battle_system'; // WASM 로직 불러오기

export const startBattle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attack, defense } = req.body;

    // 입력값 유효성 검증
    if (typeof attack !== 'number' || typeof defense !== 'number') {
      res.status(400).json({ message: 'Invalid input types. Attack and defense must be numbers.' });
      return;
    }

    const damage = simulateBattle(attack, defense);

    // 전투 결과 응답
    res.status(200).json({ damage });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};
