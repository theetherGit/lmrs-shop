<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import DateInput from '$lib/components/date-input.svelte';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		onSuccess: () => void;
		inventoryId?: string | null;
	}

	let { open, onOpenChange, onSuccess, inventoryId }: Props = $props();

	let date = $state('');
	let stockType = $state<'fresh' | 'closing' | 'opening' | null>(null);
	let stock = $state('');
	let rate = $state('');
	let isSubmitting = $state(false);

	const amount = $derived(stock && rate ? (parseInt(stock) * parseFloat(rate)).toFixed(2) : '0.00');

	function resetForm() {
		date = '';
		stockType = null;
		stock = '';
		rate = '';
	}

	function handleOpenChange(newOpen: boolean) {
		onOpenChange(newOpen);
		if (!newOpen) {
			resetForm();
		}
	}

	// Set today's date as default when dialog opens
	$effect.pre(() => {
		if (open && !date) {
			const today = new Date().toISOString().split('T')[0];
			date = today;
		}
	});
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-106.25">
		<Dialog.Header>
			<Dialog.Title>
				{inventoryId ? 'Update Inventory Log' : 'Add Inventory Log'}
			</Dialog.Title>
			<Dialog.Description>
				{inventoryId
					? 'Update the inventory details below'
					: 'Add a new inventory entry for tracking your stock'}
			</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			action={inventoryId ? '?/updateInventory' : '?/addInventory'}
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const successData = result.data as { message?: string } | undefined;
						toast.success(successData?.message || 'Operation completed successfully');
						handleOpenChange(false);
						onSuccess();
						resetForm();
					} else if (result.type === 'error') {
						toast.error('An error occurred while processing your request');
					} else if (result.type === 'failure') {
						const failureData = result.data as { message?: string } | undefined;
						toast.error(failureData?.message || 'Operation failed');
					}
				};
			}}
			class="space-y-4"
		>
			{#if inventoryId}
				<input type="hidden" name="id" value={inventoryId} />
			{/if}

			<!-- Date Field -->
			<div class="space-y-2">
				<Label for="date" class="text-sm font-medium">
					Date <span class="text-destructive">*</span>
				</Label>
				<DateInput required disabled={isSubmitting} class="w-full" />
			</div>

			<!-- Stock Type Select -->
			<div class="space-y-2">
				<Label for="stock-type" class="text-sm font-medium">Stock Type</Label>
				<Select.Root
					value={stockType || ''}
					onValueChange={(v: string) => {
						stockType = v === '' ? null : (v as 'fresh' | 'closing' | 'opening');
					}}
				>
					<Select.Trigger id="stock-type" disabled={isSubmitting}>
						{#if stockType}
							<span class="capitalize">{stockType}</span>
						{:else}
							<span class="text-muted-foreground">Select stock type</span>
						{/if}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						<Select.Item value="fresh">Fresh Stock</Select.Item>
						<Select.Item value="opening">Opening Stock</Select.Item>
						<Select.Item value="closing">Closing Stock</Select.Item>
					</Select.Content>
				</Select.Root>
				<input type="hidden" name="stock_type" value={stockType || ''} />
				<p class="text-xs text-muted-foreground">Optional - categorize the type of stock</p>
			</div>

			<!-- Quantity Field -->
			<div class="space-y-2">
				<Label for="stock" class="text-sm font-medium">
					Quantity (pieces) <span class="text-destructive">*</span>
				</Label>
				<Input
					id="stock"
					type="number"
					name="stock"
					inputmode="numeric"
					bind:value={stock}
					placeholder="0"
					min="0"
					required
					disabled={isSubmitting}
					class="w-full"
				/>
			</div>

			<!-- Rate Field -->
			<div class="space-y-2">
				<Label for="rate" class="text-sm font-medium">
					Rate (per piece) <span class="text-destructive">*</span>
				</Label>
				<div class="relative">
					<span class="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
						>₹</span
					>
					<Input
						id="rate"
						type="number"
						name="rate"
						inputmode="decimal"
						bind:value={rate}
						placeholder="0.00"
						step="0.01"
						min="0"
						required
						disabled={isSubmitting}
						class="w-full pl-7"
					/>
				</div>
			</div>

			<!-- Amount Display -->
			<div class="space-y-2 rounded-lg border border-muted bg-muted/50 p-3">
				<p class="text-xs font-medium text-muted-foreground">Total Amount</p>
				<p class="text-2xl font-bold">
					₹<span>{amount}</span>
				</p>
				<input type="hidden" name="amount" value={amount} />
			</div>

			<Dialog.Footer class="gap-2 sm:gap-0">
				<Button
					type="button"
					variant="outline"
					onclick={() => handleOpenChange(false)}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="mr-2">Saving...</span>
					{:else}
						{inventoryId ? 'Update' : 'Add'} Log
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
