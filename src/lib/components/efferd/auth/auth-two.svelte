<script lang="ts">
	import { AtSignIcon, Lock } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { DecorIcon } from '$lib/components/ui/decor-icon';
	import { InputGroup, InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { cn } from '$lib/helpers/shadcn';
	import type { HTMLAttributes } from 'svelte/elements';
	import { loginRemoteFunction } from '$lib/remote-functions/login.remote.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { slide } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import type { RemoteFormEnhanceParams } from '$lib/remote-functions/utils';

	type AuthTwoProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		emailPlaceholder?: string;
	};

	let {
		class: className = '',
		emailPlaceholder = 'email@example.com',
		...restProps
	}: AuthTwoProps = $props();

	let formState = $state({
		isLoading: false
	});

	let { fields, result } = loginRemoteFunction;

	async function enhancedFormLogin({
		form,
		submit
	}: RemoteFormEnhanceParams<typeof loginRemoteFunction.enhance>) {
		formState.isLoading = true;
		try {
			await submit();
			if (result?.success) {
				form.reset();
			}
		} catch (error) {
			console.log(error);
		} finally {
			formState.isLoading = false;
		}
	}
</script>

<div
	class={cn(
		'relative flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-8',
		className
	)}
	{...restProps}
>
	<div
		class={cn(
			'relative flex w-full max-w-sm flex-col justify-between p-6 md:p-8',
			'dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]'
		)}
	>
		<div class="absolute -inset-y-6 -left-px w-px bg-border"></div>
		<div class="absolute -inset-y-6 -right-px w-px bg-border"></div>
		<div class="absolute -inset-x-6 -top-px h-px bg-border"></div>
		<div class="absolute -inset-x-6 -bottom-px h-px bg-border"></div>

		<DecorIcon position="top-left" />
		<DecorIcon position="bottom-right" />

		<div class="w-full max-w-sm animate-in space-y-8">
			<div class="flex flex-col space-y-1">
				<h1 class="text-2xl font-bold tracking-wide">LMRS Shop</h1>
				<p class="text-base text-muted-foreground">Login with your account.</p>
			</div>

			<div class="space-y-4">
				<form
					{...loginRemoteFunction.enhance(enhancedFormLogin)}
					class="space-y-2"
					onchange={() => loginRemoteFunction.validate()}
				>
					<Field.Group>
						<Field.Field>
							<Field.Label>Email</Field.Label>
							<InputGroup>
								<InputGroupInput
									placeholder={emailPlaceholder}
									{...fields.email.as('email')}
									type="email"
								/>
								<InputGroupAddon align="inline-start">
									<AtSignIcon />
								</InputGroupAddon>
							</InputGroup>
							{#if fields.email.issues()?.length}
								{#each fields.email.issues() as error (error)}
									<Field.Error>{error.message}</Field.Error>
								{/each}
							{/if}
						</Field.Field>
						<Field.Field>
							<Field.Label>Password</Field.Label>
							<InputGroup>
								<InputGroupInput
									placeholder="************"
									{...fields.password.as('password')}
									type="password"
									autocomplete="current-password"
								/>
								<InputGroupAddon align="inline-start">
									<Lock />
								</InputGroupAddon>
							</InputGroup>
							{#if fields.password.issues()?.length}
								{#each fields.password.issues() as error (error)}
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
									Logging...
								{:else}
									Login
								{/if}
							</Button>
						</Field.Field>
					</Field.Group>
				</form>
			</div>
		</div>
	</div>
</div>
