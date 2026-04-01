import { z } from "zod";

export const createShopFoodMenu = z.object({
  name: z.string(),
  price: z.number().positive().refine((val) => val.toFixed(2)),
  pieces: z.number().positive().min(1, "Must be at least 1").max(100, "Must be at most 100"),
  isActive: z.string().transform((val) => val === 'on' || val === 'true').default(true)
}).required();

export const updateShopFoodMenu = createShopFoodMenu.partial().extend({
  id: z.string().nonempty("ID is required for update")
});
