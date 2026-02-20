<script lang="ts">
	import { calendarEvents } from '$lib/stores/calendarEvents.store';
	import type { GoogleCalendarEvent } from '../../types/google';

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

<div class="year-view">
	<div class="header">
		<button onclick={prevYear} class="nav-btn">&lsaquo;</button>
		<h1 class="year-title">{year}</h1>
		<button onclick={nextYear} class="nav-btn">&rsaquo;</button>
	</div>

	<div class="calendar-grid">
		<!-- Month headers -->
		<div class="months-row">
			{#each months as month}
				<div class="month-col">
					<div class="month-header">{getMonthName(month)}</div>
					<div class="days-col">
						{#each getDaysInMonth(year, month) as day}
							{@const events = getEventsForDate(day)}
							{@const dayOfWeek = day.getDay()}
							<div
								class="day-row"
								class:weekend={isWeekend(day)}
								class:today={isToday(day)}
								class:has-events={events.length > 0}
							>
								<span class="day-number">{day.getDate()}</span>
								<span class="day-abbrev">{weekDayAbbrevs[dayOfWeek]}</span>
								{#if events.length > 0}
									<div class="event-dots">
										{#each events.slice(0, 3) as event}
											<div class="event-dot" title={event.summary}></div>
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

<style>
	@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Archivo+Narrow:wght@400;500;600&display=swap');

	.year-view {
		font-family: 'Archivo Narrow', sans-serif;
		background: #fff;
		padding: 1.5rem 1rem 1rem;
		min-height: 100%;
		overflow: auto;
		color: #222;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 1.25rem;
		border-bottom: 2px solid #111;
		padding-bottom: 0.5rem;
	}

	.year-title {
		font-family: 'EB Garamond', serif;
		font-size: 2rem;
		font-weight: 400;
		letter-spacing: 0.15em;
		margin: 0;
		color: #111;
	}

	.nav-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #555;
		padding: 0.1rem 0.4rem;
		line-height: 1;
	}

	.nav-btn:hover {
		color: #000;
	}

	.calendar-grid {
		width: 100%;
		overflow-x: auto;
	}

	.months-row {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 0;
		min-width: 900px;
	}

	.month-col {
		border-right: 1px solid #ddd;
	}

	.month-col:last-child {
		border-right: none;
	}

	.month-header {
		text-align: center;
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: #333;
		padding: 0.3rem 0.2rem 0.4rem;
		border-bottom: 1px solid #bbb;
		text-transform: uppercase;
	}

	.days-col {
		display: flex;
		flex-direction: column;
	}

	.day-row {
		display: flex;
		align-items: center;
		padding: 0.08rem 0.3rem;
		gap: 0.2rem;
		border-bottom: 1px solid #eee;
		min-height: 18px;
		position: relative;
	}

	.day-row:hover {
		background: #f5f5f5;
	}

	.day-row.weekend {
		background: #fdf0f0;
	}

	.day-row.weekend:hover {
		background: #f9e0e0;
	}

	.day-row.today {
		background: #e8f4fd;
		outline: 1px solid #4a90d9;
		outline-offset: -1px;
	}

	.day-number {
		font-size: 0.6rem;
		font-weight: 500;
		color: #111;
		min-width: 14px;
		text-align: right;
		line-height: 1;
	}

	.day-abbrev {
		font-size: 0.55rem;
		color: #888;
		font-weight: 400;
		line-height: 1;
	}

	.day-row.weekend .day-abbrev {
		color: #c0777a;
	}

	.day-row.today .day-number {
		color: #1a6db5;
		font-weight: 600;
	}

	.event-dots {
		display: flex;
		gap: 2px;
		margin-left: auto;
		align-items: center;
	}

	.event-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #4a90d9;
		flex-shrink: 0;
	}
</style>
