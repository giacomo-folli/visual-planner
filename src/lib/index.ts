// ============================================================
// vplib.ts  –  SvelteKit / Svelte 5 port of vplib.js
// All AngularJS / $rootScope / $scope dependencies removed.
// State is exposed via plain Svelte 5 $state runes (see stores
// at the bottom) and plain TypeScript classes / functions.
// ============================================================

import { GOOGLE_SCOPES, googleAuth } from './google-auth';

// ============================================================
// Utility
// ============================================================

export function fmt(fmtspec: string, ...args: unknown[]): string {
	let str = '';
	let arg = 0;
	for (const ch of fmtspec) {
		if (ch === '^') {
			if (arg < args.length) {
				str += String(args[arg]);
				arg++;
			}
		} else {
			str += ch;
		}
	}
	return str;
}

// ============================================================
// VpDate
// ============================================================

export class VpDate {
	dt: Date;

	static ymdstr: string[] = [
		'-01',
		'-02',
		'-03',
		'-04',
		'-05',
		'-06',
		'-07',
		'-08',
		'-09',
		'-10',
		'-11',
		'-12',
		'-13',
		'-14',
		'-15',
		'-16',
		'-17',
		'-18',
		'-19',
		'-20',
		'-21',
		'-22',
		'-23',
		'-24',
		'-25',
		'-26',
		'-27',
		'-28',
		'-29',
		'-30',
		'-31'
	];
	static weekends: number[] = [0, 6];
	static localemonth: string[] = [];

	constructor(src?: VpDate | Date | number | string) {
		if (src instanceof VpDate) {
			this.dt = new Date(src.dt);
		} else if (src !== undefined) {
			this.dt = new Date(src as string | number | Date);
		} else {
			const today = new Date();
			this.dt = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		}
	}

	ym(): string {
		return this.dt.getFullYear() + VpDate.ymdstr[this.dt.getMonth()];
	}

	ymd(): string {
		return this.ym() + VpDate.ymdstr[this.dt.getDate() - 1];
	}

	ymdnum(): string {
		return this.ymd().replace(/-/g, '');
	}

	getMonth(): number {
		return this.dt.getMonth() + 1;
	}

	offsetDay(off: number): void {
		this.dt.setDate(this.dt.getDate() + off);
	}

	offsetMonth(off: number): void {
		this.dt.setMonth(this.dt.getMonth() + off);
	}

	toStartOfWeek(startday: number): void {
		while (this.dt.getDay() !== startday) this.dt.setDate(this.dt.getDate() - 1);
	}

	toStartOfMonth(): void {
		this.dt.setDate(1);
	}

	toStartOfYear(): void {
		this.dt.setMonth(0);
		this.dt.setDate(1);
	}

	DayOfMonth(): number {
		return this.dt.getDate();
	}

	DayOfWeek(): number {
		return this.dt.getDay();
	}

	isWeekend(): boolean {
		return VpDate.weekends.includes(this.dt.getDay());
	}

	isPastMonth(): boolean {
		const today = new Date();
		if (this.dt.getFullYear() < today.getFullYear()) return true;
		if (this.dt.getFullYear() > today.getFullYear()) return false;
		return this.dt.getMonth() < today.getMonth();
	}

	isCurrentMonth(): boolean {
		const today = new Date();
		return this.dt.getFullYear() === today.getFullYear() && this.dt.getMonth() === today.getMonth();
	}

	MonthTitle(): string {
		return fmt('^ ^', VpDate.localemonth[this.dt.getMonth()], this.dt.getFullYear());
	}

	GCalURL(): string {
		return fmt('^/^/^', this.dt.getFullYear(), this.dt.getMonth() + 1, this.dt.getDate());
	}

	GCalSpanURL(daycount: number): string {
		const vdtEnd = new VpDate(this);
		vdtEnd.offsetDay(daycount);
		return fmt('^/^', this.ymdnum(), vdtEnd.ymdnum());
	}

	static DaySpan(ymd1: string, ymd2: string): number {
		return (Date.parse(ymd2) - Date.parse(ymd1)) / 86400000;
	}
}

// ============================================================
// VpDateMonth  –  always points to 1st of the month
// ============================================================

export class VpDateMonth extends VpDate {
	constructor(yyyy?: number, mm?: number) {
		super();
		if (yyyy !== undefined && mm !== undefined) {
			this.dt = new Date(yyyy, mm - 1);
		} else {
			const today = new Date();
			this.dt = new Date(today.getFullYear(), today.getMonth());
		}
	}
}

// ============================================================
// VpDateTime  –  wraps a timed ISO string
// ============================================================

export class VpDateTime extends VpDate {
	static time24h = true;

	constructor(iso: string) {
		super();
		this.dt = new Date(iso);
	}

	DayMinutes(): number {
		return this.dt.getHours() * 60 + this.dt.getMinutes();
	}

