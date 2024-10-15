// src/server.ts

import { PrismaClient } from '@prisma/client';
import app from './app';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
