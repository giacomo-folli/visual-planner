<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/auth.svelte';
	import LoginHero from '$lib/components/LoginHero.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		auth.init();

		console.log(auth.token);
		console.log(auth.isAuthenticated);
	});
</script>

{#if auth.isAuthenticated}
	<div class="min-h-screen bg-gray-100">
		<header class="border-b bg-white shadow-sm">
			<div class="flex items-center justify-between px-4 py-3">
				<h1 class="text-xl font-semibold text-gray-800">visual-planner</h1>
				<div class="flex items-center gap-4">
					{#if auth.user}
						<span class="text-sm text-gray-600">{auth.user.name}</span>
					{/if}
					<button
						onclick={() => auth.logout()}
						class="px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
					>
						Sign Out
					</button>
				</div>
			</div>
		</header>
		<main>
			{@render children?.()}
		</main>
	</div>
{:else}
	<LoginHero />
{/if}
