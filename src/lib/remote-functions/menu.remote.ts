import { form } from "$app/server";
import { tryCatch } from "$lib/helpers/try-catch";
import { createShopFoodMenu, updateShopFoodMenu } from "$lib/models/zod-schema/shop.zod.schema";
import { getDb } from "$lib/server/db";
import { servingOption } from "$lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import { remoteFOrmReturnWithSuccess } from "./utils";

export const createShopMenuRemoteFunction = form(createShopFoodMenu, async (data) => {
  const db = getDb();

  const { error, data: drizzleResponse } = await tryCatch(db.insert(servingOption).values(data));
  if (error) {
    console.log(error);
    return remoteFOrmReturnWithSuccess(false, "Unable to create menu item");
  }

  if (drizzleResponse.success) {
    return remoteFOrmReturnWithSuccess(true, "Successfully created menu item");
  }

  return remoteFOrmReturnWithSuccess(false, "Unable to create menu item");
});

export const updateShopMenuRemoteFunction = form(updateShopFoodMenu, async (data) => {
  const db = getDb();

  if (!data.id) {
    return remoteFOrmReturnWithSuccess(false, "ID is required for updating menu item");
  }

  const { error, data: drizzleResponse } = await tryCatch(db.update(servingOption).set(data).where(eq(servingOption.id, data.id)));

  if (error) {
    console.log(error);
    return remoteFOrmReturnWithSuccess(false, "Unable to update menu item");
  }

  if (drizzleResponse.success) {
    return remoteFOrmReturnWithSuccess(true, "Successfully updated menu item");
  }

  return remoteFOrmReturnWithSuccess(false, "Unable to update menu item");
});
