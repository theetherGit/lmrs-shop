import { form } from '$app/server';
import { loginSchema } from '$lib/models/auth-schema.js';
import { setTimeout } from "node:timers/promises";

export const loginRemoteFunction = form(loginSchema, async (data) => {
  console.log(JSON.stringify(data))
  await setTimeout(10000); // Simulate a delay for the login process
});
