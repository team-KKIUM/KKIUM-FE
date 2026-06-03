import { getAccessTokenFromSession, hasApiAccessToken } from '@/app/_utils/authFetch';

export function resolveApplyAccessToken(): string | null {
  return getAccessTokenFromSession();
}

export function hasApplyApiAccess(): boolean {
  return hasApiAccessToken();
}

export function isUsingSessionAccessToken(): boolean {
  return getAccessTokenFromSession() != null;
}
