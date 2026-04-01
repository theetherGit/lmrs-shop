import { appSettings } from '$lib/models/db-schema/index.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';

export const appConfigCreateSchema = createInsertSchema(appSettings, {
  id: (s) => s.optional(),
  date: (s) => s.refine((value) => new Date(value).toISOString().split('T')[0]),
  makerRate: (s) => s.refine((val) => val.toFixed(2)),
  estimatedCostPrice: (s) => s.refine((val) => val.toFixed(2)),
  minSellingPrice: (s) => s.refine((val) => val.toFixed(2)),
  maxSellingPrice: (s) => s.refine((val) => val.toFixed(2)),
  safetyBuffer: (s) => s.refine((val) => val.toFixed(2)),
  growthRate: (s) => s.refine((val) => val.toFixed(2)),
}).required();

export const appConfigUpdateSchema = createUpdateSchema(appSettings, {
  id: (s) => s.nonoptional()
});
