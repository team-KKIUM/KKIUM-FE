'use client';

import { useEffect } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';

import { getJdAnalysisWithMatch } from '@/app/api/apply';
import {
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
        ? async (): Promise<ApplyJobAnalysisQueryData> => {
            const data = await getJdAnalysisWithMatch(jdId);

            console.log('[ApplyJobAnalysis] API', {
              jdId,
              endpoint: 'GET /api/v1/jd/{jdId}/analysis',
              analysisStatus: resolveJdAnalysisStatus(data),
              response: data,
            });

            return data;
          }
        : skipToken,
    enabled: jdId != null && hasApiAccess,
    refetchInterval: (query) => {
      const status = resolveJdAnalysisStatus(query.state.data);
      return isJdAnalysisTerminal(status) ? false : JD_ANALYSIS_POLL_INTERVAL_MS;
    },
  });

  const analysisStatus = resolveJdAnalysisStatus(analysisQuery.data);

  const isAnalysisLoading =
    jdId != null &&
    (!hasApiAccess ||
      analysisQuery.isPending ||
      analysisQuery.isFetching ||
      !analysisQuery.data ||
      !isJdAnalysisTerminal(analysisStatus));

  useEffect(() => {
    console.log('[ApplyJobAnalysis] state', {
      jdId,
      hasApiAccess,
      analysis: {
        analysisStatus: analysisStatus ?? null,
        isTerminal: isJdAnalysisTerminal(analysisStatus),
        isAnalysisLoading,
        queryStatus: analysisQuery.status,
        fetchStatus: analysisQuery.fetchStatus,
        isPending: analysisQuery.isPending,
        isFetching: analysisQuery.isFetching,
        isError: analysisQuery.isError,
        error: analysisQuery.error,
      },
    });
  }, [
    jdId,
    hasApiAccess,
    analysisStatus,
    isAnalysisLoading,
    analysisQuery.status,
    analysisQuery.fetchStatus,
    analysisQuery.isPending,
    analysisQuery.isFetching,
    analysisQuery.isError,
    analysisQuery.error,
  ]);

  return {
    ...analysisQuery,
    analysisStatus,
    isAnalysisLoading,
  };
}
