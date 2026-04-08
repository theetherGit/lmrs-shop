import { z } from 'zod';

export const inventorySchema = z.object({
  id: z.string(),
  date: z.string(),
  stock_type: z.enum(['fresh', 'closing', 'opening']).nullable(),
  stock: z.number(),
  rate: z.number(),
  amount: z.number()
});

export type InventoryItem = z.infer<typeof inventorySchema>;
