<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	
	// // Reactive state
	// let uiView = $state<'planner' | 'settings'>('planner');
	// let formDirty = $state(false);

	// // appdata is mutated in-place by VpConfiguration, so we wrap the
	// // same object reference in $state so Svelte tracks its properties.
	// let appdata = $state<AppData>({ ...defaultAppData });

	// // Snapshot taken when settings panel opens, used to revert on cancel.
	// let appdataSnapshot: AppData = { ...appdata };

	// let permissions = $state<Permissions>({
	// 	view_calendars: false,
	// 	drive_appdata: false
	// });

	// let gridview = $state<GridViewState>(loadGridView());

	// // Grid display state driven by VpGrid
	// let gridState = $state<GridState>({
	// 	fontscale: 1,
	// 	past_opacity: 0.6,
	// 	scroll_size: 100,
	// 	scroll_size_portrait: 200,
	// 	singledaytext: true,
	// 	multidaytext: true,
	// 	multidayscale: 1,
	// 	cls: {},
	// 	sbox_cls: {},
	// 	page: [] as VpMonth[],
	// 	gridareas: '',
	// 	year: new Date().getFullYear()
	// });

	// // Service instances (initialised in onMount)
	// let vpConfig: VpConfiguration;
	// let vpGCal: VpGCal;
	// let vpDiary: VpDiary;
	// let vpGrid: VpGrid;

	// // DOM refs
	// let scrollboxEl = $state<HTMLElement | null>(null);
	// let boxEl = $state<HTMLElement | null>(null);
	// let navbarEl = $state<HTMLElement | null>(null);

	// // Derived
	// let darkmode = $derived(!!gridview.darkmode);

	// type VpPrintPayload = {
	// 	gridview: GridViewState;
	// 	calendarlist: VpGCal['calendarlist'];
	// 	grid: GridState & { page: VpMonth[] };
	// };

	// // Lifecycle

	// async function waitForGoogleClient(timeoutMs = 5000, intervalMs = 50): Promise<boolean> {
	// 	if (typeof window === 'undefined') return false;

	// 	const hasGapiLoad = () => typeof gapi !== 'undefined' && typeof gapi.load === 'function';
	// 	if (hasGapiLoad()) return true;

	// 	const deadline = Date.now() + timeoutMs;
	// 	while (Date.now() < deadline) {
	// 		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	// 		if (hasGapiLoad()) return true;
	// 	}

	// 	return false;
	// }

	// onMount(async () => {
	// 	vpConfig = new VpConfiguration(permissions, appdata);
	// 	vpGCal = new VpGCal(appdata);
	// 	vpDiary = new VpDiary(appdata, gridview, vpGCal);
	// 	vpGrid = new VpGrid(appdata, gridview, vpDiary, vpConfig);

	// 	// Keep Svelte gridState in sync whenever VpGrid updates it
	// 	vpGrid.onUpdate = () => {
	// 		Object.assign(gridState, vpGrid.state);
	// 	};

	// 	// After a page load, scroll the grid to the correct month
	// 	vpGrid.onPageLoaded = (buffer: number) => {
	// 		if (!scrollboxEl || !boxEl) return;
	// 		const monthdivs = boxEl.querySelectorAll<HTMLElement>('.vpmonth');
	// 		if (!monthdivs.length) return;
	// 		const hdr = monthdivs[buffer]?.firstElementChild as HTMLElement | null;
	// 		if (!hdr) return;
	// 		if (gridview.column) scrollboxEl.scrollTo(hdr.offsetLeft, 0);
	// 		if (gridview.list) scrollboxEl.scrollTo(0, hdr.offsetTop);
	// 		boxEl.focus();
	// 	};

	// 	// Once calendarlist is ready, start the grid
	// 	vpGCal.onLoad = () => {
	// 		vpGrid.start();
	// 	};

	// 	// Once permissions + appdata are loaded, init gcal
	// 	vpConfig.onLoad.push(() => {
	// 		vpGCal.init(permissions);
	// 	});

	// 	// Boot: wait for Google API script, then kick off auth + config
	// 	const hasGoogleClient = await waitForGoogleClient();
	// 	if (!hasGoogleClient) {
	// 		console.error('Google API client failed to load.');
	// 		return;
	// 	}

	// 	gapi.load('client', () => vpConfig.load());
	// });

	// // Settings handlers
	// function openSettings() {
	// 	appdataSnapshot = { ...appdata };
	// 	formDirty = false;
	// 	uiView = 'settings';
	// }

	// function cancelSettings() {
	// 	vpConfig.revertAppdata();
	// 	// Reflect the revert into our $state proxy
	// 	Object.assign(appdata, appdataSnapshot);
	// 	formDirty = false;
	// 	uiView = 'planner';
	// }

	// function saveSettings() {
	// 	vpConfig.saveAppData();
	// 	vpGrid.reset();
	// 	formDirty = false;
	// 	uiView = 'planner';
	// }

	// function markDirty() {
	// 	formDirty = true;
	// }

	// // Toolbar handlers
	// function onclickColumn() {
	// 	if (gridview.column) return;
	// 	gridview = setGridView(gridview, { column: true });
	// 	vpGrid.reset();
	// }

	// function onclickList() {
	// 	if (gridview.list) return;
	// 	gridview = setGridView(gridview, { list: true });
	// 	vpGrid.reset();
	// }

	// function onclickExpand() {
	// 	gridview = vpGrid.onclickExpand(gridview);
	// }

	// function onclickDarkMode() {
	// 	gridview = vpGrid.onclickDarkMode(gridview);
	// }

	// function onclickSync() {
	// 	vpDiary?.sync();
	// 	boxEl?.focus();
	// }

	// function onclickContinue() {
	// 	if (!scrollboxEl || !boxEl) return;
	// 	const monthdivs = boxEl.querySelectorAll<HTMLElement>('.vpmonth');
	// 	vpGrid.onclickContinue(scrollboxEl, monthdivs);
	// 	boxEl.focus();
	// }

	// function onclickPrint() {
	// 	if (!scrollboxEl || !boxEl) return;
	// 	const monthdivs = boxEl.querySelectorAll<HTMLElement>('.vpmonth');
	// 	const visinfo = vpGrid.getVisInfo(scrollboxEl, monthdivs);
	// 	// Expose for vpprint.htm (matching original behaviour)
	// 	(window as Window & { vpprint?: VpPrintPayload }).vpprint = {
	// 		gridview,
	// 		calendarlist: vpGCal.calendarlist,
	// 		grid: { ...gridState, page: visinfo.months }
	// 	};
	// 	window.open('vpprint.htm');
	// }

	// function onclickNavbar(evt: MouseEvent) {
	// 	if (!navbarEl) return;
	// 	vpGrid.onclickNavbar(evt.clientX, navbarEl.offsetWidth);
	// }

	// function onkeydown(evt: KeyboardEvent) {
	// 	if (!evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return;
	// 	if (evt.key === 'Enter') {
	// 		evt.preventDefault();
	// 		onclickContinue();
	// 	}
	// }

	// function onWheel(evt: WheelEvent) {
	// 	if (!scrollboxEl) return;
	// 	vpGrid.onWheel(evt, scrollboxEl);
	// }
