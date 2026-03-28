<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<ModeWatcher track={true} defaultMode="dark" disableTransitions={true} />
<Toaster richColors duration={4000} position="bottom-right" />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-svh bg-muted dark:bg-background">
	{@render children()}
</div>
