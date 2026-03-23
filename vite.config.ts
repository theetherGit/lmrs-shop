import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vite";
import { DevTools } from "@vitejs/devtools";

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), devtoolsJson(), DevTools({ builtinDevTools: true })],
});
