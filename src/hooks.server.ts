import { building } from "$app/environment";
import { getAuth } from "$lib/server/auth";
import { createD1Connection, dbContext, getDb } from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import type { HandleValidationError } from '@sveltejs/kit';
import { error, redirect } from "@sveltejs/kit";
import { tryCatch } from "$lib/helpers/try-catch";

const UNAUTHENTICATED_ROUTES = ['/', '/sign-up'];

function createLoginRedirectURL(event: { url: URL }) {
  if (event.url.searchParams.has('next')) return event.url.search;
  const next = encodeURIComponent(event.url.pathname + event.url.search);
  return `/?next=${next}`;
}

function isProtectedRoute(routeId?: string) {
  return routeId?.startsWith('/(app)/');
}

function isPublicRoute(pathname: string) {
  return UNAUTHENTICATED_ROUTES.includes(pathname);
}


export const handleValidationError: HandleValidationError = ({ event, issues }) => {
  return {
    message: 'Do not try anything fishy.',
  };
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  if (building) return resolve(event);

  const d1 = event.platform?.env?.LMRS_SHOP;
  if (!d1) {
    throw error(500, 'Unable to find db.')
  }

  const db = createD1Connection(d1)
  event.locals.db = db;

  const auth = getAuth(db)

  const { data: session, error: sessionError } = await tryCatch(auth.api.getSession({ headers: event.request.headers }));

  if (sessionError) {
    await auth.api.signOut({ headers: event.request.headers });
    console.error('Error fetching session', sessionError);
    redirect(307, createLoginRedirectURL(event));
  }

  if (!session && isProtectedRoute(event.route.id as string)) {
    redirect(307, createLoginRedirectURL(event));
  }

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
    if (isPublicRoute(event.url.pathname)) {
      redirect(307, '/projects');
    }
  }

  return dbContext.run(db, () => svelteKitHandler({ event, resolve, auth, building }))
};

export const handle: Handle = handleBetterAuth;
