<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		createFactorTypeRemoteFunction,
		updateFactorTypeRemoteFunction
	} from '$lib/remote-functions/factor-type.remote.js';
	import type { RemoteFormEnhanceParams } from '$lib/remote-functions/utils';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	type RemoteFormType =
		| typeof createFactorTypeRemoteFunction
		| typeof updateFactorTypeRemoteFunction;

	type Props = {
		isDialogOrDrawerOpen?: boolean;
		remoteForm: RemoteFormType;
		factorTypeData?: {
			id?: string;
			category?: string;
			subCategory?: string;
			factorSlug?: string;
		} | null;
	};

	let {
		isDialogOrDrawerOpen = $bindable(false),
		remoteForm,
		factorTypeData = null
	}: Props = $props();

	let { fields, result } = $derived(remoteForm);

	let formState = $state({
		isLoading: false
	});

	onMount(() => {
		if (factorTypeData) {
			const dataToSet: Record<string, string> = {};
			if (factorTypeData.id) dataToSet.id = factorTypeData.id;
			if (factorTypeData.category) dataToSet.category = factorTypeData.category;
			if (factorTypeData.subCategory) dataToSet.subCategory = factorTypeData.subCategory;
			if (factorTypeData.factorSlug) dataToSet.factorSlug = factorTypeData.factorSlug;
			fields.set(dataToSet);
		}
	});

	async function enhancedForm({
		form,
		submit
	}: RemoteFormEnhanceParams<typeof remoteForm.enhance>) {
		formState.isLoading = true;
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
			<Field.Group class="grid grid-cols-1 gap-4">
				{#if factorTypeData && 'id' in factorTypeData && factorTypeData.id}
					<input type="hidden" name="id" value={factorTypeData.id} />
				{/if}
				<!-- Category field -->
				<Field.Field>
					<Field.Label>Category</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							placeholder="e.g., Weather, Exam, Holiday"
							{...fields.category.as('text')}
						/>
					</InputGroup.Root>
					{#if fields.category.issues()?.length}
						{#each fields.category.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>

				<!-- Sub-Category field -->
				<Field.Field>
					<Field.Label>Sub-Category</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							placeholder="e.g., Heavy Rain, Core Exam, Mid Sem Break"
							{...fields.subCategory.as('text')}
						/>
					</InputGroup.Root>
					{#if fields.subCategory.issues()?.length}
						{#each fields.subCategory.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>

				<!-- Factor Slug field -->
				<Field.Field>
					<Field.Label>Factor Slug</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							placeholder="e.g., weather_heavy_rain, exam_core"
							{...fields.factorSlug.as('text')}
						/>
					</InputGroup.Root>
					{#if fields.factorSlug.issues()?.length}
						{#each fields.factorSlug.issues() as error (error)}
							<Field.Error>{error.message}</Field.Error>
						{/each}
					{/if}
				</Field.Field>

				<!-- Submit button -->
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
							{factorTypeData ? 'Updating' : 'Creating'} factor type...
						{:else}
							{factorTypeData ? 'Update' : 'Create'} Factor Type
						{/if}
					</Button>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
</form>