	TimeTitle(): string {
		const hh = this.dt.getHours();
		const mm = this.dt.getMinutes();
		const minutes = fmt(mm < 10 ? '0^' : '^', mm);
		if (VpDateTime.time24h) {
			return fmt('^:^', hh, minutes);
		}
		const hours = hh > 12 ? hh - 12 : hh;
		return fmt(hh < 12 ? '^:^am' : '^:^pm', hours, minutes);
	}
}

// ============================================================
// AppData  –  plain object; import and use in Svelte with $state
// ============================================================

export interface AppData {
	title: string;
	month_count: number;
	scroll_buffer: number;
	auto_scroll: boolean;
	auto_scroll_offset: number;
	first_month: number;
	hide_scrollbars: boolean;
	same_row_height: boolean;
	align_weekends: boolean;
	weekends: string;
	first_day_of_week: number;
	font_scale_pc: number;
	past_opacity: number;
	month_names: string;
	proportional_events: boolean;
	proportional_start_hour: number;
	proportional_end_hour: number;
	show_timed_events: boolean;
	show_all_day_events: boolean;
	single_day_as_multi_day: boolean;
	text_on_singleday_events: boolean;
	text_on_multiday_events: boolean;
	scale_of_multiday_events: number;
	event_background: string;
}

export const defaultAppData: AppData = {
	title: 'visual-planner',
	month_count: 6,
	scroll_buffer: 6,
	auto_scroll: true,
	auto_scroll_offset: -1,
	first_month: 1,
	hide_scrollbars: false,
	same_row_height: false,
	align_weekends: true,
	weekends: '6,0',
	first_day_of_week: 1,
	font_scale_pc: 100,
	past_opacity: 0.6,
	month_names: 'Jan-Feb-Mar-Apr-May-Jun-Jul-Aug-Sep-Oct-Nov-Dec',
	proportional_events: false,
	proportional_start_hour: 8,
	proportional_end_hour: 20,
	show_timed_events: true,
	show_all_day_events: true,
	single_day_as_multi_day: false,
	text_on_singleday_events: true,
	text_on_multiday_events: true,
	scale_of_multiday_events: 100,
	event_background: 'cal'
};

// ============================================================
// GridView  –  persisted in localStorage
// ============================================================

export interface GridViewState {
	column?: { checked: true };
	list?: { checked: true };
	expand?: { checked: true };
	collapse?: { checked: true };
	darkmode?: { checked: true };
}

const STORAGE_KEY_GRIDVIEW = 'vp-gridviewinfo';
const STORAGE_KEY_CALTOG = 'vp-caltoginfo';

function loadGridView(): GridViewState {
	try {
		const raw = localStorage.getItem(STORAGE_KEY_GRIDVIEW);
		if (raw) return JSON.parse(raw);
	} catch {
		/* ignore */
	}
	return { column: { checked: true }, collapse: { checked: true } };
}

function saveGridView(gv: GridViewState): void {
	localStorage.setItem(STORAGE_KEY_GRIDVIEW, JSON.stringify(gv));
}

export function setGridView(
	gv: GridViewState,
	sel: { column?: boolean; list?: boolean; expand?: boolean; collapse?: boolean; darktog?: boolean }
): GridViewState {
	const next: GridViewState = { ...gv };

	if (sel.column) {
		next.column = { checked: true };
		delete next.list;
	}
	if (sel.list) {
		next.list = { checked: true };
		delete next.column;
	}
	if (sel.expand) {
		next.expand = { checked: true };
		delete next.collapse;
	}
	if (sel.collapse) {
		next.collapse = { checked: true };
		delete next.expand;
	}
	if (sel.darktog) {
		if (next.darkmode) delete next.darkmode;
		else next.darkmode = { checked: true };
	}

	saveGridView(next);
	return next;
}

export { loadGridView };

// ============================================================
// Permissions
// ============================================================

export interface Permissions {
	view_calendars: boolean;
	drive_appdata: boolean;
}

// ============================================================
// vpConfiguration  –  Google OAuth + Drive AppData
// ============================================================

const DRIVE_FILE_NAME = 'settings002.json';
const SCOPES = [GOOGLE_SCOPES.CALENDAR_READONLY, GOOGLE_SCOPES.DRIVE_APPDATA].join(' ');

export class VpConfiguration {
	private permissions: Permissions;
	private appdata: AppData;
	private driveSnapshot: AppData;
	private driveFileId: string | null = null;

	/** Callbacks invoked after permissions + appdata are loaded */
	onLoad: (() => void)[] = [];

	constructor(permissions: Permissions, appdata: AppData) {
		this.permissions = permissions;
		this.appdata = appdata;
		this.driveSnapshot = { ...appdata };
	}

	load(): void {
		this.loadPermissionsThen(() => this.loadAppData());
	}

	authoriseThen(cb: () => void): void {
		this.loadPermissionsThen(cb);
	}

	private loadPermissionsThen(doThis: () => void): void {
		googleAuth
			.requestAccessToken({ scopes: SCOPES.split(' '), interactive: false })
			.then((response) => {
				this.permissions.view_calendars = response.scope.includes(GOOGLE_SCOPES.CALENDAR_READONLY);
				this.permissions.drive_appdata = response.scope.includes(GOOGLE_SCOPES.DRIVE_APPDATA);
				doThis();
			})
			.catch((error: unknown) => {
				console.error('Failed to authorize Google APIs', error);
				this.notifyLoad();
			});
	}

