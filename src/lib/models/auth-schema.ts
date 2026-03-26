import { z } from 'zod';
import { Email, Password } from './util-schema';

export const loginSchema = z.object({
  email: Email,
  password: Password,
});

export const registerSchema = z.object({
  email: Email,
  password: Password,
  name: z.string().min(2, 'Name must be at least 2 characters long').max(30, 'Name must be at most 30 characters long'),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>
