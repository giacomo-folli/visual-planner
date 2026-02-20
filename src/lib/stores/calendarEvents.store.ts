import { writable, type Subscriber, type Unsubscriber } from 'svelte/store';
import type { GoogleCalendarEvent } from '../../types/google';
import { CAL_EVENTS_LOCALSTORAGE_KEY } from '../../types/enums';
import { DateTime } from 'luxon';

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

                // Simple temp function to format DateTime obj
                const f = (d: DateTime): string => d.toFormat('yyyy-LL-dd')

                // Populate with new data
                for (const e of newEvents) {
                    if (!e.start.date && !e.start.dateTime) continue

                    const start = e.start?.date
                        ? DateTime.fromISO(e.start.date)
                        : DateTime.fromISO(e.start?.dateTime)
                    const end = e.end?.date
                        ? DateTime.fromISO(e.end.date)
                        : DateTime.fromISO(e.end?.dateTime)

                    if (!start) throw new Error("No start date!")

                    if (!end || f(start) == f(end)) {
                        const dayEvents = events.get(f(start)) || []
                        events.set(f(start), dayEvents.concat(e))
                    } else {
                        const diff = end.diff(start).as('days') - 1
                        for (let i = 0; i < diff; i++) {
                            const currDay = f(start.plus({ days: i }))
                            const dayEvents = events.get(currDay) || []
                            events.set(currDay, dayEvents.concat(e))
                        }
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