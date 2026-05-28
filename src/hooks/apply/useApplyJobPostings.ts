'use client';

import { useEffect } from 'react';
import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import {
  createJdAi,
  deleteJd,
  getJdList,
  getJdResume,
  parseJdOcr,
  parseJdUrl,
  toggleJdTarget,
  updateJdResume,
  updateJdOrder,
  updateJdTitle,
} from '@/app/api/apply';
import type {
  CreateJdAiRequest,
  JdListResponse,
  JdListParams,
  JdId,
  ParseJdUrlRequest,
  UpdateJdResumeRequest,
  UpdateJdOrderRequest,
  UpdateJdTitleRequest,
} from '@/app/api/apply/types';

import { useHasApplyApiAccess } from './useApplyAccessToken';

export const applyJobPostingQueryKeys = {
  all: ['apply-job-postings'] as const,
  lists: () => [...applyJobPostingQueryKeys.all, 'list'] as const,
  infiniteList: (params?: Omit<JdListParams, 'page'>) =>
    [...applyJobPostingQueryKeys.lists(), 'infinite', params ?? null] as const,
  details: () => [...applyJobPostingQueryKeys.all, 'detail'] as const,
  detail: (jdId: JdId | null | undefined) =>
    [...applyJobPostingQueryKeys.details(), jdId ?? null] as const,
};

export function useInfiniteApplyJobPostings(params?: Omit<JdListParams, 'page'>) {
  const hasApiAccess = useHasApplyApiAccess();

  return useInfiniteQuery({
    queryKey: applyJobPostingQueryKeys.infiniteList(params),
    queryFn: ({ pageParam }) =>
      getJdList({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: hasApiAccess,
  });
}

export function useApplyJobPostingResume(jdId: JdId | null | undefined, enabled = true) {
  const hasApiAccess = useHasApplyApiAccess();
  const shouldQuery = enabled && jdId != null && hasApiAccess;

  const query = useQuery({
    queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
    queryFn:
      enabled && jdId != null
        ? async () => {
            const data = await getJdResume(jdId);
            console.log('[ApplyJobPostingResume] API', {
              jdId,
              endpoint: 'GET /api/v1/jd/{jdId}/resume',
              response: data,
            });
            return data;
          }
        : skipToken,
    enabled: shouldQuery,
  });

  useEffect(() => {
    console.log('[ApplyJobPostingResume] state', {
      jdId,
      enabled,
      hasApiAccess,
      shouldQuery,
      queryStatus: query.status,
      fetchStatus: query.fetchStatus,
      isPending: query.isPending,
      isFetching: query.isFetching,
      isError: query.isError,
      error: query.error,
      hasData: query.data != null,
    });
  }, [
    jdId,
    enabled,
    hasApiAccess,
    shouldQuery,
    query.status,
    query.fetchStatus,
    query.isPending,
    query.isFetching,
    query.isError,
    query.error,
    query.data,
  ]);

  return query;
}

export function useUpdateApplyJobPostingTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jdId, request }: { jdId: JdId; request: UpdateJdTitleRequest }) =>
      updateJdTitle(jdId, request),
    onSuccess: (_, { jdId, request }) => {
      queryClient.setQueriesData<InfiniteData<JdListResponse>>(
        { queryKey: applyJobPostingQueryKeys.lists() },
        (data) => {
          if (!data) {
            return data;
          }

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === String(jdId) ? { ...item, title: request.title } : item,
              ),
            })),
          };
        },
      );
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.detail(jdId) });
    },
  });
}

export function useParseApplyJobPostingUrl() {
  return useMutation({
    mutationFn: (request: ParseJdUrlRequest) => parseJdUrl(request),
  });
}

export function useUpdateApplyJobPostingResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jdId, request }: { jdId: JdId; request: UpdateJdResumeRequest }) =>
      updateJdResume(jdId, request),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
      });
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
    },
  });
}

export function useParseApplyJobPostingOcr() {
  return useMutation({
    mutationFn: (file: File) => parseJdOcr(file),
  });
}

export function useUpdateApplyJobPostingOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateJdOrderRequest) => updateJdOrder(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
    },
  });
}

export function useCreateApplyJobPostingWithAi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateJdAiRequest) => createJdAi(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
    },
  });
}

export function useToggleApplyTargetJobPosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleJdTarget,
    onSuccess: (_, jdId) => {
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.detail(jdId) });
    },
  });
}

export function useDeleteApplyJobPosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJd,
    onSuccess: (_, jdId) => {
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.detail(jdId) });
    },
  });
}
