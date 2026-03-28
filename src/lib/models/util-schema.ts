import { z } from 'zod';

export const Email = z.email('Invalid email address');
export const Password = z
	.string()
	.min(6, 'Password must be at least 6 characters long')
	.max(12, 'Password must be at most 12 characters long');
