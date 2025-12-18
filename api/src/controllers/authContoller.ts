import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { LoginInput, RegisterInput } from '../types/aurh.js';

export async function registerUser(data: RegisterInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      nickname: data.nickname,
      statistics: {
        create: {}, // cria stats automáticas
      },
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function loginUser(data: LoginInput, app: FastifyInstance) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const token = app.jwt.sign(
    { id: user.id, email: user.email },
    { expiresIn: '7d' },
  );

  return token;
}
