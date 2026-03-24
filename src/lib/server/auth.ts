import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    baseURL: env.ORIGIN,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db!, { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
    plugins: [admin(), sveltekitCookies(getRequestEvent)]
});
