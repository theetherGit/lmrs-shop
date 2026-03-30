<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import RupeeIcon from '@tabler/icons-svelte/icons/currency-rupee';
	import TrendingUp from '@tabler/icons-svelte/icons/trending-up';
	import Shield from '@tabler/icons-svelte/icons/shield';
	import { addAppConfigRemoteFunction } from '$lib/remote-functions/app-config.remote';
	import type { RemoteFormEnhanceParams } from '$lib/remote-functions/utils';
	import DateInput from '$lib/components/date-input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { appConfigCreateSchema } from '$lib/models/zod-schema/app-config.schema';

	let { isDialogOrDrawerOpen = $bindable(false) }: { isDialogOrDrawerOpen: boolean } = $props();

	let { fields } = addAppConfigRemoteFunction;
	let { result, pending } = $derived(addAppConfigRemoteFunction);

	let formState = $state({
		isLoading: false
	});

	async function enhancedForm({
		form,
		submit
	}: RemoteFormEnhanceParams<typeof addAppConfigRemoteFunction.enhance>) {
		formState.isLoading = true;
		try {
			await submit();
			switch (result?.success) {
				case true:
					form.reset();
					toast.success(result?.message as string);
					await invalidateAll();
					isDialogOrDrawerOpen = false;
					break;
				case false:
					toast.error(result?.message as string);
					break;
				default:
					toast.warning('Error while getting form result.');
					break;
			}
		} catch (error) {
			console.log(error);
		} finally {
			formState.isLoading = false;
		}
	}
</script>

<form
	class="grid items-start gap-4"
	{...addAppConfigRemoteFunction.preflight(appConfigCreateSchema).enhance(enhancedForm)}
	onchange={() => addAppConfigRemoteFunction.validate()}
>
	<Field.Group class="mt-5">
		<Field.Set>
			<Field.Group class="grid grid-cols-1 lg:grid-cols-2">
				<Input {...fields.id.as('hidden', 'new')} />
				<!---Date from which this config is going to be live -->
				<DateInput field={fields.date} label="Date" />
				<!---Maker Price -->
				<Field.Field>
					<Field.Label>Maker Price</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							min="4"
							step="0.01"
							placeholder="5"
							{...fields.makerRate.as('number')}
						/>
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">Per piece</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.makerRate.issues()?.length}
						{#each fields.makerRate.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Estimated Cost Price -->
				<Field.Field>
					<Field.Label>Estimated Cost Price (ECP)</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							step="0.01"
							placeholder="10.0"
							{...fields.estimatedCostPrice.as('number')}
						/>
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">Per piece</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.estimatedCostPrice.issues()?.length}
						{#each fields.estimatedCostPrice.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Minimum Selling Price -->
				<Field.Field>
					<Field.Label>Minimum Selling Price</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							step="0.01"
							placeholder="10.0"
							{...fields.minSellingPrice.as('number')}
						/>
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">Per piece</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.minSellingPrice.issues()?.length}
						{#each fields.minSellingPrice.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Maximum Selling Price -->
				<Field.Field>
					<Field.Label>Maximum Selling Price</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							step="0.01"
							placeholder="10.0"
							{...fields.maxSellingPrice.as('number')}
						/>
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">Per piece</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.maxSellingPrice.issues()?.length}
						{#each fields.maxSellingPrice.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Growth Rate -->
				<Field.Field>
					<Field.Label>Growth Rate</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							min="1"
							max="5"
							step="0.01"
							placeholder="1.1"
							{...fields.growthRate.as('number')}
						/>
						<InputGroup.Addon>
							<TrendingUp />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">%</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.growthRate.issues()?.length}
						{#each fields.growthRate.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Safety Buffer -->
				<Field.Field>
					<Field.Label>Safety Buffer</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							min="1"
							max="5"
							placeholder="1.1"
							step="0.01"
							{...fields.safetyBuffer.as('number')}
						/>
						<InputGroup.Addon>
							<Shield />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">%</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.safetyBuffer.issues()?.length}
						{#each fields.safetyBuffer.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<Field.Field class="lg:col-span-2 lg:w-full">
					<Button
						class="w-full"
						size="default"
						type="submit"
						disabled={formState.isLoading || !!fields.allIssues()}
					>
						{#if formState.isLoading}
							<div
								class="inline"
								transition:slide={{
									axis: 'x',
									easing: sineInOut
								}}
							>
								<Spinner class="mr-1" />
							</div>
						{/if}
						{#if formState.isLoading}
							Creating config...
						{:else}
							Create Config
						{/if}
					</Button>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
</form>