	private notifyLoad(): void {
		for (const cb of this.onLoad) cb();
	}

	private loadAppData(): void {
		if (!this.permissions.drive_appdata) {
			this.notifyLoad();
			return;
		}

		this.loadDriveFileId(() => {
			if (!this.driveFileId) {
				this.notifyLoad();
				return;
			}

			gapi.client
				.request({
					path: `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(this.driveFileId)}`,
					method: 'GET',
					params: { alt: 'media' }
				})
				.then((response: { body: string }) => {
					const loaded: AppData = JSON.parse(response.body);
					Object.assign(this.appdata, loaded);
					this.driveSnapshot = { ...this.appdata };
					this.notifyLoad();
				})
				.catch(this.fail);
		});
	}

	saveAppData(): void {
		this.driveSnapshot = { ...this.appdata };

		this.loadDriveFileId(() => {
			if (this.driveFileId) {
				this.writeFile();
			} else {
				gapi.client
					.request({
						path: 'https://www.googleapis.com/drive/v3/files',
						method: 'POST',
						params: { uploadType: 'resumable' },
						body: {
							name: DRIVE_FILE_NAME,
							mimeType: 'application/json',
							parents: ['appDataFolder']
						}
					})
					.then((response: { result: { id: string } }) => {
						this.driveFileId = response.result.id;
						this.writeFile();
					})
					.catch(this.fail);
			}
		});
	}

	private writeFile(): void {
		gapi.client
			.request({
				path: `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(this.driveFileId!)}`,
				method: 'PATCH',
				params: { uploadType: 'media' },
				body: JSON.stringify(this.driveSnapshot)
			})
			.catch(this.fail);
	}

	revertAppdata(): void {
		Object.assign(this.appdata, this.driveSnapshot);
	}

	private loadDriveFileId(then: () => void): void {
		if (this.driveFileId) {
			then();
			return;
		}

		gapi.client
			.request({
				path: 'https://www.googleapis.com/drive/v3/files',
				method: 'GET',
				params: { q: `name = '${DRIVE_FILE_NAME}'`, spaces: 'appDataFolder' }
			})
			.then((response: { result: { files: { id: string }[] } }) => {
				if (response.result.files.length === 1) this.driveFileId = response.result.files[0].id;
				then();
			})
			.catch(this.fail);
	}

	private fail(reason: { result: { error: { message: string } } }): void {
		alert(reason.result.error.message);
	}
}

// ============================================================
// Calendar / Event types
// ============================================================

export interface CalColour {
	text?: string;
	background?: string;
}

export interface VpEventData {
	id: string;
	cal: VpCalendar;
	colour: CalColour;
	timed: boolean;
	start: string;
	duration: number;
	desc: string;
	timestamp: number;
	title: string;
	location?: string;
	htmlLink?: string;
	edit: () => void;
}

export interface VpCalendarData {
	name: string;
	colour: CalColour;
	cls: { checked?: boolean };
	toggle: () => void;
	loadEvents: () => void;
	syncEvents: () => void;
}

// ============================================================
// vpGCal  –  Google Calendar service
// ============================================================

export class VpGCal {
	private cfg: AppData;
	private isoSpan: { start?: string; end?: string } = {};
	private fAdd: (evt: VpEventData) => void = () => {};
	private fRemove: (id?: string) => void = () => {};
	private fUpdate: () => void = () => {};
	private reqFailThen = 0;
	calendarlist: VpCalendar[] = [];
	private eventColours: Record<string, { foreground: string; background: string }> | null = null;

	/** Called once calendarlist is ready */
	onLoad?: (calendarlist: VpCalendar[]) => void;

	constructor(cfg: AppData) {
		this.cfg = cfg;
	}

	/** Call after permissions are confirmed. */
	init(permissions: Permissions): void {
		if (permissions.view_calendars) {
			this.reqCalendars({});
			this.loadGCalSettings();
		} else {
			this.notifyLoad();
		}
	}

	private notifyLoad(): void {
		this.onLoad?.(this.calendarlist);
	}

	private reqCalendars(reqparams: Record<string, string>): void {
		gapi.client
			.request({
				path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
				method: 'GET',
				params: reqparams
			})
			.then((response: { result: { items: GCalListItem[]; nextPageToken?: string } }) => {
				for (const item of response.result.items) {
					if (item.selected) this.calendarlist.push(new VpCalendar(item, this));
				}
				if (response.result.nextPageToken) {
					this.reqCalendars({ pageToken: response.result.nextPageToken });
				} else {
					this.notifyLoad();
				}
			})
			.catch(this.fail.bind(this));
	}

	addPublicCalendar(id: string, name: string, colour: string, textColour: string): void {
		this.calendarlist.push(
			new VpCalendar(
				{ id, summary: name, backgroundColor: colour, foregroundColor: textColour, selected: true },
				this
			)
		);
	}

