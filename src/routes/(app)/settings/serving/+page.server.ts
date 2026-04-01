import { tryCatch } from "$lib/helpers/try-catch";
import { getDb } from "$lib/server/db"

export const load = async () => {
  const db = getDb()
  const { error, data } = await tryCatch(db.query.servingOption.findMany());
  if (error) {
    console.error('Error fetching serving options:', error);
    return { servingMenu: null };
  }
  return {
    servingMenu: data
  }
}
