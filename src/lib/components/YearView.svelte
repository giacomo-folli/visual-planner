<script lang="ts">
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import type { GoogleCalendarEvent } from '../../types/google';

	import '../../year-view.css';
	import Header from './Header.svelte';

	let currentDate = $state(new Date());
	let viewDate = $state(new Date());

	const weekDayAbbrevs: Record<number, string> = {
		0: 'Su',
		1: 'M',
		2: 'Tu',
		3: 'W',
		4: 'Th',
		5: 'F',
		6: 'Sa'
	};

	const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	function getDaysInMonth(year: number, month: number): Date[] {
		const lastDay = new Date(year, month + 1, 0);
		const days: Date[] = [];
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
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

	function isWeekend(date: Date): boolean {
		return date.getDay() === 0 || date.getDay() === 6;
	}

	function prevYear() {
		viewDate = new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1);
	}

	function nextYear() {
		viewDate = new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1);
	}

	let year = $derived(viewDate.getFullYear());

	function getMonthName(month: number): string {
		return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
	}
</script>

<div class="year-view-container">
	<Header next={nextYear} prev={prevYear} title={year} />

	<div class="year-view-calendar-grid">
		<!-- Month headers -->
		<div class="year-view-months-row">
			{#each months as month}
				<div class="year-view-month-col">
					<div class="year-view-month-header">{getMonthName(month)}</div>
					<div class="year-view-days-col">
						{#each getDaysInMonth(year, month) as day}
							{@const events = getEventsForDate(day)}
							{@const dayOfWeek = day.getDay()}
							<div
								class="year-view-day-row"
								class:weekend={isWeekend(day)}
								class:today={isToday(day)}
								class:has-events={events.length > 0}
							>
								<span class="year-view-day-number">{day.getDate()}</span>
								<span class="year-view-day-abbrev">{weekDayAbbrevs[dayOfWeek]}</span>
								{#if events.length > 0}
									<div class="year-view-event-dots">
										{#each events.slice(0, 3) as event}
											<div class="year-view-event-dot" title={event.summary}></div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
