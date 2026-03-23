<script lang="ts">
    import "./layout.css";
    import { ModeWatcher } from "mode-watcher";

    import favicon from "$lib/assets/favicon.svg";

    let { children } = $props();
</script>

<ModeWatcher track={true} defaultMode="dark" disableTransitions={true} />

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="bg-muted dark:bg-background flex min-h-svh">
    {@render children()}
</div>
