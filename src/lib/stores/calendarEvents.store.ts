import { writable, type Subscriber, type Unsubscriber } from 'svelte/store';
import type { GoogleCalendarEvent } from '../../types/google';
import { CAL_EVENTS_LOCALSTORAGE_KEY } from '../../types/enums';

type CalendarStoreObject = Map<string, GoogleCalendarEvent[]>

export interface CalendarEventStore {
    subscribe: (this: void, run: Subscriber<CalendarStoreObject>, invalidate?: () => void)
        => Unsubscriber
    add: (e: GoogleCalendarEvent[]) => void,
    remove: (e: GoogleCalendarEvent) => void,
    set: (map: CalendarStoreObject) => void,
    clear: () => void
}

function createCalendarEventStore(): CalendarEventStore {
    const { subscribe, set, update } = writable<CalendarStoreObject>(new Map());

    return {
        subscribe,
        add: (newEvents: GoogleCalendarEvent[]) => {
            console.log("adding new events")
            update(events => {
                // For now always overwrite old data
                events.clear()
                if (!Array.isArray(newEvents)) return events

                // Populate with new data
                for (const e of newEvents) {
                    if (!e.start.date && !e.start.dateTime) continue

                    const date = e.start?.date || e.start.dateTime.split('T')[0]
                    if (events.has(date)) {
                        const dayEvents = events.get(date) || []
                        events.set(date, dayEvents.concat(e))
                    } else {
                        events.set(date, [e])
                    }
                }

                console.log("backup in localStorage")
                console.log(events)
                localStorage.setItem(CAL_EVENTS_LOCALSTORAGE_KEY, JSON.stringify(Array.from(events.entries())))

                return events
            })
        },
        remove: (e: GoogleCalendarEvent) =>
            update(events => {
                const dayEvents = events.get(e.start.date) || []
                events.set(e.start.date, dayEvents.filter(dayEv => dayEv.id !== e.id))
                return events
            }),
        set: (map: CalendarStoreObject) =>
            update(events => {
                events.clear()
                return map
            }),
        clear: () => set(new Map()),
    };
}

export const calendarEvents = createCalendarEventStore();