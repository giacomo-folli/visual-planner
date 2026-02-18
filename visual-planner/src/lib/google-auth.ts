import type { TokenClient, TokenResponse } from '../types/google-gis';

export const GOOGLE_SCOPES = {
	CALENDAR_READONLY: 'https://www.googleapis.com/auth/calendar.readonly',
	DRIVE_APPDATA: 'https://www.googleapis.com/auth/drive.appdata'
} as const;

const DEFAULT_SCOPES = [GOOGLE_SCOPES.CALENDAR_READONLY, GOOGLE_SCOPES.DRIVE_APPDATA];

type RequestOptions = {
	scopes?: string[];
	interactive?: boolean;
};

export class GoogleAuthService {
	private tokenClient: TokenClient | null = null;
	private clientId: string;

	constructor(clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '') {
		this.clientId = clientId;
	}

	requestAccessToken(options: RequestOptions = {}): Promise<TokenResponse> {
		if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
			return Promise.reject(new Error('Google Identity Services are not loaded.'));
		}

		if (!this.clientId) {
			return Promise.reject(new Error('VITE_GOOGLE_CLIENT_ID is not configured.'));
		}

		const scope = (options.scopes ?? DEFAULT_SCOPES).join(' ');

		return new Promise((resolve, reject) => {
			this.tokenClient = window.google.accounts.oauth2.initTokenClient({
				client_id: this.clientId,
				scope,
				callback: (response) => {
					if (response.error) {
						reject(new Error(response.error_description || response.error));
						return;
					}

					if (response.access_token && typeof gapi !== 'undefined' && gapi.client?.setToken) {
						gapi.client.setToken({ access_token: response.access_token });
					}

					resolve(response);
				},
				error_callback: (error) => {
					reject(new Error(error.type));
				}
			});

			this.tokenClient.requestAccessToken({
				prompt: options.interactive ? 'consent' : ''
			});
		});
	}

	revoke(token: string, callback: () => void): void {
		window.google?.accounts?.oauth2.revoke(token, callback);
	}

	static hasScope(response: TokenResponse, scope: string): boolean {
		const grantedScopes = new Set((response.scope || '').split(/\s+/).filter(Boolean));
		return grantedScopes.has(scope);
	}
}

export const googleAuth = new GoogleAuthService();
