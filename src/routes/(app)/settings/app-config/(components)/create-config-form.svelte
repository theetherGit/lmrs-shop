<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@tabler/icons-svelte/icons/search';
	import { addAppConfigRemoteFunction } from '$lib/remote-functions/app-config.remote';
	import type { RemoteFormEnhanceParams } from '$lib/remote-functions/utils';

	let { fields } = addAppConfigRemoteFunction;

	async function enhancedForm({
		form,
		submit
	}: RemoteFormEnhanceParams<typeof addAppConfigRemoteFunction.enhance>) {}
</script>

<form class="grid items-start gap-4" {...addAppConfigRemoteFunction.enhance(enhancedForm)}>
	<Field.Group>
		<Field.Set>
			<Field.Group>
				<Field.Field>
					<Field.Label for="checkout-7j9-card-name-43j">Estimated Cost Price (ECP)</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input type="number" placeholder="10.0" />
						<InputGroup.Addon>
							<SearchIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">Per piece</InputGroup.Addon>
					</InputGroup.Root>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
</form>
