import type { TokenResponse, TokenClient } from '../types/google-gis';

class AuthService {
    token = $state<string | null>(null);
    user = $state<{ name: string; email: string } | null>(null);
    isInitialized = $state(false);
    private tokenClient: TokenClient | null = null;

    get isAuthenticated(): boolean {
        return this.token !== null;
    }

    init(): void {
        if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
            console.warn('Google Identity Services not loaded');
            return;
        }

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: (response: TokenResponse) => {
                if (response.access_token) {
                    this.token = response.access_token;
                    // @ts-expect-error - gapi client is available globally when loaded
                    if (typeof gapi !== 'undefined' && gapi.client?.setToken) {
                        // @ts-expect-error - gapi client is available globally when loaded
                        gapi.client.setToken({ access_token: response.access_token });
                    }
                    this.fetchUserInfo();
                } else if (response.error) {
                    console.error('Auth error:', response.error, response.error_description);
                }
            },
        });

        this.isInitialized = true;
    }

    login(): void {
        if (!this.tokenClient) {
            this.init();
        }
        this.tokenClient?.requestAccessToken({ prompt: 'consent' });
    }

    logout(): void {
        if (this.token) {
            window.google?.accounts?.oauth2.revoke(this.token, () => {
                this.token = null;
                this.user = null;
                console.log('Token revoked');
            });
        } else {
            this.token = null;
            this.user = null;
        }
    }

    private async fetchUserInfo(): Promise<void> {
        if (!this.token) return;

        try {
            // @ts-expect-error - gapi client may not be loaded
            if (typeof gapi === 'undefined' || !gapi.client?.oauth2) {
                this.user = { name: 'User', email: '' };
                return;
            }
            // @ts-expect-error - gapi client is available globally when loaded
            const response = await gapi.client.oauth2.userinfo.get();

            if (response.result) {
                this.user = {
                    name: response.result.name || 'User',
                    email: response.result.email || '',
                };
            } else {
                console.error('Failed to fetch user info: no result');
                this.user = { name: 'User', email: '' };
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            this.user = { name: 'User', email: '' };
        }
    }
}

export const auth = new AuthService();
