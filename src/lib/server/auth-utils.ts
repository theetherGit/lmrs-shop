import { redirect, type RequestEvent } from "@sveltejs/kit";

export function createLoginRedirectURL(event: { url: URL }) {
  if (event.url.searchParams.has('next')) return event.url.search;
  const next = encodeURIComponent(event.url.pathname + event.url.search);
  return `/?next=${next}`;
}

export const unAuthenticatedRedirect = (event: RequestEvent, status: Parameters<typeof redirect>[0] = 307, location?: Parameters<typeof redirect>[1]) => {
  if (!event.locals.user) {
    redirect(status, location || createLoginRedirectURL(event))
  }
}

export const redirectWithNext = (event: RequestEvent, status: Parameters<typeof redirect>[0] = 307, fallbackLocation = '/dahboard') => {
  const { url } = event
  const nextLocation = url.searchParams.get('next')
  if (nextLocation) {
    redirect(status, nextLocation ?? fallbackLocation)
  }
}
