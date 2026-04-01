<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as Table from '$lib/components/ui/table';
	import AddFactorIcon from '@tabler/icons-svelte/icons/circle-dashed-plus';
	import NoFactorIcon from '@tabler/icons-svelte/icons/tools-off';
	import Plus from '@tabler/icons-svelte/icons/plus';
	import Edit from '@tabler/icons-svelte/icons/edit';
	import type { PageProps } from './$types';
	import { IsMobile } from '$lib/helpers/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import {
		createFactorTypeRemoteFunction,
		updateFactorTypeRemoteFunction
	} from '$lib/remote-functions/factor-type.remote.js';
	import CreateOrUpdateFactorTypeForm from './(components)/add-factor-type-form.svelte';

	let { data }: PageProps = $props();

	const isMobile = new IsMobile();
	let FormView:
		| typeof import('$lib/components/ui/dialog/index.js')
		| typeof import('$lib/components/ui/drawer/index.js')
		| null = $state(null);
	let showFormView: boolean = $state(false);
	let formRemoteFunction:
		| typeof createFactorTypeRemoteFunction
		| typeof updateFactorTypeRemoteFunction = $state(createFactorTypeRemoteFunction);
	let formData: Record<string, unknown> | null = $state(null);

	onMount(async () => {
		const views = {
			dialog: () => import('$lib/components/ui/dialog/index.js'),
			drawer: () => import('$lib/components/ui/drawer/index.js')
		};
		const view = isMobile.current ? 'drawer' : 'dialog';
		const module = await views[view]();
		FormView = module;
	});

	function openAddNewFactorTypeForm() {
		formRemoteFunction = createFactorTypeRemoteFunction;
		formData = null;
		showFormView = true;
	}

	function openEditFactorTypeForm(factorTypeConfig: Record<string, unknown>) {
		formRemoteFunction = updateFactorTypeRemoteFunction;
		formData = factorTypeConfig;
		showFormView = true;
	}
</script>

<div class="w-full">
	{#if data && data.factorTypes && data.factorTypes.length > 0}
		<div class="flex flex-col gap-y-4">
			<Card.Root class="w-full">
				<Card.Content>
					<div class="flex w-full flex-col gap-y-4 md:flex-row md:items-center md:justify-between">
						<div class="w-full">
							<h2 class="text-2xl font-semibold tracking-tight">Factor Types</h2>
							<p class="text-sm text-muted-foreground">
								Manage factor types that affect revenue forecasting
							</p>
						</div>
						<div class="flex w-full flex-row items-center justify-between gap-2 md:justify-end">
							<Button variant="secondary" size="lg" onclick={openAddNewFactorTypeForm}>
								<Plus />
								New Factor Type
							</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="p-0">
					<div class="overflow-x-auto">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Category</Table.Head>
									<Table.Head>Sub-Category</Table.Head>
									<Table.Head>Factor Slug</Table.Head>
									<Table.Head class="text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.factorTypes as factorType (factorType.id)}
									<Table.Row>
										<Table.Cell class="font-medium">{factorType.category}</Table.Cell>
										<Table.Cell>{factorType.subCategory}</Table.Cell>
										<Table.Cell class="font-mono text-xs">{factorType.factorSlug}</Table.Cell>
										<Table.Cell class="text-right">
											<Button
												variant="ghost"
												size="sm"
												onclick={() => openEditFactorTypeForm(factorType)}
												class="gap-2"
											>
												<Edit class="h-4 w-4" />
												Edit
											</Button>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{:else}
		<Card.Root class="min-h-[calc(100vh-9rem)]">
			<Card.Header>
				<Card.Title>Factor Types</Card.Title>
				<Card.Description>Configure factor types for revenue forecasting</Card.Description>
			</Card.Header>
			<Card.Content class="flex min-h-[calc(100vh-17rem)] items-center justify-center">
				<Empty.Root class="min-h-[calc(100vh-17rem)] border-2">
					<Empty.Media>
						<NoFactorIcon class="h-6 w-6 text-muted-foreground" />
					</Empty.Media>
					<Empty.Title>No factor types found</Empty.Title>
					<Empty.Description>Start by creating your first factor type.</Empty.Description>
					<Empty.Content>
						<Button onclick={openAddNewFactorTypeForm}>
							<AddFactorIcon />
							<span class="flex items-center gap-2"> Add Factor Type</span>
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
						>{formData
							? `Update Factor Type: ${formData.category} - ${formData.subCategory}`
							: 'Create Factor Type'}</FormView.Title
					>
					<FormView.Description
						>Define new factor types that impact revenue forecasting.</FormView.Description
					>
				</FormView.Header>
				<CreateOrUpdateFactorTypeForm
					bind:isDialogOrDrawerOpen={showFormView}
					remoteForm={formRemoteFunction}
					factorTypeData={formData}
				/>
			</ScrollArea>
		</FormView.Content>
	</FormView.Root>
{/if}
