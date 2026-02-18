<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	import '../app.css';

	let { children } = $props();

	onMount(() => {
		auth.init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
