<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		createShopMenuRemoteFunction,
		updateShopMenuRemoteFunction
	} from '$lib/remote-functions/menu.remote.js';
	import type { RemoteFormEnhanceParams } from '$lib/remote-functions/utils';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import RupeeIcon from '@tabler/icons-svelte/icons/currency-rupee';

	type RemoteFormType = typeof createShopMenuRemoteFunction | typeof updateShopMenuRemoteFunction;

	type Props = {
		isDialogOrDrawerOpen?: boolean;
		remoteForm: RemoteFormType;
		menuData?: {
			id?: string;
			name?: string;
			price?: number;
			pieces?: number;
			isActive?: boolean;
		} | null;
	};

	let { isDialogOrDrawerOpen = $bindable(false), remoteForm, menuData = null }: Props = $props();

	let { fields, result } = $derived(remoteForm);

	let formState = $state({
		isLoading: false
	});

	onMount(() => {
		if (menuData) {
			const dataToSet: Record<string, string | number | boolean> = {};
			if (menuData.id) dataToSet.id = menuData.id;
			if (menuData.name) dataToSet.name = menuData.name;
			if (menuData.price !== undefined) dataToSet.price = menuData.price;
			if (menuData.pieces !== undefined) dataToSet.pieces = menuData.pieces;
			if (menuData.isActive !== undefined) dataToSet.isActive = menuData.isActive;
			fields.set(dataToSet);
		} else {
			fields.set({
				isActive: true
			});
		}
	});

	async function enhancedForm({
		form,
		data,
		submit
	}: RemoteFormEnhanceParams<typeof remoteForm.enhance>) {
		formState.isLoading = true;
		console.log(JSON.stringify(data, null, 2));
		try {
			await submit();
			if (result?.success === true) {
				form.reset();
				toast.success(result?.message ?? 'Operation successful');
				await invalidateAll();
				isDialogOrDrawerOpen = false;
			} else if (result?.success === false) {
				toast.error(result?.message ?? 'Operation failed');
			} else {
				toast.warning('Error while getting form result.');
			}
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('An unexpected error occurred');
		} finally {
			formState.isLoading = false;
		}
	}
</script>

<form
	class="grid items-start gap-4"
	{...remoteForm.enhance(enhancedForm)}
	onchange={() => remoteForm.validate()}
>
	<Field.Group class="mt-5">
		<Field.Set>
			<Field.Group class="grid grid-cols-1">
				{#if menuData && 'id' in menuData && menuData.id}
					<input type="hidden" name="id" value={menuData.id} />
				{/if}
				<!---Name of serving -->
				<Field.Field>
					<Field.Label>Name</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input placeholder="Rs.25 Plate" {...fields.name.as('text')} />
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
					</InputGroup.Root>
					{#if fields.name.issues()?.length}
						{#each fields.name.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Price of the serving -->
				<Field.Field>
					<Field.Label>Price</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input step="0.01" placeholder="10.0" {...fields.price.as('number')} />
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
						{#if fields.pieces.value()}
							<InputGroup.Addon align="inline-end">
								For {fields.pieces.value()} piece(s)
							</InputGroup.Addon>
						{/if}
					</InputGroup.Root>
					{#if fields.price.issues()?.length}
						{#each fields.price.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<!---Number of pieces per serving -->
				<Field.Field>
					<Field.Label>No. of Pieces</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input step="0.01" placeholder="1" {...fields.pieces.as('number')} />
						<InputGroup.Addon>
							<RupeeIcon />
						</InputGroup.Addon>
						{#if fields.pieces.value() && fields.price.value()}
							<InputGroup.Addon align="inline-end">
								&#8377;{((fields.price.value() || 1) / (fields.pieces.value() ?? 1)).toFixed(
									2
								)}/piece
							</InputGroup.Addon>
						{/if}
					</InputGroup.Root>
					{#if fields.pieces.issues()?.length}
						{#each fields.pieces.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<Field.Field orientation="horizontal">
					<input
						type="checkbox"
						name={fields.isActive.as('checkbox').name}
						checked={fields.isActive.value()}
						onchange={(e) => fields.isActive.set(e.currentTarget.checked)}
						aria-invalid={!!fields.isActive.issues()?.length}
					/>
					<Field.Label>Currenly serving this serving?</Field.Label>
					{#if fields.isActive.issues()?.length}
						{#each fields.isActive.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
				<Field.Field>
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
							{menuData ? 'Updating' : 'Creating'} menu item...
						{:else}
							{menuData ? 'Update' : 'Create'} Menu Item
						{/if}
					</Button>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
</form>
