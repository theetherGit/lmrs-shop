import { getMonthDateRange } from '$lib/helpers/date.js';
import { tryCatch } from '$lib/helpers/try-catch.js';
import { inventory } from '$lib/models/db-schema/shop.schema.js';
import { getDb } from '$lib/server/db/index.js';
import { and, gte, lte } from 'drizzle-orm';

export const load = async () => {
  const db = getDb();
  const dates = getMonthDateRange(undefined, true);

  const startDate = dates.startDate.split('T').at(0) as string;
  const endDate = dates.endDate.split('T').at(0) as string;

  const { data, error } = await tryCatch(
    db.query.inventory.findMany({
      where: and(gte(inventory.date, startDate), lte(inventory.date, endDate))
    })
  );

  if (error || !data || data.length < 1) {
    return {
      startDate,
      endDate,
      inventory: null
    };
  }

  return {
    startDate,
    endDate,
    inventory: data
  };
};
