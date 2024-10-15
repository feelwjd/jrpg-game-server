import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// 이메일 전송을 위한 Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: 'gmail', // 사용하려는 이메일 서비스 (Gmail을 예시로 사용)
  auth: {
    user: process.env.EMAIL_USER, // .env에 저장된 이메일 사용자
    pass: process.env.EMAIL_PASS, // .env에 저장된 이메일 비밀번호
  },
});

//회원 가입 API
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User created successfully', user });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
    return;
  }
};

//로그인 API
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.status(200).json({ token });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};

// 비밀번호 복구 요청
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    // 비밀번호 복구 토큰 생성 (1시간 동안 유효)
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // 복구 링크 생성
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 이메일 전송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};

// 비밀번호 재설정
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password reset successfully' });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
    return;
  }
};

// 이메일 인증 요청
export const sendEmailVerification = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    // 이메일 인증 토큰 생성
    const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    // 이메일 인증 링크 생성
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // 이메일 전송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Click the link to verify your email: ${verificationLink}`,
    });

    res.status(200).json({ message: 'Verification email sent' });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};

// 이메일 인증 처리
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    await prisma.user.update({
      where: { id: decoded.id },
      data: { emailVerified: true },
    });

    res.status(200).json({ message: 'Email verified successfully' });
    return;
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
    return;
  }
};