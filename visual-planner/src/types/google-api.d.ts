declare global {
	const gapi: {
		load: (api: string, callback: () => void) => void;
		client: {
			setToken: (token: { access_token: string }) => void;
			getToken: () => { access_token?: string } | null;
			request: (options: {
				path: string;
				method: string;
				params?: Record<string, string | boolean>;
				body?: unknown;
			}) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
			oauth2?: {
				userinfo: {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					get: () => Promise<any>;
				};
			};
		};
	};
}

export {};
