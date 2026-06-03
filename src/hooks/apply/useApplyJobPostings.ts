'use client';

import {
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
  createJdResumeAiDraft,
  deleteJdResumeQuestion,
  updateJdResumeQuestion,
  saveJdResume,
  toggleJdTarget,
  updateJdResume,
  updateJdOrder,
  updateJdTitle,
} from '@/app/api/apply';
import { saveApplyCoverLetter, createCoverLetterQuestionOnServer } from '@/app/(pages)/apply/_utils/saveApplyCoverLetter';
import type { ApplyCoverLetterQuestion } from '@/app/(pages)/apply/_constants/applyMockData';
import type {
  CreateJdAiRequest,
  JdListResponse,
  JdListParams,
  JdId,
  ParseJdUrlRequest,
  CreateResumeAiDraftRequest,
  SaveResumeRequest,
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
  writingGuide: (
    jdId: JdId | null | undefined,
    questionId: number | null | undefined,
    experienceIds: number[],
  ) =>
    [
      ...applyJobPostingQueryKeys.detail(jdId),
      'writing-guide',
      questionId,
      experienceIds,
    ] as const,
  aiDraft: (
    jdId: JdId | null | undefined,
    questionId: number | null | undefined,
    experienceIds: number[],
  ) =>
    [...applyJobPostingQueryKeys.detail(jdId), 'ai-draft', questionId, experienceIds] as const,
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

  return useQuery({
    queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
    queryFn: () => getJdResume(jdId!),
    enabled: shouldQuery,
  });
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
      void queryClient.invalidateQueries({
        queryKey: applyJobPostingQueryKeys.detail(jdId),
        refetchType: 'active',
      });
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
        refetchType: 'active',
      });
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
    },
  });
}

export function useSaveApplyResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jdId, request }: { jdId: JdId; request: SaveResumeRequest }) =>
      saveJdResume(jdId, request),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
        refetchType: 'active',
      });
    },
  });
}

export function useSaveApplyCoverLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jdId,
      questions,
      selectedExperienceIdsByQuestion,
    }: {
      jdId: JdId;
      questions: ApplyCoverLetterQuestion[];
      selectedExperienceIdsByQuestion: Record<string, string[]>;
    }) => saveApplyCoverLetter(jdId, questions, selectedExperienceIdsByQuestion),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
        refetchType: 'active',
      });
    },
  });
}

export function useCreateApplyResumeQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jdId,
      question,
      questions,
      selectedExperienceIdsByQuestion,
    }: {
      jdId: JdId;
      question: ApplyCoverLetterQuestion;
      questions: ApplyCoverLetterQuestion[];
      selectedExperienceIdsByQuestion: Record<string, string[]>;
    }) =>
      createCoverLetterQuestionOnServer(jdId, question, questions, selectedExperienceIdsByQuestion),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
        refetchType: 'active',
      });
    },
  });
}

export function useUpdateApplyResumeQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jdId,
      questionId,
      content,
    }: {
      jdId: JdId;
      questionId: number;
      content: string;
    }) => updateJdResumeQuestion(jdId, questionId, { content }),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
        refetchType: 'active',
      });
    },
  });
}

export function useDeleteApplyResumeQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jdId, questionId }: { jdId: JdId; questionId: number }) =>
      deleteJdResumeQuestion(jdId, questionId),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
        refetchType: 'active',
      });
    },
  });
}

export function useCreateApplyResumeAiDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jdId,
      questionId,
      request,
    }: {
      jdId: JdId;
      questionId: number;
      request: CreateResumeAiDraftRequest;
    }) => createJdResumeAiDraft(jdId, questionId, request),
    onSuccess: (_, { jdId }) => {
      void queryClient.invalidateQueries({
        queryKey: [...applyJobPostingQueryKeys.detail(jdId), 'resume'],
        refetchType: 'active',
      });
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
      void queryClient.invalidateQueries({
        queryKey: applyJobPostingQueryKeys.detail(jdId),
        refetchType: 'active',
      });
    },
  });
}

export function useDeleteApplyJobPosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJd,
    onSuccess: (_, jdId) => {
      void queryClient.invalidateQueries({ queryKey: applyJobPostingQueryKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: applyJobPostingQueryKeys.detail(jdId),
        refetchType: 'active',
      });
    },
  });
}
