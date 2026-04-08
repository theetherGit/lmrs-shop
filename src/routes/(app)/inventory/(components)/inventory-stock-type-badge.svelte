<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	interface Props {
		type: string | null | undefined;
	}

	const { type }: Props = $props();

	const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		fresh: 'default',
		opening: 'secondary',
		closing: 'destructive'
	};

	const labelMap: Record<string, string> = {
		fresh: 'Fresh',
		opening: 'Opening',
		closing: 'Closing'
	};

	const variant = $derived(type ? variantMap[type] || 'outline' : 'outline');
	const label = $derived(type ? labelMap[type] || type : 'N/A');
</script>

<Badge {variant} class="capitalize">
	{label}
</Badge>
