import { LoginRequestUser, LoginResponse, RegisterRequestUser, UserResponse } from '../dtos/user.js';

export const schemaAuth = {
  register: {
    tags: ['Auth'],
    description: 'Register new user',
    body: RegisterRequestUser,
    response: {
      201: UserResponse,
    },
  },
  login: {
    tags: ['Auth'],
    description: 'Login with credentials',

    body: LoginRequestUser,
    response: {
      200: LoginResponse,
    },
  },
  me: {
    tags: ['Auth'],
    description: 'Get current authenticated user',
    response: {
      200: UserResponse,
    },
  },
};
