<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as UnderlineTabs from '$lib/components/ui/underline-tabs';

	let { children } = $props();

	let currentRoute: SettingsRoute['key'] = $state('appConfig');

	type SettingsRoute = {
		key: 'appConfig' | 'user';
		value: string;
		url: Parameters<typeof resolve>[0];
	};

	const routes: SettingsRoute[] = [
		{
			key: 'appConfig',
			value: 'App Config',
			url: '/settings/app-config'
		},
		{
			key: 'user',
			value: 'User Settings',
			url: '/settings/user'
		}
	];

	function updateRoute(route: SettingsRoute) {
		if (route.key === currentRoute) {
			return;
		}
		goto(resolve(route.url));
		currentRoute = route.key;
	}

	afterNavigate(() => {
		const route = routes.find((route) => route.url === page.url.pathname);
		if (route && route.key !== currentRoute) {
			currentRoute = route.key;
		}
	});
</script>

<div class="relative w-full">
	<UnderlineTabs.Root value={currentRoute}>
		<UnderlineTabs.List>
			{#each routes as route (route.key)}
				<UnderlineTabs.Trigger
					class="hit-area-2.5"
					onclick={() => updateRoute(route)}
					value={route.key}>{route.value}</UnderlineTabs.Trigger
				>
			{/each}
		</UnderlineTabs.List>
		<UnderlineTabs.Content value={currentRoute}>
			<div class="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-3">
				{@render children()}
			</div>
		</UnderlineTabs.Content>
	</UnderlineTabs.Root>
</div>
