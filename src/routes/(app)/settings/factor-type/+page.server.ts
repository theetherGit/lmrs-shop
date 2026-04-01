import { tryCatch } from "$lib/helpers/try-catch";
import { getDb } from "$lib/server/db"

export const load = async () => {
  const db = getDb()
  const { error, data } = await tryCatch(db.query.factorType.findMany());
  if (error) {
    console.error('Error fetching factor types:', error);
    return { factorTypes: null };
  }
  return {
    factorTypes: data
  }
}
