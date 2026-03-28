import { unAuthenticatedRedirect } from '$lib/server/auth-utils'

export const load = (event) => {
  unAuthenticatedRedirect(event)
}
