import { googleAuth } from './google-auth';

class AuthService {
	token = $state<string | null>(null);
	user = $state<{ name: string; email: string } | null>(null);
	isInitialized = $state(false);

	get isAuthenticated(): boolean {
		return this.token !== null;
	}

	init(): void {
		if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
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
		} catch (error) {
			console.error('Auth error:', error);
		}
	}

	logout(): void {
		if (this.token) {
			googleAuth.revoke(this.token, () => {
				this.token = null;
				this.user = null;
			});
			return;
		}

		this.token = null;
		this.user = null;
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
		} catch (error) {
			console.error('Failed to fetch user info:', error);
			this.user = { name: 'User', email: '' };
		}
	}
}

export const auth = new AuthService();
