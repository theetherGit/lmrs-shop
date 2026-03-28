import { AsyncLocalStorage } from 'node:async_hooks';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { getRequestEvent } from '$app/server';

export type Database = DrizzleD1Database<typeof schema>;
export const dbContext = new AsyncLocalStorage<Database>();

export function getDb(event?: ReturnType<typeof getRequestEvent>) {
	if (event?.locals.db) {
		return event?.locals.db;
	}
	const db = dbContext.getStore();
	if (!db) throw new Error('Database context missing!');
	return db;
}
