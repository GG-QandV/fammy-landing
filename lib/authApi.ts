import { jwtVerify } from 'jose';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://api.fammy.pet';

export interface User {
    id: string;
    email: string;
    role: string;
    tier: string;
    name?: string;
}

export interface InvitationPreviewDTO {
    householdName: string;
    inviterEmail: string;
    role: string;
    expiresAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

const TOKEN_KEY = 'petsafe_token';
const REFRESH_TOKEN_KEY = 'petsafe_refresh_token';

export const authApi = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

    setTokens: (token: string, refreshToken: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await res.json();
        this.setTokens(data.data.token, data.data.refreshToken);
        return data.data;
    },

    async register(email: string, password: string, name?: string): Promise<AuthResponse> {
        const sessionId = localStorage.getItem('x-session-id'); // Guest migration
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (sessionId) headers['x-session-id'] = sessionId;

        const res = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await res.json();
        this.setTokens(data.data.token, data.data.refreshToken);
        return data.data;
    },

    async refreshToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
                method: 'POST', // Assuming backend uses POST for refresh
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }), // Assuming body usage, adjust if backend expects header
            });

            if (!res.ok) throw new Error('Refresh failed');

            const data = await res.json();
            this.setTokens(data.data.token, data.data.refreshToken);
            return data.data.token;
        } catch (e) {
            this.clearTokens();
            return null;
        }
    },

    async getProfile(): Promise<User | null> {
        const token = this.getToken();
        if (!token) return null;

        try {
            // Decode JWT locally to get user info if backend doesn't have a specific /me endpoint that returns full user data without extra calls
            // Or call /api/v1/auth/me if it exists. 
            // Checking implementation plan, we rely on JWT payload or login response. 
            // Implemented specific /auth/me or similar in backend? 
            // Let's rely on decoding the local token first or simple check.
            // Actually backend HAS /api/v1/users/me usually. 

            // Better: fetch profile from backend to be sure
            const res = await this.fetchWithAuth(`${API_URL}/api/v1/auth/me`);
            const data = await res.json();
            return data.data;
        } catch (e) {
            return null;
        }
    },

    async getInvitation(token: string): Promise<InvitationPreviewDTO> {
        const res = await fetch(`${API_URL}/api/v1/invitations/${token}`);

        if (!res.ok) {
            throw new Error('Invalid or expired invitation');
        }

        const data = await res.json();
        return data.data.invitation;
    },

    async acceptInvitation(token: string): Promise<any> {
        const res = await this.fetchWithAuth(`${API_URL}/api/v1/invitations/${token}/accept`, {
            method: 'POST'
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to accept invitation');
        }

        const data = await res.json();
        return data.data;
    },

    // Fetch wrapper with auto-refresh
    async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
        let token = this.getToken();
        if (!token) throw new Error('No token');

        const headers = { ...options.headers, 'Authorization': `Bearer ${token}` } as Record<string, string>;

        let res = await fetch(url, { ...options, headers });

        if (res.status === 401) {
            token = await this.refreshToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
                res = await fetch(url, { ...options, headers });
            } else {
                throw new Error('Session expired');
            }
        }

        return res;
    }
};
