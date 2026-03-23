<script lang="ts">
    import {AtSignIcon, Lock} from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { DecorIcon } from "$lib/components/ui/decor-icon";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";
	import { cn } from "$lib/helpers/shadcn";
	import type { HTMLAttributes } from "svelte/elements";

	type AuthTwoProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		emailPlaceholder?: string;
	};

	let {
		class: className = "",
		emailPlaceholder = "email@example.com",
		...restProps
	}: AuthTwoProps = $props();
</script>

<div
	class={cn(
		"relative flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-8",
		className
	)}
	{...restProps}
>
	<div
		class={cn(
			"relative flex w-full max-w-sm flex-col justify-between p-6 md:p-8",
			"dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]"
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
				<form class="space-y-2">
					<InputGroup>
						<InputGroupInput placeholder={emailPlaceholder} type="email" />
						<InputGroupAddon align="inline-start">
							<AtSignIcon />
						</InputGroupAddon>
					</InputGroup>
                    <InputGroup>
                        <InputGroupInput placeholder={emailPlaceholder} type="password" />
                        <InputGroupAddon align="inline-start">
                            <Lock />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <Lock />
                        </InputGroupAddon>
                    </InputGroup>
					<Button class="w-full" size="sm" type="button">Login</Button>
				</form>
            </div>
		</div>
	</div>
</div>
