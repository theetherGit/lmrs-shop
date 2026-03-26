import type { LayoutServerLoad } from "./$types"
import {auth} from "$lib/server/auth";
export const load: LayoutServerLoad = async ({locals}) => {
    return {
        user: locals.user
    }
}