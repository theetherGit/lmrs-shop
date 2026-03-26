import { createAuthClient } from "better-auth/svelte"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [adminClient()]
})


export type Session = typeof authClient.$Infer.Session.session
export type User = typeof authClient.$Infer.Session.user
