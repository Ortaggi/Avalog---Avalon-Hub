import { z } from 'zod';

export const RegisterRequestUser = z.object({
  email: z.email(),
  password: z.string().min(8),
  nickname: z.string().optional(),
});

export const LoginRequestUser = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const LoginResponse = z.object({
  token: z.string(),
});

export const UserResponse = z.object({
  id: z.string(),
  email: z.string(),
  nickname: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export type RegisterRequestUserType = z.infer<typeof RegisterRequestUser>;
export type LoginRequestUserType = z.infer<typeof LoginRequestUser>;
export type LoginResponseType = z.infer<typeof LoginResponse>;
export type UserResponseType = z.infer<typeof UserResponse>;