	private loadGCalSettings(): void {
		gapi.client
			.request({
				path: 'https://www.googleapis.com/calendar/v3/users/me/settings/format24HourTime',
				method: 'GET'
			})
			.then((response: { result: { kind: string; id: string; value: string } }) => {
				if (
					response.result?.kind === 'calendar#setting' &&
					response.result.id === 'format24HourTime'
				)
					VpDateTime.time24h = response.result.value === 'true';
			});

		gapi.client
			.request({ path: 'https://www.googleapis.com/calendar/v3/colors', method: 'GET' })
			.then(
				(response: {
					result: {
						kind: string;
						event: Record<string, { foreground: string; background: string }>;
					};
				}) => {
					if (response.result?.kind === 'calendar#colors')
						this.eventColours = response.result.event;
				}
			);
	}

	register(
		add: (evt: VpEventData) => void,
		remove: (id?: string) => void,
		update: () => void
	): void {
		this.fAdd = add;
		this.fRemove = remove;
		this.fUpdate = update;
	}

	setStartDate(vdt: VpDate): void {
		this.isoSpan.start = vdt.dt.toISOString();
	}

	setEndDate(vdt: VpDate): void {
		this.isoSpan.end = vdt.dt.toISOString();
	}

	loadAllCalEvents(): void {
		this.fRemove();
		for (const cal of this.calendarlist) cal.loadEvents();
	}

	syncAllCalEvents(): void {
		for (const cal of this.calendarlist) cal.syncEvents();
	}

	// Internal helpers used by VpCalendar
	_getIsoSpan() {
		return this.isoSpan;
	}
	_getCfg() {
		return this.cfg;
	}
	_getEventColours() {
		return this.eventColours;
	}
	_getFAdd() {
		return this.fAdd;
	}
	_getFRemove() {
		return this.fRemove;
	}
	_getReqFailThen() {
		return this.reqFailThen;
	}
	_setReqFailThen(v: number) {
		this.reqFailThen = v;
	}
	_reAuth(cb: () => void, vpConfig: VpConfiguration) {
		vpConfig.authoriseThen(cb);
	}

	private fail(reason: { result: { error: { message: string } } }): void {
		console.error(reason);
		alert('Calendar error: ' + reason.result.error.message);
	}
}

// ============================================================
// Internal GCal item shapes
// ============================================================

interface GCalListItem {
	id: string;
	summary: string;
	backgroundColor: string;
	foregroundColor: string;
	selected: boolean;
}

interface GCalEventItem {
	id: string;
	kind: string;
	status?: string;
	summary?: string;
	location?: string;
	htmlLink?: string;
	colorId?: string;
	recurrence?: unknown;
	start?: { dateTime?: string; date?: string };
	end?: { dateTime?: string; date?: string };
}

// ============================================================
// VpCalendar
// ============================================================

export class VpCalendar implements VpCalendarData {
	name: string;
	colour: CalColour;
	cls: { checked?: boolean } = {};
	private id: string;
	private synctok: string | null = null;
	private gcal: VpGCal;

	constructor(item: GCalListItem, gcal: VpGCal) {
		this.id = item.id;
		this.name = item.summary;
		this.colour = { text: item.foregroundColor, background: item.backgroundColor };
		this.gcal = gcal;
		this.syncStorage(false);
	}

	private reqEvents(reqparams: Record<string, string | boolean>): void {
		gapi.client
			.request({
				path: `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.id)}/events`,
				method: 'GET',
				params: reqparams
			})
			.then(
				(response: {
					result: { items: GCalEventItem[]; nextPageToken?: string; nextSyncToken?: string };
				}) => {
					for (const item of response.result.items) this.makeEvent(item, reqparams);
					if (response.result.nextPageToken) {
						this.reqEvents({ ...reqparams, pageToken: response.result.nextPageToken });
					} else if (response.result.nextSyncToken) {
						this.synctok = response.result.nextSyncToken;
					}
				}
			)
			.catch((reason: { status: number; result: { error: { message: string } } }) => {
				const now = Date.now();
				if (now - this.gcal._getReqFailThen() < 3000) return;
				this.gcal._setReqFailThen(now);

				if (reason.status === 401) {
					// re-auth then reload – vpConfig needs to be injected; expose via gcal
					this.gcal.loadAllCalEvents();
				} else if (reason.status === 410) {
					this.gcal.loadAllCalEvents();
				} else {
					alert(reason.result.error.message);
				}
			});
	}

	private makeEvent(item: GCalEventItem, reqparams: Record<string, string | boolean>): void {
		if (item.kind !== 'calendar#event') return;
		if (item.status === 'cancelled') {
			this.gcal._getFRemove()(item.id);
			return;
		}
		if (item.recurrence) return;
		if (!item.start) return;

		if (reqparams.syncToken) this.gcal._getFRemove()(item.id);

		const evt = new VpEvent(this, item, this.gcal._getCfg(), this.gcal._getEventColours());

		if (evt.timed) {
			if (this.gcal._getCfg().show_timed_events) this.gcal._getFAdd()(evt);
		} else {
			if (this.gcal._getCfg().show_all_day_events) this.gcal._getFAdd()(evt);
		}
	}

