<script lang="ts">
	import { onMount } from 'svelte';
	import googleService from '$lib/services/google.service';
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import { CAL_EVENTS_LOCALSTORAGE_KEY } from '../types/enums';
	import type { GoogleCalendarEvent } from '../types/google';
	// import MonthView from '$lib/components/MonthView.svelte';
	import YearView from '$lib/components/YearView.svelte';
	import { goto } from '$app/navigation';

	import homeIcon from '$lib/assets/home.png';
	import printIcon from '$lib/assets/print.png';
	import syncIcon from '$lib/assets/sync.png';
	import clearIcon from '$lib/assets/clear.png';

	let loaded = $state(false);

	async function authAndfetch() {
		await googleService.authAndListEvents(calendarEvents);
	}

	function loadFromLocalStorage() {
		console.log('Assuming is local env. Loading from localStorage');
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

	// let view: 'year' | 'month' = $state('year');
	// function toggleView() {
	// 	if (view == 'year') view = 'month';
	// 	else view = 'year';
	// }

	function print() {
		window.print();
	}

	onMount(async () => {
		if (import.meta.env.DEV) {
			loadFromLocalStorage();
		}

		setTimeout(() => {
			googleService.init().then(() => (loaded = true));
		}, 1000);
	});
</script>

<div id="toolbar" class="flex w-full justify-between">
	<div class="flex gap-2">
		{#if loaded}
			<button class="flex items-center border p-1 hover:cursor-pointer" onclick={authAndfetch}>
				<img src={syncIcon} alt="fetch events icon icon" />
			</button>
		{/if}

		<button class="border p-1 hover:cursor-pointer" onclick={clear}>
			<img src={clearIcon} alt="clear icon" />
		</button>
	</div>

	<div class="flex gap-2">
		<button class="border p-1 hover:cursor-pointer" onclick={() => goto('/home')}>
			<img src={homeIcon} alt="home icon" />
		</button>
		<button class="border p-1 hover:cursor-pointer" onclick={print}>
			<img src={printIcon} alt="print icon" />
		</button>
	</div>
</div>

<!-- <div class="mt-2"></div> -->

<!-- {#if view == 'month'}
	<MonthView />
{:else} -->
<YearView />
<!-- {/if} -->
