<script lang="ts">
	import type { AppData } from '$lib';

	interface Props {
		permissions: {
			view_calendars: boolean;
			drive_appdata: boolean;
		};
		appdata: AppData;
		markDirty: () => void;
	}
	let { permissions, appdata, markDirty }: Props = $props();

	// Select options (UI-only constants, no lib dependency)
	const monthCountOptions = [3, 4, 6, 8, 10, 12];
	const scrollBufferOptions = [
		{ label: 'No scrolling', value: 0 },
		{ label: '3', value: 3 },
		{ label: '6', value: 6 },
		{ label: '12', value: 12 }
	];
	const eventBackgroundOptions = [
		{ label: 'Calendar', value: 'cal' },
		{ label: 'Event', value: 'evt' },
		{ label: 'White', value: 'white' },
		{ label: 'Transparent', value: '' }
	];
</script>

<div class="contentbox settings-box">
	<section>
		<h4>Account</h4>
		<div class="subsection">
			<div class="permission-row">
				{#if permissions.view_calendars}
					<span class="material-icons perm-icon granted">verified_user</span>
					<span>visual-planner has permission to view your calendars.</span>
				{:else}
					<span class="material-icons perm-icon denied">warning</span>
					<span
						>visual-planner does not have permission to view your calendars and cannot display any
						of your calendar events.</span
					>
				{/if}
			</div>
			<div class="permission-row">
				{#if permissions.drive_appdata}
					<span class="material-icons perm-icon granted">verified_user</span>
					<span
						>visual-planner has permission to manage its own application data in your Google Drive.</span
					>
				{:else}
					<span class="material-icons perm-icon denied">warning</span>
					<span
						>visual-planner does not have permission to manage its own application data in your
						Google Drive and cannot save your settings.</span
					>
				{/if}
			</div>
			<p>
				<a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer"
					>Manage Permissions</a
				>
			</p>
			<p>
				<a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noreferrer"
					>Manage Application Data</a
				>
				(Drive &gt; Settings &gt; Manage Apps)
			</p>
		</div>
	</section>

	<section>
		<h4>View</h4>
		<div class="subsection">
			<label class="field-row">
				<input bind:value={appdata.title} oninput={markDirty} />
				Planner title.
			</label>
			<label class="field-row">
				<select bind:value={appdata.month_count} onchange={markDirty}>
					{#each monthCountOptions as opt (opt)}
						<option value={opt}>{opt}</option>
					{/each}
				</select>
				Number of months to display.
			</label>
			<label class="field-row">
				<select bind:value={appdata.scroll_buffer} onchange={markDirty}>
					{#each scrollBufferOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				Scroll buffer.
			</label>
			<label class="field-row checkbox-row">
				<input type="checkbox" bind:checked={appdata.auto_scroll} onchange={markDirty} />
				Auto-scroll to current month.
			</label>
			<div class="subsection">
				<label class="field-row">
					<input
						type="number"
						min="-12"
						max="12"
						bind:value={appdata.auto_scroll_offset}
						oninput={markDirty}
						class="num-input"
					/>
					Auto-scroll offset.
				</label>
				<label class="field-row">
					<input
						type="number"
						min="1"
						max="12"
						bind:value={appdata.first_month}
						oninput={markDirty}
						class="num-input"
					/>
					First month of year.
				</label>
			</div>
			<label class="field-row checkbox-row">
				<input type="checkbox" bind:checked={appdata.hide_scrollbars} onchange={markDirty} />
				Hide scrollbars.
			</label>
			<label class="field-row checkbox-row">
				<input type="checkbox" bind:checked={appdata.same_row_height} onchange={markDirty} />
				Make all rows the same height.
			</label>
			<label class="field-row checkbox-row">
				<input type="checkbox" bind:checked={appdata.align_weekends} onchange={markDirty} />
				Align weekends.
			</label>
			<label class="field-row">
				<input bind:value={appdata.weekends} oninput={markDirty} />
				Weekends. (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
			</label>
			<label class="field-row">
				<input
					type="number"
					min="0"
					max="6"
					bind:value={appdata.first_day_of_week}
					oninput={markDirty}
					class="num-input"
				/>
				First day of week. (0–6)
			</label>
			<label class="field-row">
				<input
					type="number"
					min="50"
					max="200"
					bind:value={appdata.font_scale_pc}
					oninput={markDirty}
					class="num-input"
				/>
				% Font scale.
			</label>
			<label class="field-row">
				<input
					type="number"
					min="0"
					max="1"
					step="0.1"
					bind:value={appdata.past_opacity}
					oninput={markDirty}
					class="num-input"
				/>
				Opacity of past months. (1 = opaque)
			</label>
			<label class="field-row">
				<input bind:value={appdata.month_names} oninput={markDirty} class="wide-input" />
				Month names.
			</label>
		</div>
	</section>

	<section>
		<h4>Events</h4>
		<div class="subsection">
			<label class="field-row checkbox-row">
				<input type="checkbox" bind:checked={appdata.show_timed_events} onchange={markDirty} />
				Show 'timed' events.
			</label>
			<label class="field-row checkbox-row">
				<input type="checkbox" bind:checked={appdata.show_all_day_events} onchange={markDirty} />
				Show 'all day' events.
			</label>
			<div class="subsection">
				<label class="field-row checkbox-row">
					<input
						type="checkbox"
						bind:checked={appdata.single_day_as_multi_day}
						onchange={markDirty}
					/>
					Single day as multi-day (vertical bar).
				</label>
			</div>
			<label class="field-row checkbox-row">
				<input
					type="checkbox"
					bind:checked={appdata.text_on_singleday_events}
					onchange={markDirty}
				/>
				Show text on single-day events.
			</label>
			<label class="field-row checkbox-row">
				<input
					type="checkbox"
					bind:checked={appdata.text_on_multiday_events}
					onchange={markDirty}
				/>
				Show text on multi-day events.
			</label>
			<label class="field-row">
				<input
					type="number"
					bind:value={appdata.scale_of_multiday_events}
					oninput={markDirty}
					class="num-input"
				/>
				% Scale of multi-day events.
			</label>
			<label class="field-row">
				<select bind:value={appdata.event_background} onchange={markDirty}>
					{#each eventBackgroundOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				Event background.
			</label>
		</div>
	</section>

	<section class="links-section">
		<p>
			<a href="https://visual-planner.github.io" target="_blank" rel="noreferrer"
				>visual-planner home</a
			>
		</p>
		<p>
			<a
				href="https://groups.google.com/group/visual-planner-discuss"
				target="_blank"
				rel="noreferrer">visual-planner discussion group</a
			>
		</p>
	</section>
</div>
