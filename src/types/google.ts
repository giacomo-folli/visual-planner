type EventType =
	| "birthday" // Special all-day events with an annual recurrence.
	| "default" // Regular events.
	| "focusTime" // Focus time events.
	| "fromGmail" // Events from Gmail.
	| "outOfOffice" // Out of office events.
	| "workingLocation" // Working location events.

type CalendarDate = {
	date: string,
	dateTime: string,
	timeZone: string
}

export interface GoogleCalendarEvent {
	birthdayProperties: { type: string }
	created: string
	creator: { email: string, self: boolean }
	start: CalendarDate
	end: CalendarDate
	etag: string
	eventType: EventType
	htmlLink: string
	iCalUID: string
	id: string
	kind: string
	organizer: { email: string, self: boolean }
	originalStartTime: { date: string }
	recurringEventId: string
	reminders: { useDefault: boolean }
	sequence: number
	status: string
	summary: string
	transparency: string
	updated: string
	visibility: string
	recurrence?: [
		string
	],
	attachments?: [
		{
			fileUrl: string,
			title: string,
			mimeType: string,
			iconLink: string,
			fileId: string
		}
	],
}