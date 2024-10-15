import express from 'express';
import { register, login, requestPasswordReset, resetPassword, sendEmailVerification, verifyEmail} from '../controllers/authController';

const router = express.Router();

// 사용자 회원가입 라우트
router.post('/register', register);

// 사용자 로그인 라우트
router.post('/login', login);

// 비밀번호 복구 API
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// 이메일 인증 API
router.post('/send-verification', sendEmailVerification);
router.post('/verify-email', verifyEmail);

export default router;
