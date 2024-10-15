import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Request 객체에 user 필드를 추가하는 새로운 타입 정의
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authMiddleware = (
  req: Request, // 여기는 기본 Request 타입 사용
  res: Response,
  next: NextFunction
): void => { // 반환 타입을 명시적으로 void로 설정
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;  // 응답을 보낸 후 함수가 void를 반환하도록 return
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN 형식 가정
  if (!token) {
    res.status(401).json({ message: 'Access denied. Invalid token format.' });
    return;  // 응답을 보낸 후 함수가 void를 반환하도록 return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded; // req 객체를 확장된 타입으로 캐스팅
    next(); // 다음 미들웨어로 넘어감
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
    return;  // 응답을 보낸 후 함수가 void를 반환하도록 return
  }
};
