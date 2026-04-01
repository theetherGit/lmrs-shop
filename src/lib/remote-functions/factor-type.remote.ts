import { form } from "$app/server";
import { tryCatch } from "$lib/helpers/try-catch";
import { createFactorType, updateFactorType } from "$lib/models/zod-schema/shop.zod.schema.js";
import { getDb } from "$lib/server/db";
import { factorType } from "$lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import { remoteFOrmReturnWithSuccess } from "./utils.js";

export const createFactorTypeRemoteFunction = form(createFactorType, async (data) => {
  const db = getDb();

  const { error, data: drizzleResponse } = await tryCatch(db.insert(factorType).values(data));
  if (error) {
    console.log(error);
    return remoteFOrmReturnWithSuccess(false, "Unable to create factor type");
  }

  if (drizzleResponse.success) {
    return remoteFOrmReturnWithSuccess(true, "Successfully created factor type");
  }

  return remoteFOrmReturnWithSuccess(false, "Unable to create factor type");
});

export const updateFactorTypeRemoteFunction = form(updateFactorType, async (data) => {
  const db = getDb();

  if (!data.id) {
    return remoteFOrmReturnWithSuccess(false, "ID is required for updating factor type");
  }

  const { error, data: drizzleResponse } = await tryCatch(db.update(factorType).set(data).where(eq(factorType.id, data.id)));

  if (error) {
    console.log(error);
    return remoteFOrmReturnWithSuccess(false, "Unable to update factor type");
  }

  if (drizzleResponse.success) {
    return remoteFOrmReturnWithSuccess(true, "Successfully updated factor type");
  }

  return remoteFOrmReturnWithSuccess(false, "Unable to update factor type");
});
