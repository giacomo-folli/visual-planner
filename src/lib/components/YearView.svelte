<script lang="ts">
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import type { GoogleCalendarEvent } from '../../types/google';

	let currentDate = $state(new Date());
	let viewDate = $state(new Date());

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	function getDaysInMonth(year: number, month: number): Date[] {
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

	function isCurrentMonth(date: Date, month: number): boolean {
		return date.getMonth() === month;
	}

	function prevYear() {
		viewDate = new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1);
	}

	function nextYear() {
		viewDate = new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1);
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	let year = $derived(viewDate.getFullYear());
	let yearName = $derived(viewDate.toLocaleDateString('en-US', { year: 'numeric' }));

	function getMonthName(month: number): string {
		return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short' });
	}
</script>

<div class="year-view">
	<div class="header">
		<button onclick={prevYear}>&lt;</button>
		<h2>{yearName}</h2>
		<button onclick={nextYear}>&gt;</button>
	</div>

	<div class="months-grid">
		{#each months as month}
			{@const monthDays = getDaysInMonth(year, month)}
			{@const monthName = getMonthName(month)}
			<div class="month">
				<div class="month-header">
					<h3>{monthName}</h3>
				</div>
				<div class="weekdays">
					{#each weekDays as day}
						<div class="weekday">{day}</div>
					{/each}
				</div>
				<div class="days">
					{#each monthDays as day}
						{@const events = getEventsForDate(day)}
						<div
							class="day"
							class:other-month={!isCurrentMonth(day, month)}
							class:today={isToday(day)}
						>
							<span class="day-number">{day.getDate()}</span>
							{#if events.length > 0}
								<div class="events-indicator" title={events.map((e) => e.summary).join(', ')}>
									{#if events.length <= 3}
										{#each events as event}
											<div class="event-dot" title={event.summary}></div>
										{/each}
									{:else}
										<div class="event-dot" title="{events.length} events"></div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.year-view {
		padding: 1rem;
		height: 100%;
		overflow: auto;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.header button {
		background: none;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.25rem 0.75rem;
		cursor: pointer;
	}

	.header button:hover {
		background: #f0f0f0;
	}

	.months-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.month {
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.5rem;
		background: #fff;
	}

	.month-header {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.month-header h3 {
		margin: 0;
		font-size: 0.9rem;
		color: #333;
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		margin-bottom: 0.25rem;
	}

	.weekday {
		text-align: center;
		font-size: 0.65rem;
		color: #666;
		font-weight: 500;
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
	}

	.day {
		aspect-ratio: 1;
		padding: 0.1rem;
		font-size: 0.7rem;
		position: relative;
		border: 1px solid transparent;
	}

	.day:hover {
		background: #f9f9f9;
	}

	.day.other-month {
		color: #ccc;
	}

	.day.today {
		background: #e3f2fd;
		border-color: #2196f3;
		border-radius: 2px;
	}

	.day-number {
		display: block;
	}

	.events-indicator {
		display: flex;
		gap: 1px;
		margin-top: 1px;
		flex-wrap: wrap;
	}

	.event-dot {
		width: 4px;
		height: 4px;
		background: #2196f3;
		border-radius: 50%;
	}
</style>
