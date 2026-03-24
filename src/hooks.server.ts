import { building } from "$app/environment";
import { auth } from "$lib/server/auth";
import { getDb } from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import type { HandleValidationError } from '@sveltejs/kit';

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
  return {
		message: 'Do not try anything fishy.',
	};
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
    if (building) return resolve(event);
    getDb(event.platform!.env!.LMRS_SHOP!);

    const session = await auth.api.getSession({ headers: event.request.headers });

    if (session) {
        event.locals.session = session.session;
        event.locals.user = session.user;
    }

    return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
