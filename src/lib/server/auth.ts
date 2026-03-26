import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { type Database } from "$lib/server/db";
import { drizzleAdapter, type DB } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { admin } from "better-auth/plugins"

type AuthConfig = ReturnType<typeof createBetterAuth>

let _authProvider: AuthConfig | null = null

/***
 * Use this for generating auth schema
 */
export const auth = betterAuth({
  baseURL: env.ORIGIN,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter({} as DB, { provider: "sqlite" }),
  emailAndPassword: { enabled: true },
  plugins: [admin(), sveltekitCookies(getRequestEvent)]
});

/**
 * To create better auth config with proper db instance
 * @param db
 * @returns
 */
function createBetterAuth(db: Database) {
  return betterAuth({
    baseURL: env.ORIGIN,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
    plugins: [admin(), sveltekitCookies(getRequestEvent)]
  });
}

/**
 *
 * @param db
 * @returns
 */
function getAuth(db?: Database): AuthConfig {
  if (_authProvider) {
    return _authProvider
  }
  if (!db) {
    throw new Error('No db connection provided.');
  }
  _authProvider = createBetterAuth(db)
  return _authProvider;
}

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user

export { createBetterAuth, getAuth }
