/**
 * Browser-only bridge: axios cannot import Redux. When `/api/auth/refresh` fails, the API
 * clears httpOnly cookies; this dispatches an event so the app resets client state (store,
 * sockets) and redirects to login. Does not touch token storage — auth is cookie-based.
 */
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

export function dispatchAuthSessionExpired(): void {
    if (typeof window === 'undefined') return;
    // window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}
