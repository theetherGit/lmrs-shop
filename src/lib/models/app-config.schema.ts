import { appSettings } from '$lib/server/db/schema.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';

export const appConfigCreateSchema = createInsertSchema(appSettings)
export const appConfigUpdateSchema = createUpdateSchema(appSettings)
