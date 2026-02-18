<script lang="ts">
	import { onMount } from 'svelte';
	import googleService from '$lib/services/google.service';
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import { CAL_EVENTS_LOCALSTORAGE_KEY } from '../types/enums';
	import MonthView from '$lib/components/MonthView.svelte';
	import type { GoogleCalendarEvent } from '../types/google';

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

	onMount(async () => {
		loadFromLocalStorage();

		googleService.init().then(() => (loaded = true));
	});
</script>

{#if loaded}
	<button class="border p-2 hover:cursor-pointer" onclick={authAndfetch}>fetch events</button>
{/if}

<button class="border p-2 hover:cursor-pointer" onclick={clear}>clear</button>

<div class="mt-2"></div>

<MonthView />
