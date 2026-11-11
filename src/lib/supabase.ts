/**
 * Supabase browser client for mindspark-all.
 *
 * The site is a static SPA with no server of its own, so it talks to Supabase
 * directly with the *publishable* key. That key only opens the door: every
 * function it calls is a SECURITY DEFINER RPC that re-checks the caller's
 * verified Google identity inside the database. Nothing here can be trusted by
 * the client, and nothing sensitive is readable by an anonymous caller.
 */

// Set on the Vercel project as VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY;
// the literals are the same values, kept as a fallback for local builds.
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://duoynnsuogaekjtdzcrd.supabase.co';
export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_tt29PlGr1WMeZOY8Pa3IfQ_wmhd6432';

const SESSION_KEY = 'mindspark_google_session';
const VERIFIER_KEY = 'mindspark_google_pkce_verifier';
const REFRESH_SKEW_MS = 60_000;

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface GoogleSession {
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds. */
  expiresAt: number;
  user: GoogleUser;
}

/** Error thrown when the visitor is not signed in with Google. */
export class SignInRequiredError extends Error {
  constructor(message = 'Sign in with Google to continue') {
    super(message);
    this.name = 'SignInRequiredError';
  }
}

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomString(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return base64Url(buffer);
}

async function sha256Challenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

function readStoredSession(): GoogleSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GoogleSession;
    if (!parsed?.accessToken || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeSession(session: GoogleSession | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private browsing — the session simply will not persist */
  }
}

function userFromPayload(payload: {
  user?: {
    id?: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
}): GoogleUser {
  const meta = payload.user?.user_metadata ?? {};
  const email = (payload.user?.email ?? String(meta.email ?? '')).toLowerCase();
  const name =
    String(meta.full_name ?? meta.name ?? '') || (email ? email.split('@')[0] : 'Google user');
  return {
    id: payload.user?.id ?? '',
    email,
    name,
    avatar: String(meta.avatar_url ?? meta.picture ?? ''),
  };
}

function sessionFromPayload(payload: Record<string, unknown>): GoogleSession | null {
  const accessToken = typeof payload.access_token === 'string' ? payload.access_token : '';
  if (!accessToken) return null;
  const expiresIn = Number(payload.expires_in ?? 3600);
  return {
    accessToken,
    refreshToken: typeof payload.refresh_token === 'string' ? payload.refresh_token : '',
    expiresAt: Date.now() + expiresIn * 1000,
    user: userFromPayload(payload as never),
  };
}

async function postAuth(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(
      String(payload.error_description ?? payload.msg ?? payload.message ?? 'Sign-in failed'),
    );
  }
  return payload;
}

/* ------------------------------------------------------------------ *
 * Google sign-in (OAuth2 + PKCE, no SDK required)
 * ------------------------------------------------------------------ */

