# TASKS.md

## 2. Authentication (Google Identity Services)

* [ ] **Type Definitions:** Create `src/types/google-gis.d.ts`.
* *Action:* Manually define `google.accounts.oauth2` interfaces (TokenClient, TokenResponse) to avoid flaky `@types` packages.


* [ ] **HTML Entry Point:** Update `index.html` to load the GIS script: `<script src="https://accounts.google.com/gsi/client" async defer></script>`.
* [ ] **Auth State (Runes):** Create `src/lib/auth.svelte.ts`.
* *Action:* Export a global class `AuthService` using `$state`.
* *Properties:* `token` (string | null), `isAuthenticated` (derived boolean), `user` (object | null).
* *Method:* `init()` checks if the google script is loaded.
* *Method:* `login()` calls `initTokenClient` and requests an access token.
* *Method:* `logout()` clears state and revokes token.


* [ ] **Login UI:** Create `src/components/LoginHero.svelte`.
* *Action:* Render a centered "Sign in with Google" button. Bind its click event to `auth.login()`.


* [ ] **Integration:** Update `App.svelte` to conditionally render `LoginHero` or a placeholder "Dashboard" based on `auth.isAuthenticated`.
* *Verification:* Click the button, complete the Google pop-up flow, and verify `auth.token` is logged to the console.



## 3. Calendar Data & API Service

* [ ] **Data Types:** Create `src/types/events.ts`.
* *Action:* Define interfaces for `CalendarEvent` (id, summary, start, end, colorId) and `CalendarListResponse`.


* [ ] **API Service:** Create `src/lib/api.ts`.
* *Action:* Export a function `fetchEvents(token, timeMin, timeMax)`.
* *Logic:* Use standard `fetch()` against `https://www.googleapis.com/calendar/v3/calendars/primary/events`.
* *Params:* `singleEvents=true`, `orderBy=startTime`.


* [ ] **Calendar State (Runes):** Create `src/lib/calendar.svelte.ts`.
* *Action:* Export a global class `CalendarManager` using `$state`.
* *Properties:* `events` (array), `loading` (boolean), `error` (string | null).
* *Method:* `loadYear(year)` calculates start/end ISO strings for the year and calls `api.fetchEvents`.
* *Computed:* Add a `$derived` property `eventsByMonth` that groups the flat event list into a `Record<number, CalendarEvent[]>` for easier rendering.
* *Verification:* After login, the app automatically triggers `loadYear(2026)` and logs the grouped events to the console.



## 4. Core Visualization (The Wall Planner)

* [ ] **Layout Shell:** Create `src/components/layout/Header.svelte`.
* *Content:* Display the current Year, a "Refresh" button, and a "Sign Out" button.


* [ ] **Year Container:** Create `src/components/calendar/YearView.svelte`.
* *Layout:* Use CSS Grid/Flex to render 12 columns (one for each month).


* [ ] **Month Column:** Create `src/components/calendar/MonthColumn.svelte`.
* *Props:* `month` (number), `year` (number), `events` (CalendarEvent[]).
* *Logic:* Generate an array of days for that specific month (28, 30, or 31 days).


* [ ] **Day Cell:** Create `src/components/calendar/DayCell.svelte`.
* *Props:* `date` (Date object), `events` (CalendarEvent[]).
* *Visuals:* Render the day number. Highlight weekends with a light gray background.


* [ ] **Event Chip:** Create `src/components/calendar/EventChip.svelte`.
* *Props:* `event` (CalendarEvent).
* *Visuals:* Render a small block with the event `summary`. Use the `event.colorId` (map Google color IDs to Tailwind classes or hex codes).
* *Verification:* The main screen shows a full 12-month column view populated with your real Google Calendar events.



## 5. Refinement & Features

* [ ] **Multi-Day Event Logic:**
* *Logic:* In `calendar.svelte.ts`, process events that span multiple days. Either clone them into each day's array OR implement a visual "span" logic (cloning is easier for the column view).


* [ ] **View Toggles:**
* *Action:* Add a toggle in `Header.svelte` to switch between "Column View" (vertical months) and "List View" (continuous vertical list).


* [ ] **Print Styles:**
* *Action:* Add `@media print` styles in `app.css`. Hide the Header/Buttons and ensure the calendar grid fits on A4/Letter paper (landscape).


* [ ] **Error Handling:**
* *Action:* Add a "Toast" or "Alert" component to display API errors (e.g., "Network Error" or "Token Expired").
