<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as UnderlineTabs from '$lib/components/ui/underline-tabs';
	import { fly } from 'svelte/transition';

	let { children } = $props();

	type SettingsRoute = {
		key: 'appConfig' | 'user' | 'serving' | 'factorType';
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
			key: 'serving',
			value: 'Food Menu',
			url: '/settings/serving'
		},
		{
			key: 'factorType',
			value: 'Factor Types',
			url: '/settings/factor-type'
		},
		{
			key: 'user',
			value: 'User Profile',
			url: '/settings/user'
		}
	];

	let currentRoute: SettingsRoute['key'] = $state(
		routes.find((route) => route.url === page.url.pathname)?.key || 'appConfig'
	);
	let isMovingForward: boolean = $state(true);

	function getRouteIndex(routeKey: SettingsRoute['key']): number {
		return routes.findIndex((route) => route.key === routeKey);
	}

	function updateRoute(route: SettingsRoute) {
		if (route.key === currentRoute) {
			return;
		}
		const currentIndex = getRouteIndex(currentRoute);
		const nextIndex = getRouteIndex(route.key);
		isMovingForward = nextIndex > currentIndex;
		goto(resolve(route.url));
		currentRoute = route.key;
	}

	afterNavigate(() => {
		const route = routes.find((route) => route.url === page.url.pathname);
		if (route && route.key !== currentRoute) {
			isMovingForward = getRouteIndex(route.key) > getRouteIndex(currentRoute);
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
			{#key currentRoute}
				<div
					in:fly={{ x: isMovingForward ? 400 : -400, duration: 190, delay: 200 }}
					out:fly={{ x: isMovingForward ? -400 : 400, duration: 200 }}
					class="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-3"
				>
					{@render children()}
				</div>
			{/key}
		</UnderlineTabs.Content>
	</UnderlineTabs.Root>
</div>
