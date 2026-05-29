export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export type AnalyticsEventName =
  | 'sign_up'
  | 'experience_create'
  | 'application_create'
  | 'job_analysis_complete'
  | 'coverletter_create';

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function canUseGtag() {
  return Boolean(
    GA_MEASUREMENT_ID && typeof window !== 'undefined' && typeof window.gtag === 'function',
  );
}

export function trackPageView(pathname: string) {
  if (!canUseGtag()) return;

  window.gtag?.('event', 'page_view', {
    page_path: pathname,
    page_location: `${window.location.origin}${pathname}`,
    page_title: document.title,
  });
}

function removeEmptyParams(params: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined),
  );
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (!canUseGtag()) return;

  window.gtag?.('event', eventName, removeEmptyParams(params));
}
