<script lang="ts">
	import { onMount } from 'svelte';
	import googleService from '$lib/services/google.service';
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import { CAL_EVENTS_LOCALSTORAGE_KEY } from '../types/enums';
	import type { GoogleCalendarEvent } from '../types/google';
	import MonthView from '$lib/components/MonthView.svelte';
	import YearView from '$lib/components/YearView.svelte';
	import { goto } from '$app/navigation';

	let loaded = $state(false);

	async function authAndfetch() {
		await googleService.authAndListEvents(calendarEvents);
	}

	function loadFromLocalStorage() {
		const storedEvents = localStorage.getItem(CAL_EVENTS_LOCALSTORAGE_KEY);
		const parsed = JSON.parse(storedEvents || '');

		if (!!parsed && Array.isArray(parsed)) {
			const map = new Map(parsed) as Map<string, GoogleCalendarEvent[]>;
			calendarEvents.clear();
			calendarEvents.set(map);
		}
	}

	function clear() {
		localStorage.setItem(CAL_EVENTS_LOCALSTORAGE_KEY, JSON.stringify({}));
		calendarEvents.clear();
	}

	let view: 'year' | 'month' = $state('year');
	function toggleView() {
		if (view == 'year') view = 'month';
		else view = 'year';
	}

	onMount(async () => {
		loadFromLocalStorage();

		googleService.init().then(() => (loaded = true));
	});
</script>

<div class="flex w-full justify-between">
	<div class="flex">
		{#if loaded}
			<button class="border p-1 hover:cursor-pointer" onclick={authAndfetch}>fetch events</button>
		{/if}

		<button class="border p-1 hover:cursor-pointer" onclick={clear}>clear</button>

		<button class="border p-1 hover:cursor-pointer" onclick={toggleView}>
			{#if view == 'month'}
				year view
			{:else}
				month view
			{/if}
		</button>
	</div>

	<div>
		<button class="border p-1 hover:cursor-pointer" onclick={() => goto('/home')}>home</button>
	</div>
</div>

<div class="mt-2"></div>

{#if view == 'month'}
	<MonthView />
{:else}
	<YearView />
{/if}
