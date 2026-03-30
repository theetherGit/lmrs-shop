<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card/index.js';
	import Plus from '@lucide/svelte/icons/plus';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
	import Pencil from '@lucide/svelte/icons/pencil';
	import type { PageProps } from './$types';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import DatabaseCog from '@tabler/icons-svelte/icons/database-cog';
	import { Button } from '$lib/components/ui/button';
	import { IsMobile } from '$lib/helpers/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import CreateConfigForm from './(components)/create-config-form.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { data }: PageProps = $props();
	const isMobile = new IsMobile();
	let FormView:
		| typeof import('$lib/components/ui/dialog/index.js')
		| typeof import('$lib/components/ui/drawer/index.js')
		| null = $state(null);
	let showConfigForm: boolean = $state(false);

	onMount(async () => {
		const views = {
			dialog: () => import('$lib/components/ui/dialog/index.js'),
			drawer: () => import('$lib/components/ui/drawer/index.js')
		};
		const view = isMobile.current ? 'drawer' : 'dialog';
		const module = await views[view]();
		FormView = module;
	});

	const getStatDiffCurrentVsOld = (
		curr: number,
		prev: number
	): {
		value: number;
		diff: number;
		percent: number;
		state: 'noChange' | 'up' | 'down';
	} | null => {
		if (prev === 0) return null;
		const diff = curr - prev;
		const percent = (diff / prev) * 100;
		return {
			value: curr,
			diff,
			percent: parseFloat(percent.toFixed(1)),
			state: curr.toFixed(2) === prev.toFixed(2) ? 'noChange' : curr > prev ? 'up' : 'down'
		};
	};

	const getBadgeVariant = (state: 'up' | 'down' | 'noChange' | null, reverse = false) => {
		if (state === 'noChange') return 'secondary';
		if (state === 'up') return reverse ? 'destructive' : 'default';
		if (state === 'down') return reverse ? 'default' : 'destructive';
		return 'default';
	};

	type ConfigData = {
		title: string;
		accessor: keyof typeof data.config;
		reverse: boolean;
		suffix: '%' | '/piece';
	};

	const configData: ConfigData[] = [
		{
			title: "Maker's Price",
			accessor: 'makerRate',
			reverse: true,
			suffix: '/piece'
		},
		{
			title: 'Estimated Cost Price',
			accessor: 'estimatedCostPrice',
			reverse: true,
			suffix: '/piece'
		},
		{
			title: 'Minimum Selling Price',
			accessor: 'minSellingPrice',
			reverse: false,
			suffix: '/piece'
		},
		{
			title: 'Maximum Selling Price',
			accessor: 'maxSellingPrice',
			reverse: false,
			suffix: '/piece'
		},
		{
			title: 'Growth Rate',
			accessor: 'growthRate',
			reverse: false,
			suffix: '%'
		}
	];
</script>

{#snippet TrendBadgeIcon(stats: ReturnType<typeof getStatDiffCurrentVsOld>, reverse = false)}
	{#if stats && stats.diff !== 0 && stats.state !== 'noChange'}
		<Card.Action>
			<Badge variant={getBadgeVariant(stats.state, reverse)}>
				{#if stats.state === 'up'}
					<TrendingUpIcon />
				{:else if stats.state === 'down'}
					<TrendingDownIcon />
				{/if}
				{stats.percent} %
			</Badge>
		</Card.Action>
	{/if}
{/snippet}

{#snippet StateDescription(stats: ReturnType<typeof getStatDiffCurrentVsOld>, title: string)}
	{#if stats}
		<div class="line-clamp-1 flex gap-2 font-medium">
			{title}
			{#if stats.state === 'noChange'}
				hasn't changed.
			{:else if stats.state === 'up'}
				is going up
				<TrendingUpIcon class="size-4" />
			{:else if stats.state === 'down'}
				is going down
				<TrendingDownIcon class="size-4" />
			{/if}
		</div>
		<div class="text-muted-foreground">
			Price {stats && stats.state ? 'hiked' : 'lowered'} by &#8377; {stats.diff.toFixed(2)}
		</div>
	{/if}
{/snippet}

<div class="gap-y- flex w-full flex-col gap-y-4">
	{#if data && data.config}
		<div class="flex flex-row items-center justify-between">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight">App Config</h2>
				<p class="text-sm text-muted-foreground">Manage your app config and settings here.</p>
			</div>
			<div>
				<Button variant="default" size="lg" onclick={() => (showConfigForm = !showConfigForm)}>
					<Pencil />
					Edit
				</Button>
				<Button variant="secondary" size="lg" onclick={() => (showConfigForm = !showConfigForm)}>
					<Plus />
					New Config
				</Button>
			</div>
		</div>
		<div
			class="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card"
		>
			{#each configData as { title, accessor, reverse, suffix } (accessor)}
				{@const configItem = data.config[accessor]}
				<Card.Root class="@container/card">
					{@const stats = getStatDiffCurrentVsOld(configItem, data.oldConfig?.[accessor] ?? 0)}
					<Card.Header>
						<Card.Description>{title}</Card.Description>
						<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							₹ {configItem} <span class="text-sm font-light opacity-55">{suffix}</span>
						</Card.Title>
						{@render TrendBadgeIcon(stats, reverse)}
					</Card.Header>
					<Card.Footer class="flex-col items-start gap-1.5 text-sm">
						{@render StateDescription(stats, title)}
					</Card.Footer>
				</Card.Root>
			{/each}
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
	<FormView.Root bind:open={showConfigForm} direction={isMobile.current ? 'bottom' : 'right'}>
		<FormView.Content
			interactOutsideBehavior="close"
			preventScroll={false}
			class="max-w-[60svw] min-w-[50svw]"
		>
			<ScrollArea class="h-full xl:pr-0">
				<FormView.Header>
					<FormView.Title>Create config</FormView.Title>
					<FormView.Description>We need this config for app to work properly.</FormView.Description>
				</FormView.Header>
				<CreateConfigForm bind:isDialogOrDrawerOpen={showConfigForm} />
			</ScrollArea>
		</FormView.Content>
	</FormView.Root>
{/if}
