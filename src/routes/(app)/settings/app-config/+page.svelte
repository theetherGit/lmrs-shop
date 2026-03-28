<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus, TrendingUpIcon } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import DatabaseCog from '@tabler/icons-svelte/icons/database-cog';
	import { Button } from '$lib/components/ui/button';
	import { IsMobile } from '$lib/helpers/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import CreateConfigForm from './(components)/create-config-form.svelte';

	let { data }: PageProps = $props();
	const isMobile = new IsMobile();
	let FormView:
		| typeof import('$lib/components/ui/dialog/index.js')
		| typeof import('$lib/components/ui/drawer/index.js')
		| null = $state(null);
	let showConfigForm: boolean = $state(true);

	onMount(async () => {
		const views = {
			dialog: () => import('$lib/components/ui/dialog/index.js'),
			drawer: () => import('$lib/components/ui/drawer/index.js')
		};
		const view = isMobile.current ? 'drawer' : 'dialog';
		const module = await views[view]();
		FormView = module;
	});
</script>

<div class="flex w-full flex-col">
	{#if data && data.config}
		<div
			class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
		>
			<Card.Root class="@container/card">
				<Card.Header>
					<Card.Description>Estimated Cost Price</Card.Description>
					<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						₹ {data.config.estimatedCostPrice}
					</Card.Title>
					<Card.Action>
						<Badge variant="outline">
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</Card.Action>
				</Card.Header>
				<!--                <Card.Footer class="flex-col items-start gap-1.5 text-sm">-->
				<!--                    <div class="line-clamp-1 flex gap-2 font-medium">-->
				<!--                        Trending up this month <TrendingUpIcon class="size-4" />-->
				<!--                    </div>-->
				<!--                    <div class="text-muted-foreground">-->
				<!--                        Visitors for the last 6 months-->
				<!--                    </div>-->
				<!--                </Card.Footer>-->
			</Card.Root>
		</div>
	{:else}
		<div
			class="flex min-h-[calc(100svh-9rem)] w-full max-w-full items-center justify-center overflow-x-hidden bg-background text-foreground"
		>
			<Empty.Root>
				<Empty.Header>
					<Empty.Media variant="icon">
						<DatabaseCog />
					</Empty.Media>
					<Empty.Title>No app config</Empty.Title>
					<Empty.Description>Create a new config</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button onclick={() => (showConfigForm = !showConfigForm)}>
						<Plus />
						Create Config
					</Button>
				</Empty.Content>
			</Empty.Root>
		</div>
	{/if}
</div>

{#if FormView}
	<FormView.Root bind:open={showConfigForm}>
		<FormView.Content class="sm:max-w-[425px]">
			<FormView.Header>
				<FormView.Title>Create config</FormView.Title>
				<FormView.Description>We need this config for app to work properly.</FormView.Description>
			</FormView.Header>
			<CreateConfigForm />
		</FormView.Content>
	</FormView.Root>
{/if}
