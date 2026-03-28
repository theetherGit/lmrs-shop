<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '$lib/components/efferd/not-found/not-found-one.svelte';
</script>

<ErrorPage statusCode={page.status} message={page.error?.message || 'Error'} />