	loadEvents(): void {
		const span = this.gcal._getIsoSpan();
		this.reqEvents({ timeMin: span.start!, timeMax: span.end!, singleEvents: true });
	}

	syncEvents(): void {
		if (this.synctok) this.reqEvents({ syncToken: this.synctok, singleEvents: true });
	}

	toggle(): void {
		this.cls.checked = !this.cls.checked;
		this.syncStorage(true);
		this.gcal['fUpdate']?.();
	}

	private syncStorage(write: boolean): void {
		let tog: Record<string, boolean> = {};
		try {
			const raw = localStorage.getItem(STORAGE_KEY_CALTOG);
			if (raw) tog = JSON.parse(raw);
		} catch {
			console.error('Failed to parse calendar toggle storage');
		}

		if (write) {
			delete tog[this.id];
			if (this.cls.checked) tog[this.id] = true;
			localStorage.setItem(STORAGE_KEY_CALTOG, JSON.stringify(tog));
		} else {
			if (tog[this.id]) this.cls.checked = true;
		}
	}
}

// ============================================================
// VpEvent
// ============================================================

export class VpEvent implements VpEventData {
	id: string;
	cal: VpCalendar;
	colour: CalColour;
	timed: boolean;
	start: string;
	duration: number;
	desc: string;
	timestamp: number;
	title: string;
	location?: string;
	htmlLink?: string;

	constructor(
		cal: VpCalendar,
		item: GCalEventItem,
		cfg: AppData,
		eventColours: Record<string, { foreground: string; background: string }> | null
	) {
		this.id = item.id;
		this.cal = cal;
		this.location = item.location;
		this.htmlLink = item.htmlLink;
		this.title = cal.name + ' | ';

		// Colour
		this.colour = {};
		if (cfg.event_background === 'cal') this.colour = cal.colour;
		if (cfg.event_background === 'white') this.colour = { background: '#ffffff' };
		if (cfg.event_background === 'evt') {
			this.colour = cal.colour;
			if (item.colorId && eventColours?.[item.colorId]) {
				const c = eventColours[item.colorId];
				this.colour = { text: c.foreground, background: c.background };
			}
		}

		if (item.start?.dateTime) {
			this.timed = true;
			const vdtStart = new VpDateTime(item.start.dateTime);
			const vdtEnd = new VpDateTime(item.end!.dateTime!);
			this.start = vdtStart.ymd();
			this.duration = VpDate.DaySpan(vdtStart.ymd(), vdtEnd.ymd()) + 1;
			this.desc = vdtStart.TimeTitle() + ' ';
			this.timestamp = vdtStart.DayMinutes();
		} else {
			this.timed = false;
			this.start = item.start!.date!;
			this.duration = VpDate.DaySpan(item.start!.date!, item.end!.date!);
			this.desc = '';
			this.timestamp = -1;
		}

		if (item.summary) this.desc += item.summary;
		this.title += this.desc;
		if (item.location) this.title += '\n' + item.location;
	}

	edit(): void {
		if (this.htmlLink) window.open(this.htmlLink.replace('event?eid=', 'r/eventedit/'));
	}
}

// ============================================================
// Diary types
// ============================================================

export interface LabelBorder {
	first?: boolean;
	last?: boolean;
}

export interface VpLabelStyle extends Record<string, string> {}

// ============================================================
// VpDiary
// ============================================================

export class VpDiary {
	private cfg: AppData;
	private view: GridViewState;
	private vpmonths: VpMonth[] = [];
	private vpdays: VpDay[] = [];
	private ymdFirst = '';
	private gcal: VpGCal;

	/** Notify Svelte component that layout changed */
	onUpdate?: () => void;

	private tmoHandle: ReturnType<typeof setTimeout> | null = null;

	constructor(cfg: AppData, view: GridViewState, gcal: VpGCal) {
		this.cfg = cfg;
		this.view = view;
		this.gcal = gcal;
		gcal.register(
			this.addEvent.bind(this),
			this.removeEvent.bind(this),
			this.updateEvents.bind(this)
		);
	}

	makePage(vdt: VpDate, pagelength: number): void {
		VpDate.weekends = this.cfg.weekends.split(',').map((s) => parseInt(s));
		VpDate.localemonth = this.cfg.month_names.split('-');

		this.gcal.setStartDate(vdt);
		this.ymdFirst = vdt.ymd();

		this.vpmonths = [];
		this.vpdays = [];

		const vdtNext = new VpDate(vdt);
		for (let i = 0; i < pagelength; i++) {
			const month = new VpMonth(vdtNext, this.cfg);
			month.index = this.vpmonths.length;
			this.vpmonths.push(month);
			vdtNext.offsetMonth(1);
			this.gcal.setEndDate(vdtNext);
		}

		this.gcal.loadAllCalEvents();
	}

