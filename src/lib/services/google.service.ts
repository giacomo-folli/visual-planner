import type { CalendarEventStore } from "$lib/stores/calendarEvents.store";

interface TokenResponse extends google.accounts.oauth2.TokenResponse { }

interface TokenClient extends google.accounts.oauth2.TokenClient {
    callback?: (tokenResponse: TokenResponse) => void
}

interface QueryParams {
    maxResults?: number
    to?: Date
    from?: Date
}

class GoogleService {
    static CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    static SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

    private tokenClient: TokenClient | null = null;
    private accessToken: string | null = null;
    private params: QueryParams | null = null

    constructor(params?: QueryParams) {
        this.params = params || {
            maxResults: 150,
            to: new Date(new Date().getFullYear(), 11, 30),
            from: new Date(new Date().getFullYear(), 0, 1)
        }
    }

    async init() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GoogleService.CLIENT_ID,
            scope: GoogleService.SCOPES,
            // @ts-ignore
            callback: '', // defined at request time
        });
    }

    async authAndListEvents(store: CalendarEventStore) {
        if (!this.tokenClient) {
            alert("No token present!")
            return
        }

        this.tokenClient.callback = async (resp) => {
            if (resp.error) {
                throw resp;
            }

            // Save the token to our variable
            this.accessToken = resp.access_token;

            // Fetch events immediately
            await this.listUpcomingEvents(store);
        };

        // Trigger the Google popup
        // 'consent' forces the screen to pick an account (good for testing)
        if (this.accessToken === null) {
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.tokenClient.requestAccessToken({ prompt: '' });
        }
    }

    // 3. Handle Sign Out
    async handleSignoutClick() {
        if (this.accessToken) {
            // Revoke the token with Google to be safe
            google.accounts.oauth2.revoke(this.accessToken, () => console.log('Token revoked'));
        }

        this.accessToken = null;
    }

    async listUpcomingEvents(store: CalendarEventStore) {
        let url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')

        if (this.params) {
            // apply params to url

            if (this.params.from)
                url.searchParams.append('timeMin', this.params.from.toISOString());
            if (this.params.to)
                url.searchParams.append('timeMax', this.params.to.toISOString());
            if (this.params.maxResults)
                url.searchParams.append('maxResults', this.params.maxResults.toString());
        }

        url.searchParams.append('orderBy', 'startTime');
        url.searchParams.append('singleEvents', 'true');

        try {
            const response = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await response.json();
            console.log(data.items)

            // Add new events to the store
            store.add(data.items);
        } catch (error) {
            console.error(error)
        }
    }
}

let googleService = new GoogleService()
export default googleService