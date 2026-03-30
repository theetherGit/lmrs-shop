import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';
import {getDbContext, dbContext} from "./context.js"
import type {RequestEvent} from "@sveltejs/kit";
export type Database = DrizzleD1Database<typeof schema>;

const createD1Connection = (d1Binding: D1Database) => {
	return drizzle(d1Binding, { schema });
};

const getDb = (event?: RequestEvent) => {
    if (event?.locals.db) {
        return event.locals.db;
    }
    const currentDbContext = getDbContext();
    if (currentDbContext) {
        return currentDbContext;
    }
    if (event?.platform?.env.LMRS_SHOP) return createD1Connection(event?.platform?.env.LMRS_SHOP)
    throw new Error(`Unable to get provide database connection`);
}
export { getDb, dbContext, createD1Connection };
