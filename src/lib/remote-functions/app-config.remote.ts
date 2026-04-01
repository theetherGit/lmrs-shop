import { form } from '$app/server';
import { tryCatch } from '$lib/helpers/try-catch';
import { appConfigCreateSchema } from '$lib/models/zod-schema/app-config.schema.js';
import { getDb } from '$lib/server/db';
import { appSettings } from '$lib/models/db-schema/shop.schema';
import { remoteFOrmReturnWithSuccess } from './utils';
import { eq } from 'drizzle-orm';
import { DrizzleQueryError } from 'drizzle-orm/errors';
import { invalid } from '@sveltejs/kit';


export const addAppConfigRemoteFunction = form(appConfigCreateSchema, async (validatedData, issue) => {
  const { id, ...data } = validatedData;
  if (id && id !== 'new') {
    return remoteFOrmReturnWithSuccess(false, 'Why we have a random id here.');
  }
  const db = getDb();

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

  const { error, data: appConfig } = await tryCatch(db.update(appSettings).set(data).where(eq(appSettings.id, data.id)));

  if (error) {
    console.log(error);
    if (error instanceof DrizzleQueryError) {
      invalid(issue('Unable to update the app config. Please check your input and try again.'));
    }
    return remoteFOrmReturnWithSuccess(false, 'Unable to update the app config.');
  }

  if (appConfig.success) {
    return remoteFOrmReturnWithSuccess(true, 'Successfully updated app config.');
  }

  return remoteFOrmReturnWithSuccess(false, 'Unable to update app config.');
});