</script>

<svelte:head>
	<!-- <title>{appdata.title}</title> -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&family=Material+Icons&display=swap"
		rel="stylesheet"
	/>
	<!-- Google APIs – must load before onMount boots vplib -->
	<script src="https://apis.google.com/js/api.js"></script>
	<script src="https://accounts.google.com/gsi/client"></script>
</svelte:head>

<div
	class="root"
	class:dark={darkmode}
	bind:this={boxEl}
	role="application"
	tabindex="-1"
	{onkeydown}
>
	<!-- ============================================================
       BANNER
  ============================================================ -->
	<header class="banner">
		<div class="banner-left">
			{#if uiView === 'planner'}
				<button
					class="toolbtn"
					class:active={!!gridview.column}
					title="Column"
					onclick={onclickColumn}><span class="material-icons">view_column</span></button
				>

				<button class="toolbtn" class:active={!!gridview.list} title="List" onclick={onclickList}
					><span class="material-icons">view_list</span></button
				>

				<button
					class="toolbtn"
					class:active={!!gridview.expand}
					title="Expand"
					onclick={onclickExpand}><span class="material-icons">calendar_view_day</span></button
				>

				<button
					class="toolbtn"
					class:active={!!gridview.darkmode}
					title="Dark Mode"
					onclick={onclickDarkMode}><span class="material-icons">dark_mode</span></button
				>
			{/if}
		</div>

		<div class="banner-center">
			<span class="banner-title">{appdata.title}</span>
		</div>

		<div class="banner-right">
			{#if uiView === 'planner'}
				<button class="toolbtn" title="Sync" onclick={onclickSync}>
					<span class="material-icons">refresh</span>
				</button>
				<button class="toolbtn" title="Continue (Ctrl+Enter)" onclick={onclickContinue}>
					<span class="material-icons">sync_alt</span>
				</button>
				<button class="toolbtn" title="Print" onclick={onclickPrint}>
					<span class="material-icons">print</span>
				</button>
				<button class="toolbtn" title="Settings" onclick={openSettings}>
					<span class="material-icons">settings</span>
				</button>
			{:else if uiView === 'settings'}
				{#if !formDirty}
					<button class="toolbtn" title="Close" onclick={cancelSettings}>
						<span class="material-icons">close</span>
					</button>
				{:else}
					{#if permissions.drive_appdata}
						<button class="toolbtn" title="Save" onclick={saveSettings}>
							<span class="material-icons">backup</span>
						</button>
					{/if}
					<button class="toolbtn" title="Cancel" onclick={cancelSettings}>
						<span class="material-icons">cancel</span>
					</button>
				{/if}
			{/if}
		</div>
	</header>

	<!-- ============================================================
       PLANNER VIEW
  ============================================================ -->
	{#if uiView === 'planner'}
		<div
			id="vpscrollbox"
			class="contentbox scrollbox"
			class:hidescroll={!!gridState.sbox_cls.hidescroll}
			bind:this={scrollboxEl}
			onwheel={onWheel}
			style="font-size: {gridState.fontscale}em;"
		>
			<!-- Year navbar -->
			<div
				id="vpnavbar"
				class="vpnavbar"
				bind:this={navbarEl}
				onclick={onclickNavbar}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && onclickNavbar(e as unknown as MouseEvent)}
			>
				<span class="navyear">{gridState.year}</span>
			</div>

			<!-- Month grid -->
			<div
				id="vpbox"
				class="vpbox"
				class:flexrow={!!gridState.cls.flexrow}
				style="grid-template-areas: {gridState.gridareas};"
			>
				{#each gridState.page as month (month.id)}
					<div
						class="vpmonth"
						class:past={!!month.cls.past}
						style="grid-area: {month.id}; opacity: {month.cls.past ? gridState.past_opacity : 1};"
					>
						<!-- Month header -->
						<div
							class="vpmonth-hdr"
							role="button"
							tabindex="0"
							onclick={() => month.onclickHdr()}
							onkeydown={(e) => e.key === 'Enter' && month.onclickHdr()}
						>
							{month.hdr}
						</div>

						<!-- Day cells -->
						<div class="vpdays">
							{#each month.days as day (day.index)}
								<div
									class="vpday"
									class:weekend={!!day.cls.weekend}
									class:today={!!day.cls.today}
									style={Object.entries(day.labelboxstyle)
										.map(([k, v]) => `${k}:${v}`)
										.join(';')}
								>
									<!-- Day number -->
									<span
										class="vpday-num"
										role="button"
										tabindex="0"
										onclick={(e) => day.onclickNum(e)}
										onkeydown={(e) =>
											e.key === 'Enter' && day.onclickNum(e as unknown as MouseEvent)}
										>{day.num}</span
									>

									<!-- Single-day event labels -->
									{#if day.labels}
										{#each day.labels as label (label)}
											<div
												class="vplabel vplabel-single"
												style={Object.entries(label.style)
													.map(([k, v]) => `${k}:${v}`)
													.join(';')}
												title={label.evt.title}
												role="button"
												tabindex="0"
												onclick={() => label.evt.edit()}
												onkeydown={(e) => e.key === 'Enter' && label.evt.edit()}
											>
												{#if gridState.singledaytext}
													<span class="vplabel-text">{label.evt.desc}</span>
												{/if}
											</div>
										{/each}
									{/if}
								</div>
							{/each}
						</div>

						<!-- Multi-day / month-level event labels -->
						{#if month.labels}
							{#each month.labels as label (label)}
								<div
									class="vplabel vplabel-multi"
									class:borderfirst={!!label.cls.borderfirst}
									class:borderlast={!!label.cls.borderlast}
									style={[
										...Object.entries(label.style),
										...Object.entries(label.multiboxstyle ?? {})
									]
										.map(([k, v]) => `${k}:${v}`)
										.join(';')}
									title={label.evt.title}
									role="button"
									tabindex="0"
									onclick={() => label.evt.edit()}
									onkeydown={(e) => e.key === 'Enter' && label.evt.edit()}
								>
									{#if gridState.multidaytext}
										<span
											class="vplabel-text"
											style="transform: scale({gridState.multidayscale}); transform-origin: left center;"
											>{label.evt.desc}</span
										>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- ============================================================
       SETTINGS VIEW
  ============================================================ -->
	{#if uiView === 'settings'}
		<SettingsView {markDirty} {appdata} {permissions} />
	{/if}
</div>
