<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { CalendarDate, type DateValue } from '@internationalized/date';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import type { RemoteFormField } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as Field from './ui/field/index.js';

	const today = new Date();

	const id = $props.id();
	let value = $state<DateValue | undefined>(
		new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
	);
	let open = $state(false);

	let { field, label }: { field: RemoteFormField<string>; label?: string } = $props();
</script>

<Field.Field class="flex w-full flex-col gap-3">
	<Field.Label for="{id}-date" class="px-1">{label ?? 'Date'}</Field.Label>
	<div class="relative flex gap-2">
		<InputGroup.Root>
			<InputGroup.Input
				id="{id}-date"
				placeholder="mm-dd-yyyy"
				class="bg-background pe-10"
				{...field.as('text')}
				bind:value
				onkeydown={(e) => {
					if (e.key === 'ArrowDown') {
						e.preventDefault();
						open = true;
					}
				}}
			/>
		</InputGroup.Root>
		{#if field.issues()?.length}
			{#each field.issues() as error (error)}
				<Field.Error>{error.message}</Field.Error>
			{/each}
		{/if}
		<Popover.Root bind:open>
			<Popover.Trigger id="{id}-date-picker">
				{#snippet child({ props })}
					<Button {...props} variant="ghost" class="absolute end-2 top-1/2 size-6 -translate-y-1/2">
						<CalendarIcon class="size-3.5" />
						<span class="sr-only">Select date</span>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content
				class="w-auto overflow-hidden p-0"
				align="end"
				alignOffset={-8}
				sideOffset={10}
			>
				<Calendar
					type="single"
					bind:value
					captionLayout="dropdown"
					onValueChange={() => {
						open = false;
					}}
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
</Field.Field>
