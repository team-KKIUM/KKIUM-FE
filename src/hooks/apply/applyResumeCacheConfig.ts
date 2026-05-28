export const APPLY_RESUME_CACHE_GC_TIME_MS = 1000 * 60 * 30;

export const APPLY_RESUME_CACHE_QUERY_OPTIONS = {
  staleTime: Infinity,
  gcTime: APPLY_RESUME_CACHE_GC_TIME_MS,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

export function sortExperienceIdsForCache(experienceIds: number[]) {
  return [...experienceIds].sort((left, right) => left - right);
}
