import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";

export let db: DrizzleD1Database<typeof schema> | null = null;

export const getDb = (d1Binding: D1Database) => {
    if (!db) {
        db = drizzle(d1Binding, { schema });
    }
    return db;
};
