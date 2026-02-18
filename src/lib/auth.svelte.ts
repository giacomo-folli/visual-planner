import { googleAuth } from './google-auth';

const AUTH_STORAGE_KEY = 'visual-planner:auth';

type StoredAuth = {
	token: string;
	user: { name: string; email: string } | null;
};

class AuthService {
	token = $state<string | null>(null);
	user = $state<{ name: string; email: string } | null>(null);
	isInitialized = $state(false);

	get isAuthenticated(): boolean {
		return this.token !== null;
	}

	init(): void {
		if (typeof window === 'undefined') {
			return;
		}

		this.restoreSession();

		if (this.token && typeof gapi !== 'undefined' && gapi.client?.setToken) {
			gapi.client.setToken({ access_token: this.token });
		}

		if (!window.google?.accounts?.oauth2) {
			console.warn('Google Identity Services not loaded');
			return;
		}

		this.isInitialized = true;
	}

	async login(): Promise<void> {
		if (!this.isInitialized) {
			this.init();
		}

		try {
			const response = await googleAuth.requestAccessToken({
				interactive: true
			});
			this.token = response.access_token;
			await this.fetchUserInfo();
			this.persistSession();
		} catch (error) {
			console.error('Auth error:', error);
		}
	}

	logout(): void {
		const clearSession = () => {
			this.token = null;
			this.user = null;
			this.clearPersistedSession();
		};

		if (this.token) {
			googleAuth.revoke(this.token, () => {
				clearSession();
			});
			return;
		}

		clearSession();
	}

	private restoreSession(): void {
		try {
			const serialized = window.localStorage.getItem(AUTH_STORAGE_KEY);
			if (!serialized) return;

			const session = JSON.parse(serialized) as StoredAuth;
			if (!session.token) return;

			this.token = session.token;
			this.user = session.user;
		} catch (error) {
			console.warn('Unable to restore auth session:', error);
			this.clearPersistedSession();
		}
	}

	private persistSession(): void {
		if (typeof window === 'undefined' || !this.token) return;

		const payload: StoredAuth = {
			token: this.token,
			user: this.user
		};

		window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
	}

	private clearPersistedSession(): void {
		if (typeof window === 'undefined') return;
		window.localStorage.removeItem(AUTH_STORAGE_KEY);
	}

	private async fetchUserInfo(): Promise<void> {
		if (!this.token) return;

		try {
			const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${this.token}`
				}
			});

			if (!response.ok) {
				throw new Error(`Unable to fetch user profile (${response.status})`);
			}

			const profile = (await response.json()) as { name?: string; email?: string };
			this.user = {
				name: profile.name || 'User',
				email: profile.email || ''
			};
			this.persistSession();
		} catch (error) {
			console.error('Failed to fetch user info:', error);
			this.user = { name: 'User', email: '' };
			this.persistSession();
		}
	}
}

export const auth = new AuthService();
