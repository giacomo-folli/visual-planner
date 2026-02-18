<script lang="ts">
	import { onMount } from 'svelte';
	import googleService from '$lib/services/google.service';
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import { CALENDAR_EVENTS_LOCAL_STORAGE_KEY } from '../types/enums';

	let loaded = $state(false);

	async function authAndfetch() {
		await googleService.authAndListEvents(calendarEvents);
	}

	function loadFromLocalStorage() {
		const storedEvents = localStorage.getItem(CALENDAR_EVENTS_LOCAL_STORAGE_KEY);

		const parsed = JSON.parse(storedEvents || '');
		if (parsed) {
			calendarEvents.clear();
			calendarEvents.add(parsed);
		}
	}

	function clear() {
		localStorage.setItem(CALENDAR_EVENTS_LOCAL_STORAGE_KEY, JSON.stringify([]));
		calendarEvents.clear();
	}

	function parseDate(item: { dateTime?: string; date?: string }) {
		if (!!item.dateTime) return new Date(item.dateTime).toDateString();
		else if (!!item.date) return new Date(item.date).toDateString();
	}

	onMount(async () => {
		loadFromLocalStorage();

		googleService.init().then(() => (loaded = true));
	});
</script>

Get user calendar data
<br />

{#if loaded}
	<button class="border p-2 hover:cursor-pointer" onclick={authAndfetch}>fetch events</button>
{/if}

<button class="border p-2 hover:cursor-pointer" onclick={clear}>clear</button>

<div class="mt-2 grid grid-cols-5 gap-2">
	{#each $calendarEvents as event}
		<a href={event.htmlLink} target="_blank">
			<div class="border p-1 text-left hover:cursor-pointer hover:bg-black hover:text-white">
				<div class="">{event.eventType}</div>

				<div class="flex justify-between">
					<div>Start:</div>
					<div>{parseDate(event.start)}</div>
				</div>
				<div class="flex justify-between">
					<div>End:</div>
					<div>{parseDate(event.end)}</div>
				</div>

				<hr />
				<div class="mt-1 text-left">{event.summary}</div>
			</div>
		</a>
	{/each}
</div>
