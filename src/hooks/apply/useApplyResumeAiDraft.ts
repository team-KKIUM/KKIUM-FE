'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { parseExperienceIds } from '@/app/(pages)/apply/_utils/buildSaveResumeRequest';
import { createJdResumeAiDraft } from '@/app/api/apply';
import type { JdId } from '@/app/api/apply/types';

import {
  APPLY_RESUME_CACHE_QUERY_OPTIONS,
  sortExperienceIdsForCache,
} from './applyResumeCacheConfig';
import { useHasApplyApiAccess } from './useApplyAccessToken';
import { applyJobPostingQueryKeys } from './useApplyJobPostings';

export function useApplyResumeAiDraft(
  jdId: JdId | null | undefined,
  questionId: number | null | undefined,
  experienceIds: string[],
) {
  const queryClient = useQueryClient();
  const hasApiAccess = useHasApplyApiAccess();
  const parsedExperienceIds = sortExperienceIdsForCache(parseExperienceIds(experienceIds));
  const canFetch =
    hasApiAccess && jdId != null && questionId != null && parsedExperienceIds.length > 0;
  const queryKey = applyJobPostingQueryKeys.aiDraft(jdId, questionId, parsedExperienceIds);

  const query = useQuery({
    queryKey,
    queryFn: () =>
      createJdResumeAiDraft(jdId!, questionId!, {
        experienceIds: parsedExperienceIds,
      }),
    enabled: false,
    ...APPLY_RESUME_CACHE_QUERY_OPTIONS,
  });

  const generateDraft = useCallback(async () => {
    if (!canFetch) {
      return null;
    }

    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: () =>
        createJdResumeAiDraft(jdId!, questionId!, {
          experienceIds: parsedExperienceIds,
        }),
      ...APPLY_RESUME_CACHE_QUERY_OPTIONS,
    });

    void queryClient.invalidateQueries({
      queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
      refetchType: 'active',
    });

    return data.draft;
  }, [canFetch, jdId, parsedExperienceIds, questionId, queryClient, queryKey]);

  return {
    cachedDraft: query.data?.draft ?? '',
    hasCachedDraft: Boolean(query.data?.draft?.trim()),
    generateDraft,
    isGenerating: query.isFetching,
    isError: query.isError,
  };
}