	getPage(): VpMonth[] {
		return this.vpmonths;
	}
	getMonth(i: number): VpMonth {
		return this.vpmonths[i];
	}

	sync(): void {
		this.gcal.syncAllCalEvents();
	}

	private scheduledUpdate(delay: number): void {
		if (this.tmoHandle) clearTimeout(this.tmoHandle);
		this.tmoHandle = setTimeout(() => {
			this.updateLayout();
			this.onUpdate?.();
		}, delay);
	}

	private addEvent(evt: VpEventData): void {
		let d = VpDate.DaySpan(this.ymdFirst, evt.start);
		for (let c = 0; c < evt.duration; c++) {
			if (this.vpdays[d]) {
				const border: LabelBorder = {};
				if (c === 0) border.first = true;
				if (c === evt.duration - 1) border.last = true;
				this.vpdays[d].addEvent(evt, border, this.cfg, this.view);
			}
			d++;
		}
		this.scheduledUpdate(1000);
	}

	private removeEvent(id?: string): void {
		for (const month of this.vpmonths) month.removeEvent(id);
		this.scheduledUpdate(100);
	}

	private updateEvents(): void {
		this.scheduledUpdate(100);
	}

	private updateLayout(): void {
		for (const month of this.vpmonths) month.updateLayout(this.view);
	}
}

// ============================================================
// VpMonth
// ============================================================

export class VpMonth {
	id: string;
	hdr: string;
	gcalUrl: string;
	year: number;
	days: VpDay[];
	dayoffset: number;
	cls: Record<string, boolean>;
	labels?: VpLabel[];
	index = 0;

	constructor(vdt: VpDate, cfg: AppData) {
		this.id = 'M-' + vdt.ym();
		this.hdr = vdt.MonthTitle();
		this.gcalUrl = vdt.GCalURL();
		this.year = vdt.dt.getFullYear();
		this.days = [];
		this.dayoffset = 0;
		this.cls = {};

		if (vdt.isPastMonth()) this.cls.past = true;

		const vdtDay = new VpDate(vdt);
		const m = vdtDay.getMonth();
		while (m === vdtDay.getMonth()) {
			const vpday = new VpDay(this, vdtDay);
			vpday.index = this.days.length;

			if (vpday.index === 0 && cfg.align_weekends) {
				this.dayoffset = vdtDay.DayOfWeek() - cfg.first_day_of_week;
				if (this.dayoffset < 0) this.dayoffset += 7;
				vpday.cls['offset' + this.dayoffset] = true;
			}

			this.days.push(vpday);
			vdtDay.offsetDay(1);
		}

		if (vdt.isCurrentMonth()) {
			this.days[new Date().getDate() - 1].cls.today = true;
		}
	}

	addEvent(day: VpDay, evt: VpEventData, border: LabelBorder): void {
		if (!this.labels) this.labels = [];
		for (const lab of this.labels) {
			if (lab.evt === evt) {
				lab.setCellEnd(day.index, border);
				return;
			}
		}
		const lab = new VpLabel(evt);
		lab.setCellStart(this, day.index, border);
		lab.setCellEnd(day.index, border);
		this.labels.push(lab);
	}

	removeEvent(id?: string): void {
		removeEventFromOwner(this, id);
		for (const day of this.days) day.removeEvent(id);
	}

	updateLayout(view: GridViewState): void {
		const slots: number[] = [];
		if (this.labels) for (const lab of this.labels) lab.updateLayout(slots, view, this);
		for (const day of this.days) day.updateLayout(slots, view);
	}

	onclickHdr(): void {
		window.open('https://www.google.com/calendar/r/month/' + this.gcalUrl);
	}
}

// ============================================================
// VpDay
// ============================================================

export class VpDay {
	num: number;
	datevalue: number;
	month: VpMonth;
	cls: Record<string, boolean>;
	labels?: VpLabel[];
	labelboxstyle: Record<string, string> = {};
	index = 0;

	constructor(vpmonth: VpMonth, vdt: VpDate) {
		this.num = vdt.DayOfMonth();
		this.datevalue = vdt.dt.valueOf();
		this.month = vpmonth;
		this.cls = {};
		if (vdt.isWeekend()) this.cls.weekend = true;
	}

	addEvent(evt: VpEventData, border: LabelBorder, cfg: AppData, view: GridViewState): void {
		if (evt.duration > 1 || (cfg.single_day_as_multi_day && !evt.timed)) {
			this.month.addEvent(this, evt, border);
			return;
		}
		if (!this.labels) this.labels = [];
		this.labels.push(new VpLabel(evt));
	}

	removeEvent(id?: string): void {
		removeEventFromOwner(this, id);
	}

	updateLayout(slots: number[], view: GridViewState): void {
		this.labelboxstyle = {};
		if (this.labels) {
			const key = Math.pow(2, this.index);
			for (let i = slots.length - 1; i >= 0; i--) {
				if (key & slots[i]) {
					const slotmargin = (i + 1) * 1.4 + 0.5;
					const prop = view.column ? 'margin-right' : 'margin-bottom';
					this.labelboxstyle[prop] = slotmargin + 'em';
					break;
				}
			}
			for (const lab of this.labels) lab.updateLayout([], view, this.month);
		}
	}

