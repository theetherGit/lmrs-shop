import { defineConfig } from "jsrepo";

export default defineConfig({
    // configure where stuff comes from here
    registries: ["@ieedan/shadcn-svelte-extras"],
    // configure where stuff goes here
    paths: {
        ui: "$lib/components/ui",
        block: "$lib/components/block",
        hook: "$lib/helpers/hooks",
        action: "$lib/helpers/actions",
        util: "$lib/helpers/shadcn",
        lib: "$lib",
    },
});
