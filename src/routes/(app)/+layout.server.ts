import type { LayoutServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { tryCatch } from '$lib/helpers/try-catch';
import { appSettings } from '$lib/server/db/schema';
import { desc, lte } from 'drizzle-orm';
import { redirectWithNext } from '$lib/server/auth-utils';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.user) {
    redirectWithNext(event);
  }

  const today = new Date().toISOString().split('T')[0];

  const db = getDb();
  const { data, error } = await tryCatch(db.query.appSettings.findFirst({
    where: lte(appSettings.date, today),
    orderBy: desc(appSettings.date)
  }));

  if (error || !data) {
    console.error('Error fetching app config:', error);
    return {
      user: event.locals.user,
      config: null
    };
  }

  return {
    user: event.locals.user,
    config: data
  };
};