/** Redirect the browser to Google via Supabase Auth. */
export async function signInWithGoogle(): Promise<void> {
  const verifier = randomString(32);
  try {
    sessionStorage.setItem(VERIFIER_KEY, verifier);
  } catch {
    /* ignore */
  }
  const challenge = await sha256Challenge(verifier);
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams({
    provider: 'google',
    redirect_to: redirectTo,
    flow_type: 'pkce',
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  window.location.assign(`${SUPABASE_URL}/auth/v1/authorize?${params.toString()}`);
}

/**
 * Exchange the code Supabase Auth redirected back with. Safe to call on every
 * page load — it resolves to null when there is nothing to consume.
 *
 * Memoised: the auth code is single-use, and this runs both from main.tsx (so a
 * redirect is consumed even while the drawer is closed) and from the chat panel
 * itself. React StrictMode double-invokes effects, so sharing one promise keeps
 * the code from being spent twice.
 */
let redirectPromise: Promise<GoogleSession | null> | null = null;

export function consumeAuthRedirect(): Promise<GoogleSession | null> {
  redirectPromise ??= handleAuthRedirect();
  return redirectPromise;
}

async function handleAuthRedirect(): Promise<GoogleSession | null> {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const implicitToken = hashParams.get('access_token');

  if (!code && !implicitToken) return null;

  let session: GoogleSession | null = null;
  let failure = '';

  try {
    if (code) {
      let verifier = '';
      try {
        verifier = sessionStorage.getItem(VERIFIER_KEY) ?? '';
      } catch {
        verifier = '';
      }
      if (!verifier) throw new Error('Sign-in was interrupted, please try again');
      const payload = await postAuth('token?grant_type=pkce', {
        auth_code: code,
        code_verifier: verifier,
      });
      session = sessionFromPayload(payload);
    } else if (implicitToken) {
      session = {
        accessToken: implicitToken,
        refreshToken: hashParams.get('refresh_token') ?? '',
        expiresAt: Date.now() + Number(hashParams.get('expires_in') ?? 3600) * 1000,
        user: userFromPayload({}),
      };
    }
  } catch (error) {
    failure = error instanceof Error ? error.message : 'Sign-in failed';
  }

  try {
    sessionStorage.removeItem(VERIFIER_KEY);
  } catch {
    /* ignore */
  }

  // Strip the auth parameters so a refresh does not replay a single-use code.
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  url.hash = '';
  window.history.replaceState({}, '', url.toString());

  if (session) {
    storeSession(session);
    return session;
  }
  if (failure) throw new Error(failure);
  return null;
}

/** Refresh an expired access token in place. */
async function refreshSession(session: GoogleSession): Promise<GoogleSession | null> {
  if (!session.refreshToken) return null;
  try {
    const payload = await postAuth('token?grant_type=refresh_token', {
      refresh_token: session.refreshToken,
    });
    const next = sessionFromPayload(payload);
    if (!next) return null;
    // Keep the richer profile we already have if the refresh response is thin.
    if (!next.user.email) next.user = session.user;
    storeSession(next);
    return next;
  } catch {
    storeSession(null);
    return null;
  }
}

/** The current Google session, or null when signed out. */
export function getSession(): GoogleSession | null {
  return readStoredSession();
}

/** A non-expired access token for the signed-in visitor, refreshing if needed. */
export async function getAccessToken(): Promise<string | null> {
  const session = readStoredSession();
  if (!session) return null;
  if (session.expiresAt - REFRESH_SKEW_MS > Date.now()) return session.accessToken;
  const refreshed = await refreshSession(session);
  return refreshed?.accessToken ?? null;
}

export async function signOut(): Promise<void> {
  const session = readStoredSession();
  storeSession(null);
  if (session?.accessToken) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.accessToken}` },
      });
    } catch {
      /* best effort */
    }
  }
}

/* ------------------------------------------------------------------ *
 * RPC
 * ------------------------------------------------------------------ */

/**
 * Call a Supabase RPC as the signed-in visitor.
 *
 * @param requireSignIn throw instead of calling anonymously.
 */
export async function rpc<T>(
  fn: string,
  body: Record<string, unknown> = {},
  options: { requireSignIn?: boolean } = {},
): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    if (options.requireSignIn) throw new SignInRequiredError();
    // Anonymous callers fall back to the publishable key (public read RPCs).
  }

  const call = async (authorization: string) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, authorization },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }
    return { ok: response.ok, status: response.status, payload };
  };

  const first = await call(token ? `Bearer ${token}` : `Bearer ${SUPABASE_KEY}`);

  // One transparent retry after a refresh: the token may have expired mid-use.
  if (!first.ok && first.status === 401 && token) {
    const session = readStoredSession();
    const refreshed = session ? await refreshSession(session) : null;
    if (refreshed) {
      const second = await call(`Bearer ${refreshed.accessToken}`);
      if (second.ok) return second.payload as T;
    }
    storeSession(null);
    throw new SignInRequiredError('Your Google session expired — please sign in again');
  }

  if (!first.ok) {
    const detail = first.payload as { message?: string; error?: string } | null;
    throw new Error(detail?.message ?? detail?.error ?? `Request failed (${first.status})`);
  }

  return first.payload as T;
}
