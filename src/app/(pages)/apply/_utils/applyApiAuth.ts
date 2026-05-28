import { getAccessTokenFromSession } from '@/app/_utils/authFetch';

const TEMP_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN?.trim() || null;

export function resolveApplyAccessToken(): string | null {
  const sessionToken = getAccessTokenFromSession();

  if (sessionToken) {
    return sessionToken;
  }

  return TEMP_ACCESS_TOKEN;
}

export function hasApplyApiAccess(): boolean {
  return resolveApplyAccessToken() != null;
}

export function isUsingSessionAccessToken(): boolean {
  return getAccessTokenFromSession() != null;
}
