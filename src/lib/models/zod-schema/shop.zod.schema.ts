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

export const createFactorType = z.object({
  category: z.string().min(1, "Category is required").max(100, "Category must be at most 100 characters"),
  subCategory: z.string().min(1, "Sub-category is required").max(100, "Sub-category must be at most 100 characters"),
  factorSlug: z.string().min(1, "Factor slug is required").max(150, "Factor slug must be at most 150 characters")
}).required();

export const updateFactorType = createFactorType.partial().extend({
  id: z.string().nonempty("ID is required for update")
});
