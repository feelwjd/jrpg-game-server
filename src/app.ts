import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import characterRoutes from './routes/characterRoutes';
import battleRoutes from './routes/battleRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/battle', battleRoutes);
app.use('/api/inventory', inventoryRoutes);

export default app;
