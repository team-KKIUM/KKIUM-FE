'use client';

import { useCallback, useMemo, useState } from 'react';

export const MAX_JOB_POSTING_URL_LENGTH = 2048;

export type JobPostingUrlValidation =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function validateJobPostingUrl(raw: string): JobPostingUrlValidation {
  const value = raw.trim();
  if (!value) {
    return { ok: false, error: '링크를 입력해주세요' };
  }
  if (value.length > MAX_JOB_POSTING_URL_LENGTH) {
    return {
      ok: false,
      error: `주소는 최대 ${MAX_JOB_POSTING_URL_LENGTH}자까지 입력할 수 있어요.`,
    };
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: '링크 형식이 올바르지 않습니다.' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: '링크 형식이 올바르지 않습니다.' };
  }
  return { ok: true, value };
}

export function useJobPostingUrlField() {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const validation = useMemo(() => validateJobPostingUrl(url), [url]);
  const showError = touched && !validation.ok;

  const markTouched = useCallback(() => {
    setTouched(true);
  }, []);

  const reset = useCallback(() => {
    setUrl('');
    setTouched(false);
  }, []);

  return {
    url,
    setUrl,
    validation,
    showError,
    markTouched,
    reset,
    maxLength: MAX_JOB_POSTING_URL_LENGTH,
  };
}
