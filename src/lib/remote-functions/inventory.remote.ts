import { form } from '@sveltejs/kit';
import { z } from 'zod';
import { tryCatch } from '$lib/helpers/try-catch';
import { createInventory, updateInventory } from '$lib/models/zod-schema/shop.zod.schema';
import { getDb } from '$lib/server/db';
import { inventory } from '$lib/models/db-schema/shop.schema';
import { remoteFOrmReturnWithSuccess } from './utils';
import { eq } from 'drizzle-orm';

export const addInventoryRemoteFunction = form(createInventory, async (validatedData) => {
  const db = getDb();

  const { error } = await tryCatch(
    db.insert(inventory).values(validatedData)
  );

  if (error) {
    console.error('Error adding inventory:', error);
    return remoteFOrmReturnWithSuccess(false, 'Unable to add inventory log.');
  }

  return remoteFOrmReturnWithSuccess(true, 'Inventory log added successfully.');
});

export const updateInventoryRemoteFunction = form(updateInventory, async (data) => {
  const db = getDb();

  if (!data.id) {
    return remoteFOrmReturnWithSuccess(false, 'Invalid inventory item ID.');
  }

  const { id, ...updateData } = data;

  const { error } = await tryCatch(
    db.update(inventory).set(updateData).where(eq(inventory.id, id))
  );

  if (error) {
    console.error('Error updating inventory:', error);
    return remoteFOrmReturnWithSuccess(false, 'Unable to update inventory.');
  }

  return remoteFOrmReturnWithSuccess(true, 'Inventory log updated successfully.');
});

export const deleteInventoryRemoteFunction = form(
  z.object({ id: z.string().min(1, 'ID is required') }),
  async (data) => {
    const db = getDb();

    const { error } = await tryCatch(
      db.delete(inventory).where(eq(inventory.id, data.id))
    );

    if (error) {
      console.error('Error deleting inventory:', error);
      return remoteFOrmReturnWithSuccess(false, 'Unable to delete inventory log.');
    }

    return remoteFOrmReturnWithSuccess(true, 'Inventory log deleted successfully.');
  }
);
