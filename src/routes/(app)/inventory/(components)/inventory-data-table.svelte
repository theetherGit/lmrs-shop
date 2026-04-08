<script lang="ts" module>
	import type { ColumnDef } from '@tanstack/table-core';
	import type { Inventory } from '../inventory.schema';
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import InventoryStockTypeBadge from './inventory-stock-type-badge.svelte';

	export const columns: ColumnDef<Inventory>[] = [
		{
			accessorKey: 'date',
			header: 'Date',
			cell: ({ row }) => {
				const date = new Date(row.getValue('date'));
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
			}
		},
		{
			accessorKey: 'stock_type',
			header: 'Stock Type',
			cell: ({ row }) =>
				renderComponent(InventoryStockTypeBadge, { type: row.getValue('stock_type') })
		},
		{
			accessorKey: 'stock',
			header: 'Quantity',
			cell: ({ row }) => {
				const value = row.getValue('stock');
				return value ? parseInt(value as string) : 0;
			}
		},
		{
			accessorKey: 'rate',
			header: 'Rate (per piece)',
			cell: ({ row }) => {
				const value = row.getValue('rate');
				return value ? `Rs. ${parseFloat(value as string).toFixed(2)}` : 'Rs. 0.00';
			}
		},
		{
			accessorKey: 'amount',
			header: 'Total Amount',
			cell: ({ row }) => {
				const value = row.getValue('amount');
				return value ? `Rs. ${parseFloat(value as string).toFixed(2)}` : 'Rs. 0.00';
			}
		}
	];
</script>

<script lang="ts">
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnFiltersState,
		type PaginationState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import LayoutColumnsIcon from '@tabler/icons-svelte/icons/layout-columns';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import ChevronsLeftIcon from '@tabler/icons-svelte/icons/chevrons-left';
	import ChevronLeftIcon from '@tabler/icons-svelte/icons/chevron-left';
	import ChevronRightIcon from '@tabler/icons-svelte/icons/chevron-right';
	import ChevronsRightIcon from '@tabler/icons-svelte/icons/chevrons-right';
	import SearchIcon from '@tabler/icons-svelte/icons/search';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';

	interface Props {
		data: Inventory[];
		onAddLog: () => void;
	}

	const { data, onAddLog }: Props = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let dateFilterValue = $state('');
	let stockTypeFilter = $state<string | undefined>();

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		}
	});

	function handleDateFilterChange(value: string) {
		dateFilterValue = value;
		if (value.trim()) {
			table.getColumn('date')?.setFilterValue(value);
		} else {
			table.getColumn('date')?.setFilterValue(undefined);
		}
	}

	function handleStockTypeChange(value: string | undefined) {
		stockTypeFilter = value;
		if (value) {
			table.getColumn('stock_type')?.setFilterValue(value);
		} else {
			table.getColumn('stock_type')?.setFilterValue(undefined);
		}
	}

	function resetFilters() {
		dateFilterValue = '';
		stockTypeFilter = undefined;
		table.getColumn('date')?.setFilterValue(undefined);
		table.getColumn('stock_type')?.setFilterValue(undefined);
	}

	const isEmpty = $derived(data.length === 0);
</script>

<div class="w-full space-y-4">
	<!-- Filters -->
	<div class="flex flex-col gap-4 rounded-lg border border-input bg-card p-4">
		<div class="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
			<!-- Date Search -->
			<div class="flex flex-1 flex-col gap-2">
				<Label for="date-search" class="text-sm font-medium">Search by Date</Label>
				<div class="relative">
					<SearchIcon class="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						id="date-search"
						placeholder="YYYY-MM-DD"
						type="text"
						class="pl-8"
						value={dateFilterValue}
						onchange={(e) => handleDateFilterChange(e.currentTarget.value)}
					/>
				</div>
			</div>

			<!-- Stock Type Filter -->
			<div class="flex flex-col gap-2">
				<Label for="stock-type" class="text-sm font-medium">Stock Type</Label>
				<Select.Root
					type="single"
					value={stockTypeFilter}
					onValueChange={(e) => handleStockTypeChange(e)}
				>
					<Select.Trigger id="stock-type" class="w-full md:w-48">
						{#if stockTypeFilter}
							<span class="capitalize">{stockTypeFilter}</span>
						{:else}
							<span class="text-muted-foreground">All Types</span>
						{/if}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={undefined}>All Types</Select.Item>
						<Select.Item value="fresh">Fresh</Select.Item>
						<Select.Item value="closing">Closing</Select.Item>
						<Select.Item value="opening">Opening</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Reset Filters -->
			<Button variant="outline" size="sm" onclick={resetFilters} class="w-full md:w-auto">
				Reset Filters
			</Button>

			<!-- Add Log Button -->
			<Button onclick={onAddLog} class="w-full gap-2 md:w-auto">
				<PlusIcon class="h-4 w-4" />
				Add Log
			</Button>
		</div>
	</div>

	<!-- Column Visibility Toggle -->
	<div class="flex items-center justify-between px-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="sm" {...props}>
						<LayoutColumnsIcon class="h-4 w-4" />
						<span class="hidden lg:inline">Customize Columns</span>
						<span class="lg:hidden">Columns</span>
						<ChevronDownIcon class="h-4 w-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56">
				{#each table
					.getAllColumns()
					.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column.id)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						checked={column.getIsVisible()}
						onCheckedChange={(value) => column.toggleVisibility(!!value)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<div class="text-sm text-muted-foreground">
			Showing {table.getFilteredRowModel().rows.length} of {data.length} record(s)
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header class="bg-muted">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class="font-semibold">
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if table.getRowModel().rows?.length}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center text-muted-foreground">
							No records found. Try adjusting your filters.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination -->
	<div class="flex items-center justify-between px-2">
		<div class="hidden text-sm text-muted-foreground lg:flex">
			Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				class="hidden size-8 lg:flex"
				size="icon"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronsLeftIcon class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronLeftIcon class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<ChevronRightIcon class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				class="hidden size-8 lg:flex"
				size="icon"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<ChevronsRightIcon class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
