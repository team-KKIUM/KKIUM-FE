const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCESS_TOKEN_STORAGE_KEY = 'mg_access_token';
const OAUTH_STATE_STORAGE_PREFIX = 'oauth_state_';

interface AuthFetchInit extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit;
}

interface SocialLoginData {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  termsAgreed?: boolean;
  terms_agreed?: boolean;
}

export interface SocialLoginResult {
  accessToken: string;
  /** true only when the API explicitly reports the user has agreed to terms. */
  termsAgreed: boolean;
}

function isExplicitTermsAgreed(data: SocialLoginData | undefined): boolean {
  if (!data) return false;
  const raw: unknown = data.termsAgreed ?? data.terms_agreed;
  if (raw === true) return true;
  if (raw === false) return false;
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'y' || normalized === 'yes') {
      return true;
    }
  }
  if (typeof raw === 'number' && raw === 1) return true;
  return false;
}

interface SocialLoginResponse {
  status: number;
  code: string;
  message: string;
  data?: SocialLoginData;
}

function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }

  const baseWithSlash = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return new URL(normalizedPath, baseWithSlash);
}

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function saveAuthTokensToSession(accessToken: string) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function getAccessTokenFromSession(): string | null {
  const storage = getStorage();
  if (!storage) return null;

  const token = storage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim();
  return token || null;
}

export function clearAccessTokenFromSession() {
  getStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

// 인증 만료 시 로그인 화면으로 이동 
export function redirectToLoginOnUnauthorized() {
  if (typeof window === 'undefined') return;

  clearAccessTokenFromSession();

  if (isAuthExemptPath(window.location.pathname)) {
    return;
  }

  window.location.replace('/login');
}

// 로그인·OAuth 화면 (사이드바 없음)
export function isPublicAuthPath(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  return (
    path === '/login' || path.startsWith('/oauth') || path.startsWith('/auth/callback')
  );
}

// 토큰 없이 UI 확인용 
export function isAuthExemptPath(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  return isPublicAuthPath(pathname) || path === '/apply' || path.startsWith('/apply/');
}

export function resolveOAuthRedirectUri(provider: 'google' | 'kakao'): string {
  const fromEnv =
    provider === 'google'
      ? process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI?.trim()
      : process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim();
  if (fromEnv) return fromEnv;
  if (typeof window === 'undefined') {
    throw new Error(
      `NEXT_PUBLIC_${provider === 'google' ? 'GOOGLE' : 'KAKAO'}_REDIRECT_URI is not set.`,
    );
  }
  return `${window.location.origin}/oauth/${provider}/callback`;
}

const inflightSocialLogins = new Map<string, Promise<SocialLoginResult>>();

export function requestSocialLoginOnce(provider: 'google' | 'kakao', code: string) {
  const normalizedCode = code.trim();
  const key = `${provider}:${normalizedCode}`;
  const existing = inflightSocialLogins.get(key);
  if (existing) return existing;

  const started = requestSocialLogin(provider, code).finally(() => {
    inflightSocialLogins.delete(key);
  });
  inflightSocialLogins.set(key, started);
  return started;
}

export async function requestSocialLogin(provider: 'google' | 'kakao', code: string) {
  const loginType = provider.toUpperCase();
  const loginUrl = buildApiUrl(`/auth/login/${loginType}`);
  const normalizedCode = code.trim();

  if (!normalizedCode) {
    throw new Error('OAuth authorization code is missing.');
  }

  loginUrl.searchParams.set('code', normalizedCode);

  const response = await fetch(loginUrl.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const contentType = response.headers.get('Content-Type') ?? '';
  let payload: SocialLoginResponse | null = null;

  if (contentType.includes('application/json')) {
    payload = (await response.json()) as SocialLoginResponse;
  }

  if (response.status === 401) {
    redirectToLoginOnUnauthorized();
    const message = payload?.message ?? 'Social login failed (401)';
    throw new Error(message);
  }

  if (!response.ok) {
    const message = payload?.message ?? `Social login failed (${response.status})`;
    throw new Error(message);
  }

  if (!payload) {
    throw new Error('Invalid social login response format.');
  }

  const accessToken = payload?.data?.accessToken ?? payload?.data?.access_token;

  if (!accessToken) {
    throw new Error('Access token is missing in social login response.');
  }

  saveAuthTokensToSession(accessToken);

  return {
    accessToken,
    termsAgreed: isExplicitTermsAgreed(payload.data),
  };
}

export async function requestTermsAgreement(termsAgreed: boolean) {
  const response = await authFetch('auth/terms', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: JSON.stringify({
      termsAgreed,
    }),
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type') ?? '';
    let message = `Terms agreement failed (${response.status})`;
    if (contentType.includes('application/json')) {
      try {
        const payload = (await response.json()) as { message?: string };
        if (payload.message) message = payload.message;
      } catch {
        /* ignore malformed JSON */
      }
    }
    throw new Error(message);
  }
}

function getOAuthStateStorageKey(provider: 'google' | 'kakao') {
  return `${OAUTH_STATE_STORAGE_PREFIX}${provider}`;
}

function generateOAuthState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function createOAuthState(provider: 'google' | 'kakao') {
  const storage = getStorage();
  if (!storage) return null;

  const state = generateOAuthState();
  storage.setItem(getOAuthStateStorageKey(provider), state);
  return state;
}

export function consumeOAuthState(provider: 'google' | 'kakao') {
  const storage = getStorage();
  if (!storage) return null;

  const key = getOAuthStateStorageKey(provider);
  const state = storage.getItem(key);
  storage.removeItem(key);
  return state;
}

export async function authFetch(path: string, init: AuthFetchInit = {}) {
  const accessToken = getAccessTokenFromSession();

  if (!accessToken) {
    throw new Error('Access token session is missing.');
  }

  const url = buildApiUrl(path);
  const headers = new Headers(init.headers);

  headers.set('Authorization', `Bearer ${accessToken}`);

  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    cache: init.cache ?? 'no-store',
  });

  if (response.status === 401) {
    redirectToLoginOnUnauthorized();
  }

  return response;
}
