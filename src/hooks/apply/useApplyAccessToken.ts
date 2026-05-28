'use client';

import { useEffect, useState } from 'react';

import {
  hasApplyApiAccess,
  resolveApplyAccessToken,
} from '@/app/(pages)/apply/_utils/applyApiAuth';

function readApplyAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return resolveApplyAccessToken();
}

export function useApplyAccessToken() {
  const [accessToken, setAccessToken] = useState<string | null>(readApplyAccessToken);

  useEffect(() => {
    const syncToken = () => {
      setAccessToken(readApplyAccessToken());
    };

    syncToken();

    window.addEventListener('storage', syncToken);
    window.addEventListener('focus', syncToken);

    return () => {
      window.removeEventListener('storage', syncToken);
      window.removeEventListener('focus', syncToken);
    };
  }, []);

  return accessToken;
}

export function useHasApplyApiAccess() {
  const accessToken = useApplyAccessToken();
  return accessToken != null;
}

export { hasApplyApiAccess, resolveApplyAccessToken };
