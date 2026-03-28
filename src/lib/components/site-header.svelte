<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import HomeIcon from '@tabler/icons-svelte/icons/assembly';

	let breadcrumbs = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((path, index, array) => {
				return {
					label: path.replace(/-/g, ' '),
					href: '/' + array.slice(0, index + 1).join('/')
				};
			})
	);
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize">
						<HomeIcon class="size-4!" />
					</Breadcrumb.Page>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				{#each breadcrumbs as crumb, index (crumb.href)}
					{#if index !== breadcrumbs.length - 1}
						<Breadcrumb.Item>
							<Breadcrumb.Link class="capitalize" href={crumb.href}>
								{crumb.label}
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
					{:else}
						<Breadcrumb.Item>
							<Breadcrumb.Page class="capitalize">
								{crumb.label}
							</Breadcrumb.Page>
						</Breadcrumb.Item>
					{/if}
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<div class="ms-auto flex items-center gap-2">
			<Button
				href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
				variant="ghost"
				size="sm"
				class="hidden sm:flex dark:text-foreground"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</Button>
		</div>
	</div>
</header>
