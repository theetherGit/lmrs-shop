import { tryCatch } from "$lib/helpers/try-catch";
import { getDb } from "$lib/server/db";
import { appSettings } from "$lib/server/db/schema";
import { desc, lte } from "drizzle-orm";

export const load = async () => {
  const today = new Date().toISOString().split('T')[0];

  const db = getDb();
  const { data } = await tryCatch(db.query.appSettings.findFirst({
    where: lte(appSettings.date, today),
    offset: 1,
    orderBy: desc(appSettings.date)
  }));
  return {
    oldConfig: data ?? null
  };
};
