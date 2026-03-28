import { form } from '$app/server';
import { tryCatch } from '$lib/helpers/try-catch';
import { appConfigCreateSchema } from '$lib/models/app-config.schema.js';
import { getDb } from '$lib/server/db';
import { appSettings } from '$lib/server/db/shop.schema';
import { remoteFOrmReturnWithSuccess } from './utils';

export const addAppConfigRemoteFunction = form(appConfigCreateSchema, async (data, issue) => {
	const db = getDb();
	if (data.id && data.id !== 'new') {
		return remoteFOrmReturnWithSuccess(false, 'Why we have a random id here.');
	}

	data.id = undefined;

	const { error, data: appConfig } = await tryCatch(db.insert(appSettings).values(data));
	if (error) {
		console.log(error);
		return remoteFOrmReturnWithSuccess(false, 'Unable to create a app config.');
	}

	if (appConfig.success) {
		return remoteFOrmReturnWithSuccess(true, 'Successfully added a new app config.');
	}

	return remoteFOrmReturnWithSuccess(false, 'Unable to create a new app config');
});

export const updateAppConfig = form(appConfigCreateSchema, async (data, issue) => {
	const db = getDb();
	if (!data.id) {
		return remoteFOrmReturnWithSuccess(false, 'Are you trying to be a hacker?');
	}

	const { error, data: appConfig } = await tryCatch(db.update(appSettings).set(data));

	if (error) {
		console.log(error);
		return remoteFOrmReturnWithSuccess(false, 'Unable to update the app config.');
	}

	if (appConfig.success) {
		return remoteFOrmReturnWithSuccess(true, 'Successfully updated app config.');
	}

	return remoteFOrmReturnWithSuccess(false, 'Unable to update app config.');
});
