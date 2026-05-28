'use client';

import { useQuery } from '@tanstack/react-query';

import { getJdResumeWritingGuide } from '@/app/api/apply';
import type { JdId } from '@/app/api/apply/types';
import { parseExperienceIds } from '@/app/(pages)/apply/_utils/buildSaveResumeRequest';

import {
  APPLY_RESUME_CACHE_QUERY_OPTIONS,
  sortExperienceIdsForCache,
} from './applyResumeCacheConfig';
import { applyJobPostingQueryKeys } from './useApplyJobPostings';
import { useHasApplyApiAccess } from './useApplyAccessToken';

export function useApplyResumeWritingGuide(
  jdId: JdId | null | undefined,
  questionId: number | null | undefined,
  experienceIds: string[],
) {
  const hasApiAccess = useHasApplyApiAccess();
  const parsedExperienceIds = sortExperienceIdsForCache(parseExperienceIds(experienceIds));
  const shouldQuery =
    hasApiAccess && jdId != null && questionId != null && parsedExperienceIds.length > 0;

  return useQuery({
    queryKey: applyJobPostingQueryKeys.writingGuide(jdId, questionId, parsedExperienceIds),
    queryFn: () =>
      getJdResumeWritingGuide(jdId!, questionId!, {
        experienceIds: parsedExperienceIds,
      }),
    enabled: shouldQuery,
    ...APPLY_RESUME_CACHE_QUERY_OPTIONS,
  });
}
