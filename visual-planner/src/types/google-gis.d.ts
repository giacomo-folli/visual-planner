export interface TokenClientConfig {
    client_id: string;
    callback: (response: TokenResponse) => void;
    scope?: string;
    discovery_docs?: string[];
    hosted_domain?: string;
    ux_mode?: 'popup' | 'redirect';
    redirect_uri?: string;
    state_cookie_domain?: string;
}

export interface TokenResponse {
    access_token: string;
    id_token?: string;
    scope: string;
    expires_in: number;
    token_type: string;
    issued_at: number;
    error?: string;
    error_description?: string;
}

export interface RevokeResponse {
    success: boolean;
    error?: string;
}

export interface GoogleOAuth2 {
    initTokenClient: (config: TokenClientConfig) => TokenClient;
    revoke: (token: string, callback: (response: RevokeResponse) => void) => void;
}

export interface TokenClient {
    requestAccessToken: (options?: { prompt?: string }) => void;
}

declare global {
    interface Window {
        google: {
            accounts: {
                oauth2: GoogleOAuth2;
            };
        };
    }
}
