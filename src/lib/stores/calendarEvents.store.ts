import { writable, type Subscriber, type Unsubscriber } from 'svelte/store';
import type { GoogleCalendarEvent } from '../../types/google';
import { CALENDAR_EVENTS_LOCAL_STORAGE_KEY } from '../../types/enums';

export interface CalendarEventStore {
    subscribe: (this: void, run: Subscriber<GoogleCalendarEvent[]>, invalidate?: () => void)
        => Unsubscriber
    add: (e: GoogleCalendarEvent[]) => void,
    remove: (id: string) => void,
    update: (id: string, changes: Partial<GoogleCalendarEvent>) => void,
    clear: () => void
}

function createCalendarEventStore(): CalendarEventStore {
    const { subscribe, set, update } = writable<GoogleCalendarEvent[]>([]);

    return {
        subscribe,
        add: (newEvents: GoogleCalendarEvent[]) => {
            console.log("adding event")
            update(events => {
                const newEventsArr = [...events, ...newEvents]
                console.log("backup in localStorage")
                localStorage.setItem(CALENDAR_EVENTS_LOCAL_STORAGE_KEY, JSON.stringify(newEventsArr))

                return newEventsArr
            })
        },
        remove: (id: string) =>
            update(events => events.filter(e => e.id !== id)),
        update: (id: string, changes: Partial<GoogleCalendarEvent>) =>
            update(events =>
                events.map(e => (e.id === id ? { ...e, ...changes } : e))
            ),
        clear: () => set([]),
    };
}

export const calendarEvents = createCalendarEventStore();