<script lang="ts">
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import type { GoogleCalendarEvent } from '../../types/google';

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

<div class="month-view">
	<div class="header">
		<button onclick={prevMonth}>&lt;</button>
		<h2>{monthName}</h2>
		<button onclick={nextMonth}>&gt;</button>
	</div>

	<div class="weekdays">
		{#each weekDays as day}
			<div class="weekday">{day}</div>
		{/each}
	</div>

	<div class="days">
		{#each days as day}
			{@const events = getEventsForDate(day)}
			<div class="day" class:other-month={!isCurrentMonth(day)} class:today={isToday(day)}>
				<span class="day-number">{day.getDate()}</span>
				<div class="events">
					{#each events as event}
						<div class="event" title={event.summary}>
							{#if event?.start?.dateTime}
								<span class="event-time">{formatTime(new Date(event.start?.dateTime))}</span>
							{/if}
							<span class="event-title">{event.summary}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.month-view {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		max-width: 100%;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #f5f5f5;
		border-bottom: 1px solid #ddd;
	}

	.header h2 {
		margin: 0;
		font-size: 1.25rem;
	}

	.header button {
		padding: 0.5rem 1rem;
		cursor: pointer;
		border: 1px solid #ccc;
		background: white;
		border-radius: 4px;
	}

	.header button:hover {
		background: #eee;
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		background: #f9f9f9;
		border-bottom: 1px solid #ddd;
	}

	.weekday {
		padding: 0.5rem;
		text-align: center;
		font-weight: 500;
		font-size: 0.875rem;
		color: #666;
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}

	.day {
		min-height: 100px;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding: 0.25rem;
		font-size: 0.875rem;
	}

	.day:nth-child(7n) {
		border-right: none;
	}

	.day.other-month {
		background: #fafafa;
		color: #999;
	}

	.day.today {
		background: #e3f2fd;
	}

	.day-number {
		font-weight: 500;
		display: block;
		margin-bottom: 0.25rem;
	}

	.events {
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow: hidden;
	}

	.event {
		background: #4caf50;
		color: white;
		padding: 2px 4px;
		border-radius: 2px;
		font-size: 0.75rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.event:hover {
		background: #45a049;
	}

	.event-time {
		margin-right: 4px;
		opacity: 0.9;
	}
</style>
