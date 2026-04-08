<script lang="ts">
	import type { PageProps } from './$types';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import InventoryDataTable from './(components)/inventory-data-table.svelte';
	import AddUpdateInventory from './(components)/add-update-inventory.svelte';
	import Container from '$lib/components/container.svelte';
	import { Button } from '$lib/components/ui/button';
	import Plus from '@tabler/icons-svelte/icons/plus';
	import DatabaseCog from '@tabler/icons-svelte/icons/database-cog';

	let { data }: PageProps = $props();

	let isDialogOpen = $state(false);
	let selectedInventoryId = $state<string | null>(null);

	function handleAddLog() {
		selectedInventoryId = null;
		isDialogOpen = true;
	}

	function handleDialogOpenChange(open: boolean) {
		isDialogOpen = open;
		if (!open) {
			selectedInventoryId = null;
		}
	}

	function handleSuccess() {
		isDialogOpen = false;
		selectedInventoryId = null;
		// Trigger page reload to fetch updated data
		window.location.reload();
	}
</script>

<Container class="">
	{#if data.inventory}
		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight">Inventory Management</h1>
			<p class="text-muted-foreground">
				Track your stock movements for the period from {data.startDate} to {data.endDate}
			</p>
		</div>
		<InventoryDataTable data={data.inventory} onAddLog={handleAddLog} />
	{:else}
		<Card.Root class="min-h-[calc(100vh-7rem)]">
			<Card.Header>
				<Card.Title>Inventory</Card.Title>
				<Card.Description
					>Manage your inventory log for fresh, opening and closing stock</Card.Description
				>
			</Card.Header>
			<Card.Content class="flex min-h-[calc(100vh-15rem)] items-center justify-center">
				<Empty.Root class="min-h-[calc(100vh-15rem)] border-2">
					<Empty.Media>
						<!-- <NoFood class="h-6 w-6 text-muted-foreground" /> -->
					</Empty.Media>
					<Empty.Title>No inventory logs found</Empty.Title>
					<Empty.Description
						>No inventory logs for {data.startDate} to {data.endDate}</Empty.Description
					>
					<Empty.Content>
						<Button onclick={() => {}}>
							<!-- <AddMenuIcon /> -->
							<span class="flex items-center gap-2"> Add New Log</span>
						</Button>
					</Empty.Content>
				</Empty.Root>
			</Card.Content>
		</Card.Root>
	{/if}

	<AddUpdateInventory
		open={isDialogOpen}
		onOpenChange={handleDialogOpenChange}
		onSuccess={handleSuccess}
		inventoryId={selectedInventoryId}
	/>
</Container>
