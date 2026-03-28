import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

export type Database = DrizzleD1Database<typeof schema>;

export const createD1Connection = (d1Binding: D1Database) => {
	return drizzle(d1Binding, { schema });
};

export { getDb, dbContext } from './context.js';
