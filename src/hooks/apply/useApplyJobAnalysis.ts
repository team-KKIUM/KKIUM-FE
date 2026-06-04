'use client';

import { skipToken, useQuery } from '@tanstack/react-query';

import { getJdAnalysisWithMatch, getJdExperienceAnalysis } from '@/app/api/apply';
import {
  hasRenderableJdAnalysisContent,
  isJdAnalysisTerminal,
  resolveJdAnalysisStatus,
} from '@/app/api/apply/jdAnalysisStatus';
import type { JdAnalysisResponse, JdId } from '@/app/api/apply/types';

import { useHasApplyApiAccess } from './useApplyAccessToken';
import { applyJobPostingQueryKeys } from './useApplyJobPostings';

const JD_ANALYSIS_POLL_INTERVAL_MS = 2000;

export type ApplyJobAnalysisQueryData = JdAnalysisResponse;

export function useApplyJobAnalysis(jdId: JdId | null | undefined) {
  const hasApiAccess = useHasApplyApiAccess();

  const analysisQuery = useQuery({
    queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'analysis'],
    queryFn:
      jdId != null
        ? () => getJdAnalysisWithMatch(jdId)
        : skipToken,
    enabled: jdId != null && hasApiAccess,
    refetchInterval: (query) => {
      const status = resolveJdAnalysisStatus(query.state.data);
      return isJdAnalysisTerminal(status) ? false : JD_ANALYSIS_POLL_INTERVAL_MS;
    },
  });

  const analysisStatus = resolveJdAnalysisStatus(analysisQuery.data);
  const hasRenderableContent = hasRenderableJdAnalysisContent(analysisQuery.data);
  const isAnalysisComplete = isJdAnalysisTerminal(analysisStatus);

  const isAnalysisLoading =
    jdId != null &&
    !isAnalysisComplete &&
    !hasRenderableContent &&
    (!hasApiAccess || analysisQuery.isPending || !analysisQuery.data);

  return {
    ...analysisQuery,
    analysisStatus,
    isAnalysisLoading,
    hasRenderableContent,
    isAnalysisComplete,
  };
}

export function useApplyExperienceAnalysis(
  jdId: JdId | null | undefined,
  experienceId: number | null | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      ...applyJobPostingQueryKeys.detail(jdId),
      'analysis',
      'experience',
      experienceId ?? null,
    ],
    queryFn:
      enabled && jdId != null && experienceId != null
        ? () => getJdExperienceAnalysis(jdId, experienceId)
        : skipToken,
    enabled: enabled && jdId != null && experienceId != null,
    // 카드 최초 펼침 시 1회 호출하고, 동일 jd/experience 조합은 캐시 재사용
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