	onclickNum(evt: MouseEvent): void {
		const vdt = new VpDate(this.datevalue);
		if (evt.ctrlKey)
			window.open('https://www.google.com/calendar/r/eventedit?dates=' + vdt.GCalSpanURL(1));
		else window.open('https://www.google.com/calendar/r/day/' + vdt.GCalURL());
	}
}

// ============================================================
// VpLabel
// ============================================================

export class VpLabel {
	evt: VpEventData;
	cls: Record<string, boolean> = {};
	style: Record<string, string> = {};
	multiboxstyle?: Record<string, string>;

	private _month?: VpMonth;
	private _day = 0;
	private _span = 1;

	constructor(evt: VpEventData) {
		this.evt = evt;
		const clr = evt.colour;
		if (clr.text) this.style['color'] = clr.text;
		if (clr.background) this.style['background-color'] = clr.background;
	}

	setCellStart(vpmonth: VpMonth, iday: number, border: LabelBorder): void {
		this._month = vpmonth;
		this._day = iday;
		this._span = 1;
		this.multiboxstyle = {};
		if (border.first) this.cls.borderfirst = true;
	}

	setCellEnd(iday: number, border: LabelBorder): void {
		this._span = iday - this._day + 1;
		if (border.last) this.cls.borderlast = true;
	}

	updateLayout(slots: number[], view: GridViewState, month: VpMonth): void {
		this.style.display = 'none';
		if (this.multiboxstyle) this.multiboxstyle.display = 'none';

		if (this.evt.cal.cls.checked) return;

		delete this.style.display;

		if (this.multiboxstyle && this._month) {
			const slot = getSlot(slots, this._day, this._span);

			delete this.multiboxstyle.display;
			const posProp = view.column ? 'right' : 'bottom';
			this.style[posProp] = 0.5 + 1.4 * slot + 'em';

			const gridMain = view.column ? 'grid-column' : 'grid-row';
			const gridCross = view.column ? 'grid-row' : 'grid-column';
			this.multiboxstyle[gridMain] = this._month.id + ' / span 1';
			this.multiboxstyle[gridCross] =
				`${this._month.dayoffset + this._day + 2} / span ${this._span}`;
		}
	}
}

// ============================================================
// Helpers
// ============================================================

function getSlot(slots: number[], day: number, span: number): number {
	const key = (Math.pow(2, span) - 1) << day;
	for (let i = 0; i < slots.length; i++) {
		if (key & slots[i]) continue;
		slots[i] |= key;
		return i;
	}
	slots.push(key);
	return slots.length - 1;
}

function removeEventFromOwner(owner: { labels?: VpLabel[] }, id?: string): void {
	if (!owner.labels) return;
	if (id) {
		for (let i = 0; i < owner.labels.length; i++) {
			if (owner.labels[i].evt.id === id) {
				owner.labels.splice(i, 1);
				return;
			}
		}
	} else {
		delete owner.labels;
	}
}

// ============================================================
// Grid controller logic  (replaces vpGrid directive)
// Returned as a plain class to be instantiated in the Svelte
// component's <script> block. It manipulates plain reactive
// variables which the component can $state-wrap.
// ============================================================

export interface GridState {
	fontscale: number;
	past_opacity: number;
	scroll_size: number;
	scroll_size_portrait: number;
	singledaytext: boolean;
	multidaytext: boolean;
	multidayscale: number;
	cls: Record<string, boolean>;
	sbox_cls: Record<string, boolean>;
	page: VpMonth[];
	gridareas: string;
	year: number;
}

export class VpGrid {
	private cfg: AppData;
	private view: GridViewState;
	private diary: VpDiary;
	private vpConfig: VpConfiguration;
	private buffer = 0;
	private pagelength = 0;
	private vislength = 0;
	private vdt?: VpDateMonth;

	/** Reactive grid state – wire up to $state in your component */
	state: GridState = {
		fontscale: 1,
		past_opacity: 0.6,
		scroll_size: 100,
		scroll_size_portrait: 200,
		singledaytext: true,
		multidaytext: true,
		multidayscale: 1,
		cls: {},
		sbox_cls: {},
		page: [],
		gridareas: '',
		year: new Date().getFullYear()
	};

	/** Called after layout is ready; use to trigger scroll positioning */
	onPageLoaded?: (buffer: number) => void;
	/** Called to re-render (trigger Svelte reactivity) */
	onUpdate?: () => void;

	constructor(cfg: AppData, view: GridViewState, diary: VpDiary, vpConfig: VpConfiguration) {
		this.cfg = cfg;
		this.view = view;
		this.diary = diary;
		this.vpConfig = vpConfig;
		diary.onUpdate = () => this.onUpdate?.();
	}

