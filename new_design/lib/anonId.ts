import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'anon_id';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Get or create anonymous ID from cookie
 * Used for tracking F2 usage before authentication
 */
export function getOrCreateAnonId(): string {
    if (typeof window === 'undefined') {
        // Server-side: cannot access cookies directly
        return '';
    }

    // Try to read existing cookie
    const cookies = document.cookie.split('; ');
    const anonCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));

    if (anonCookie) {
        const anonId = anonCookie.split('=')[1];
        if (anonId && anonId.length > 0) {
            return anonId;
        }
    }

    // Generate new UUID
    const newAnonId = uuidv4();
    setAnonIdCookie(newAnonId);
    return newAnonId;
}

/**
 * Set anonymous ID cookie
 */
export function setAnonIdCookie(anonId: string): void {
    if (typeof window === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

    document.cookie = `${COOKIE_NAME}=${anonId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get anonymous ID from cookie (server-side)
 */
export function getAnonIdFromCookieHeader(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split('; ');
    const anonCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));

    if (anonCookie) {
        return anonCookie.split('=')[1] || null;
    }

    return null;
}
