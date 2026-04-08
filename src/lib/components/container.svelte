<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
		withPadding?: boolean;
	};

	let { children, withPadding = true, class: className }: Props = $props();
</script>

<div class={['flex w-full flex-col', withPadding && 'p-3 md:p-4', className]}>
	{@render children()}
</div>
