<script lang="ts">
	import favicon from '$lib/assets/icon.png';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="p-2">
	{@render children()}
</div>
