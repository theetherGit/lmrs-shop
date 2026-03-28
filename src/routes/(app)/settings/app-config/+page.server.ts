import { tryCatch } from '$lib/helpers/try-catch';
import { getDb } from '$lib/server/db';
import { appSettings } from '$lib/server/db/shop.schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const db = getDb();
	const { data, error } = await tryCatch(db.query.appSettings.findFirst());

	if (data && data.id) {
		return {
			config: data as typeof data
		};
	}

	return {
		config: null
	};
};

export type LoadReturnType = Awaited<ReturnType<typeof load>>;
