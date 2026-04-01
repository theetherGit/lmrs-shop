<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import AddMenuIcon from '@tabler/icons-svelte/icons/circle-dashed-plus';
	import UserWarningIcon from '@tabler/icons-svelte/icons/user-exclamation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="w-full">
	<Card.Root class="min-h-[calc(100vh-9rem)]">
		<Card.Header>
			<Card.Title>User Settings</Card.Title>
			<Card.Description>Coming Soon...</Card.Description>
		</Card.Header>
		<Card.Content class="flex min-h-[calc(100vh-17rem)] items-center justify-center">
			<Empty.Root class="min-h-[calc(100vh-17rem)] border-2">
				<Empty.Media>
					<UserWarningIcon class="h-6 w-6 text-muted-foreground" />
				</Empty.Media>
				<Empty.Title>You are our best user</Empty.Title>
				<Empty.Description>No user settings available.</Empty.Description>
				<Empty.Content>
					<Button disabled onclick={() => alert('Not implemented yet')}>
						<AddMenuIcon />
						<span class="flex items-center gap-2"> Edit Profile</span>
					</Button>
				</Empty.Content>
			</Empty.Root>
		</Card.Content>
	</Card.Root>
</div>
