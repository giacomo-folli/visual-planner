<script lang="ts">
	import favicon from '$lib/assets/icon.png';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="visual planner 2.0 - Plan your year visually" />
	<meta name="theme-color" content="#ffffff" />
	<meta property="og:title" content="Visual Planner" />
	<meta property="og:description" content="visual planner 2.0 - Plan your year visually" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="p-2">
	{@render children()}
</div>
