<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import LoginHero from '$lib/components/LoginHero.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		auth.init();

		if (auth.isAuthenticated) {
			await goto('/planner');
		}
	});
</script>

<LoginHero />