	start(): void {
		const cfg = this.cfg;
		this.buffer = cfg.scroll_buffer;
		this.vislength = cfg.month_count;
		this.pagelength = this.buffer + this.vislength + this.buffer;

		this.state.fontscale = cfg.font_scale_pc / 100;
		this.state.past_opacity = cfg.past_opacity;
		this.state.scroll_size = (this.pagelength / this.vislength) * 100;
		this.state.scroll_size_portrait = this.state.scroll_size * 2;
		this.state.singledaytext = cfg.text_on_singleday_events;
		this.state.multidaytext = cfg.text_on_multiday_events;
		this.state.multidayscale = cfg.scale_of_multiday_events / 100;
		this.state.cls = cfg.same_row_height ? {} : { flexrow: true };
		this.state.sbox_cls = cfg.hide_scrollbars ? { hidescroll: true } : {};

		this.initDate();
		this.loadPage();
	}

	reset(): void {
		this.start();
	}

	private initDate(): void {
		this.vdt = new VpDateMonth();
		if (this.cfg.auto_scroll) {
			this.vdt.offsetMonth(this.cfg.auto_scroll_offset);
		} else {
			let off = this.cfg.first_month - 1 - new Date().getMonth();
			if (off > 0) off -= 12;
			this.vdt.offsetMonth(off);
		}
	}

	private loadPage(): void {
		const vdtPage = new VpDate(this.vdt!);
		vdtPage.offsetMonth(-this.buffer);

		this.diary.makePage(vdtPage, this.pagelength);
		this.state.page = this.diary.getPage();
		this.state.gridareas = this.getGridAreas(this.state.page);
		this.state.year = this.vdt!.dt.getFullYear();
		this.onUpdate?.();

		setTimeout(() => {
			this.onPageLoaded?.(this.buffer);
		});
	}

	private getGridAreas(page: VpMonth[]): string {
		let gridareas = '';
		for (const month of page) {
			if (this.view.column) gridareas += month.id + ' ';
			if (this.view.list) gridareas += '"' + month.id + '" ';
		}
		if (this.view.column) return '"' + gridareas + '"';
		return gridareas;
	}

	getVisInfo(
		scrollbox: HTMLElement,
		monthdivs: NodeListOf<HTMLElement>
	): { months: VpMonth[]; index: number } {
		const info: { months: VpMonth[]; index: number } = { months: [], index: 0 };
		const scrollpos = this.view.column ? scrollbox.scrollLeft : scrollbox.scrollTop;

		for (let i = 0; i < monthdivs.length; i++) {
			const hdr = monthdivs[i].firstElementChild as HTMLElement;
			const monthpos = this.view.column ? hdr.offsetLeft : hdr.offsetTop;
			const monthsize = this.view.column ? hdr.offsetWidth : hdr.offsetHeight;

			if (monthpos + monthsize / 2 > scrollpos) info.months.push(this.diary.getPage()[i]);
			if (info.months.length === 1) info.index = i;
			if (info.months.length === this.vislength) break;
		}
		return info;
	}

	onclickColumn(view: GridViewState): GridViewState {
		if (view.column) return view;
		return setGridView(view, { column: true });
	}

	onclickList(view: GridViewState): GridViewState {
		if (view.list) return view;
		return setGridView(view, { list: true });
	}

	onclickExpand(view: GridViewState): GridViewState {
		return view.expand
			? setGridView(view, { collapse: true })
			: setGridView(view, { expand: true });
	}

	onclickDarkMode(view: GridViewState): GridViewState {
		return setGridView(view, { darktog: true });
	}

	onclickContinue(scrollbox: HTMLElement, monthdivs: NodeListOf<HTMLElement>): void {
		const visinfo = this.getVisInfo(scrollbox, monthdivs);
		this.vdt!.offsetMonth(visinfo.index - this.buffer);
		this.loadPage();
	}

	onclickNavbar(evtX: number, navbarWidth: number): void {
		const dayPx = navbarWidth / (365 * 5.5);
		const yearPt = navbarWidth / 2;
		const clickOff = evtX - yearPt;
		const dayOff = Math.round(clickOff / dayPx);
		const clickMonth = new Date(this.state.year, 6, dayOff);
		this.vdt = new VpDateMonth(clickMonth.getFullYear(), clickMonth.getMonth() + 1);
		this.loadPage();
	}

	onkeydown(evt: KeyboardEvent): void {
		if (!evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return;
		if (evt.key === 'Enter') evt.preventDefault();
	}

	onWheel(evt: WheelEvent, scrollbox: HTMLElement): void {
		if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return;
		if (!this.cfg.hide_scrollbars) return;

		if (this.view.column) {
			const colwidth = scrollbox.offsetWidth / this.cfg.month_count;
			scrollbox.scrollBy(evt.deltaY > 0 ? colwidth : -colwidth, 0);
		} else if (this.view.list) {
			const colheight = scrollbox.offsetHeight / this.cfg.month_count;
			scrollbox.scrollBy(0, evt.deltaY > 0 ? colheight : -colheight);
		}

		evt.preventDefault();
	}
}
