<script lang="ts">
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import type { GoogleCalendarEvent } from '../../types/google';

	import '../../month-view.css';
	import Header from './Header.svelte';

	let currentDate = $state(new Date());
	let viewDate = $state(new Date());

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function getDaysInMonth(date: Date): Date[] {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days: Date[] = [];

		const startDayOfWeek = firstDay.getDay();
		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			const d = new Date(year, month, -i);
			days.push(d);
		}

		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		const endDayOfWeek = lastDay.getDay();
		for (let i = 1; i < 7 - endDayOfWeek; i++) {
			days.push(new Date(year, month + 1, i));
		}

		return days;
	}

	function getEventsForDate(date: Date): GoogleCalendarEvent[] {
		const dateStr = date.toISOString().split('T')[0];
		if ($calendarEvents.has(dateStr)) {
			return $calendarEvents.get(dateStr) || [];
		}
		return [];
	}

	function isToday(date: Date): boolean {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	}

	function isCurrentMonth(date: Date): boolean {
		return date.getMonth() === viewDate.getMonth();
	}

	function prevMonth() {
		viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
	}

	function nextMonth() {
		viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	let days = $derived(getDaysInMonth(viewDate));
	let monthName = $derived(
		viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);
</script>

<div class="month-view-container">
	<Header next={nextMonth} prev={prevMonth} title={monthName} />

	<div class="month-view-weekdays">
		{#each weekDays as day}
			<div class="month-view-weekday">{day}</div>
		{/each}
	</div>

	<div class="month-view-days">
		{#each days as day}
			{@const events = getEventsForDate(day)}
			<div
				class="month-view-day"
				class:other-month={!isCurrentMonth(day)}
				class:today={isToday(day)}
			>
				<span class="month-view-day-number">{day.getDate()}</span>
				<div class="month-view-events">
					{#each events as event}
						<div class="month-view-event" title={event.summary}>
							{#if event?.start?.dateTime}
								<span class="month-view-event-time"
									>{formatTime(new Date(event.start?.dateTime))}</span
								>
							{/if}
							<span class="month-view-event-title">{event.summary}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
