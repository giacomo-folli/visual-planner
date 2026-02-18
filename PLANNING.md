# PLAN.md

## Project Goal

Refactor the legacy `Visual-Planner` into a modern **Svelte 5**, **TypeScript**, and **Tailwind CSS** application. The app will visualize Google Calendar events in a continuous vertical or horizontal year view.

## 1. Tech Stack & Constraints

* **Framework:** Svelte 5 (Vite).
* **Reactivity:** **Strict Runes mode**. Use `$state`, `$derived`, `$effect`, and `$props`. **Do NOT** use `export let` or `$:`.
* **Language:** TypeScript (Strict mode).
* **Styling:** Tailwind CSS.
* **Auth:** Google Identity Services (GIS) - "Token Model" (for client-side apps).
* **API:** Google Calendar REST API (via `fetch`, not `gapi` client library).

## 2. File Structure

```text
visual-planner/
├── public/
│   └── index.html             // Loads GIS script (https://accounts.google.com/gsi/client)
├── src/
│   ├── assets/
│   │   └── app.css            // Tailwind directives
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.svelte      // Controls (Auth status, View toggles)
│   │   ├── calendar/
│   │   │   ├── YearView.svelte    // Virtualized or grid container
│   │   │   ├── MonthColumn.svelte // Columns for vertical layout
│   │   │   ├── DayCell.svelte     // Individual day slot
│   │   │   └── EventChip.svelte   // The colored event text
│   ├── lib/
│   │   ├── auth.svelte.ts         // Global Auth State (Svelte 5 Class)
│   │   ├── calendar.svelte.ts     // Global Calendar Data State (Svelte 5 Class)
│   │   ├── api.ts                 // Raw fetch wrappers for Google Calendar API
│   │   └── dateUtils.ts           // Date-fns or native Intl helpers
│   ├── types/
│   │   ├── google-gis.d.ts        // Type definitions for google.accounts.oauth2
│   │   └── events.ts              // Interfaces for CalendarEvent, API responses
│   ├── App.svelte                 // Root: Handles Auth Guard & Layout
│   └── main.ts

```

## 3. Implementation Details

### A. Authentication (Google Identity Services)

We will use the GIS "Token Model" to get an Access Token. We will **not** use the legacy `gapi` client.

**File:** `src/lib/auth.svelte.ts`

* Create a generic class `AuthService`.
* **State:** `isAuthenticated` (bool), `token` (string | null), `userProfile` (object).
* **Method `init()`:** Checks for `google.accounts.oauth2`.
* **Method `login()`:** Calls `tokenClient.requestAccessToken()`.
* **Method `logout()`:** Clears state and revokes token.

### B. Data Fetching (REST API)

Since we have the `access_token`, we will use standard `fetch` to get events. This avoids the bloat of the Google JS Client Library.

**File:** `src/lib/api.ts`

* **Endpoint:** `GET https://www.googleapis.com/calendar/v3/calendars/primary/events`
* **Params:** `timeMin`, `timeMax`, `singleEvents=true`, `orderBy=startTime`.
* **Headers:** `Authorization: Bearer ${accessToken}`.

### C. State Management (Svelte 5 Runes)

**File:** `src/lib/calendar.svelte.ts`

* Use a class `CalendarManager`.
* `events = $state<CalendarEvent[]>([])`
* `viewMode = $state<'list' | 'column'>('column')`
* `filteredEvents = $derived(...)` -> filters events based on search/config.
* **Optimization:** The Year View can be heavy. Use `$derived` to group events by Month/Day efficiently so the UI only iterates over pre-grouped data.

### D. Component Architecture

1. **App.svelte:**
* Uses `$effect` to check `auth.isAuthenticated`.
* If false -> Show `LoginHero.svelte`.
* If true -> Show `Header` + `YearView`.


2. **YearView.svelte:**
* Iterates over 12 months.
* Passes filtered events to `MonthColumn`.


3. **EventChip.svelte:**
* Logic to handle multi-day spanning (visual styling only, or duplicating the chip across days if using a column layout).



## 4. Step-by-Step Agent Instructions

1. **Setup:** Initialize Vite + Svelte + Tailwind.
2. **Types:** Create `src/types/google-gis.d.ts` to type the global `google` object manually (since `@types/google.accounts` can be flaky).
3. **Auth:** Implement `auth.svelte.ts`. Ensure `index.html` loads the GIS script.
4. **API:** Implement `api.ts` to fetch events using `fetch()`.
5. **Store:** Create `calendar.svelte.ts` to bridge Auth -> API -> UI.
6. **UI:** Build `App.svelte` and `YearView.svelte`.

## 5. Reference Code (Svelte 5 Pattern)

**Correct Global State Pattern:**

```typescript
// src/lib/auth.svelte.ts
class AuthService {
    token = $state<string | null>(null);
    
    constructor() {
        // Init logic
    }

    get isAuthenticated() {
        return this.token !== null;
    }

    login() { /* ... */ }
}

export const auth = new AuthService();

```

**Correct Component Usage:**

```svelte
<script lang="ts">
    import { auth } from './lib/auth.svelte';

    $effect(() => {
        if (auth.isAuthenticated) {
            console.log("User is logged in");
        }
    });
</script>

{#if auth.isAuthenticated}
    <MainApp />
{:else}
    <LoginButton />
{/if}

```
