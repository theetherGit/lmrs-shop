<script lang="ts">
	import { FullWidthDivider } from "$lib/components/ui/full-width-divider";
	import * as Empty from "$lib/components/ui/empty/index.js";
	import { Button } from "$lib/components/ui/button";
	import { HomeIcon } from "@lucide/svelte";

    type NotFoundedProps = {
        statusCode: number
        message: string
    }

    let {statusCode, message}: NotFoundedProps = $props()
</script>

<div class="flex w-full items-center justify-center">
	<div class="flex h-screen items-center border-x">
		<div>
			<FullWidthDivider />
			<Empty.Root>
				<Empty.Header>
					<Empty.Title class="font-mono text-8xl font-black">{statusCode || '404'}</Empty.Title>
					<Empty.Description class="text-balance">
                        {message || "The page you're looking for might have been moved or doesn't exist."}
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<div class="flex gap-2">
						<Button href="/dashboard">
							<HomeIcon data-icon="inline-start" />
							Go Home
						</Button>
					</div>
				</Empty.Content>
			</Empty.Root>
			<FullWidthDivider />
		</div>
	</div>
</div>
