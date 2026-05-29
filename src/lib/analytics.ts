export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export type AnalyticsEventName =
  | 'sign_up'
  | 'experience_create'
  | 'application_create'
  | 'job_analysis_complete'
  | 'coverletter_create';

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;
const IS_GA_DEBUG_MODE = process.env.NODE_ENV === 'development';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function canUseAnalytics() {
  return Boolean(GA_MEASUREMENT_ID && typeof window !== 'undefined');
}

function canUseGtag() {
  return canUseAnalytics() && typeof window.gtag === 'function';
}

export function trackPageView(pathname: string) {
  if (!canUseGtag()) return;

  setTimeout(() => {
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  }, 0);
}

function removeEmptyParams(params: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined),
  );
}

function getEventParams(params: AnalyticsEventParams) {
  return removeEmptyParams({
    ...params,
    ...(IS_GA_DEBUG_MODE ? { debug_mode: true } : {}),
  });
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (!canUseAnalytics()) return;

  const eventParams = getEventParams(params);

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(['event', eventName, eventParams]);
}
