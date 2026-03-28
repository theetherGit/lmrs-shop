import { resolve } from "$app/paths"
import { redirect } from "@sveltejs/kit"

export const load = async () => {
  redirect(307, resolve('/settings/app-config'))
}
