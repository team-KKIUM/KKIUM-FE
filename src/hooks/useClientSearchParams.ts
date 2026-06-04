'use client';

import { useMemo, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

function readLocationSearch() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.search;
}

function subscribeToLocationSearch(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return emptySubscribe;
  }

  const notify = () => onStoreChange();

  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = (...args) => {
    const result = originalPushState(...args);
    notify();
    return result;
  };

  history.replaceState = (...args) => {
    const result = originalReplaceState(...args);
    notify();
    return result;
  };

  window.addEventListener('popstate', notify);

  return () => {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    window.removeEventListener('popstate', notify);
  };
}

/**
 * `useSearchParams` 대체. `output: 'export'`에서 CSR bailout·#418을 피합니다.
 * 서버/정적 HTML 스냅샷은 빈 쿼리, 클라이언트는 `window.location.search`와 동기화합니다.
 */
export function useClientSearchParams() {
  const search = useSyncExternalStore(
    subscribeToLocationSearch,
    readLocationSearch,
    () => '',
  );

  return useMemo(() => new URLSearchParams(search), [search]);
}
