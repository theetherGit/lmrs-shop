<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import AddMenuIcon from '@tabler/icons-svelte/icons/circle-dashed-plus';
	import NoFood from '@tabler/icons-svelte/icons/tools-kitchen-2-off';
	import type { PageProps } from './$types';
	import { IsMobile } from '$lib/helpers/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import {
		createShopMenuRemoteFunction,
		updateShopMenuRemoteFunction
	} from '$lib/remote-functions/menu.remote.js';
	import CreateOrUpdateMenuForm from './(components)/add-new-serving-form.svelte';
	import Plus from '@tabler/icons-svelte/icons/plus';
	import { Car } from '@lucide/svelte';

	let { data }: PageProps = $props();

	let priceData = $derived.by(() => {
		if (!data || !data.servingMenu) return null;
		// Sort the serving menu by price in ascending order to get the minimum and maximum prices easily
		// This also ensures that if there are multiple items with the same price, we still get the correct minimum and maximum values
		const sortedMenu = [...data.servingMenu].sort((a, b) => a.price - b.price);

		// Calculate the average price per piece by dividing the total price by the total pieces across all menu items
		// This gives a more accurate representation of the average price per piece, especially when different menu items have varying numbers of pieces
		const totalPrice = data.servingMenu.reduce((acc, item) => acc + item.price, 0);
		const totalPieces = data.servingMenu.reduce((acc, item) => acc + item.pieces, 0);
		const avgPricePerPiece = totalPieces > 0 ? totalPrice / totalPieces : 0;
		return {
			minimumPrice: sortedMenu.at(0),
			maximumPrice: sortedMenu.at(-1),
			avgPrice: avgPricePerPiece.toFixed(2)
		};
	});

	const isMobile = new IsMobile();
	let FormView:
		| typeof import('$lib/components/ui/dialog/index.js')
		| typeof import('$lib/components/ui/drawer/index.js')
		| null = $state(null);
	let showFormView: boolean = $state(false);
	let formRemoteFunction:
		| typeof createShopMenuRemoteFunction
		| typeof updateShopMenuRemoteFunction = $state(createShopMenuRemoteFunction);
	let formData: Record<string, unknown> | null = $derived(null);

	onMount(async () => {
		const views = {
			dialog: () => import('$lib/components/ui/dialog/index.js'),
			drawer: () => import('$lib/components/ui/drawer/index.js')
		};
		const view = isMobile.current ? 'drawer' : 'dialog';
		const module = await views[view]();
		FormView = module;
	});

	function openAddNewServingForm() {
		formRemoteFunction = createShopMenuRemoteFunction; // Set to the appropriate remote function for adding a new serving configuration
		formData = null; // Clear form data for new entry
		showFormView = true;
	}

	function openEditServingForm(servingConfig: Record<string, unknown>) {
		formRemoteFunction = updateShopMenuRemoteFunction;
		formData = servingConfig;
		showFormView = true;
	}
</script>

<div class="w-full">
	{#if data && data.servingMenu && data.servingMenu.length > 0}
		<div class="flex flex-col gap-y-4">
			<Card.Root class="w-full">
				<Card.Content>
					<div class="flex w-full flex-col gap-y-4 md:flex-row md:items-center md:justify-between">
						<div class="w-full">
							<h2 class="text-2xl font-semibold tracking-tight">Food Menu</h2>
							<p class="text-sm text-muted-foreground">
								Manage food menu and serving configurations
							</p>
						</div>
						<div class="flex w-full flex-row items-center justify-between gap-2 md:justify-end">
							<Button variant="secondary" size="lg" onclick={openAddNewServingForm}>
								<Plus />
								New Config
							</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
			{#if priceData}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					<Card.Root class="@container/card">
						<Card.Header>
							<Card.Description>Minimum Price</Card.Description>
							<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								₹ {priceData.minimumPrice?.price}
								<span class="text-sm font-light opacity-55"
									>/{priceData.minimumPrice?.pieces} pieces</span
								>
							</Card.Title>
						</Card.Header>
					</Card.Root>
					<Card.Root class="@container/card">
						<Card.Header>
							<Card.Description>Maximum Price</Card.Description>
							<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								₹ {priceData.maximumPrice?.price}
								<span class="text-sm font-light opacity-55"
									>/{priceData.maximumPrice?.pieces} pieces</span
								>
							</Card.Title>
						</Card.Header>
					</Card.Root>
					<Card.Root class="@container/card">
						<Card.Header>
							<Card.Description>Average Price</Card.Description>
							<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								₹ {priceData.avgPrice}
								<span class="text-sm font-light opacity-55">/piece</span>
							</Card.Title>
						</Card.Header>
					</Card.Root>
				</div>
			{/if}

			<Card.Root>
				<Card.Content>
					<ul>
						{#each data.servingMenu as menuItem (menuItem.id)}
							<li class="flex items-center justify-between border-b p-2">
								<div>
									<h3 class="text-lg font-medium">{menuItem.name}</h3>
									<p class="text-sm text-muted-foreground">
										Price: ₹{menuItem.price} | Pieces: {menuItem.pieces}
									</p>
								</div>
								<Button variant="outline" size="sm" onclick={() => openEditServingForm(menuItem)}>
									Edit
								</Button>
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		</div>
	{:else}
		<Card.Root class="min-h-[calc(100vh-9rem)]">
			<Card.Header>
				<Card.Title>Food Menu</Card.Title>
				<Card.Description>Configure food menu and serving</Card.Description>
			</Card.Header>
			<Card.Content class="flex min-h-[calc(100vh-17rem)] items-center justify-center">
				<Empty.Root class="min-h-[calc(100vh-17rem)] border-2">
					<Empty.Media>
						<NoFood class="h-6 w-6 text-muted-foreground" />
					</Empty.Media>
					<Empty.Title>Menu not found</Empty.Title>
					<Empty.Description>No food menu configuration available.</Empty.Description>
					<Empty.Content>
						<Button onclick={openAddNewServingForm}>
							<AddMenuIcon />
							<span class="flex items-center gap-2"> Add Serving Configuration</span>
						</Button>
					</Empty.Content>
				</Empty.Root>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

{#if FormView}
	<FormView.Root bind:open={showFormView} direction={isMobile.current ? 'bottom' : 'top'}>
		<FormView.Content interactOutsideBehavior="close" preventScroll={false} class="p-0 lg:p-4">
			<ScrollArea class="h-full overflow-y-auto xl:pr-0">
				<FormView.Header>
					<FormView.Title
						>{formData ? `Update Menu Item: ${formData.name}` : 'Create Menu Item'}</FormView.Title
					>
					<FormView.Description>We need this config for app to work properly.</FormView.Description>
				</FormView.Header>
				<CreateOrUpdateMenuForm
					bind:isDialogOrDrawerOpen={showFormView}
					remoteForm={formRemoteFunction}
					menuData={formData}
				/>
			</ScrollArea>
		</FormView.Content>
	</FormView.Root>
{/if}
