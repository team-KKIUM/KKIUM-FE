'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  analyzeExperienceNotion,
  analyzeExperiencePdf,
  getNotionAuthUrl,
  getNotionPages,
} from '@/app/api/experience/add';

export const experienceAddQueryKeys = {
  notion: ['experience-add', 'notion'] as const,
  notionAuthUrl: () => [...experienceAddQueryKeys.notion, 'auth-url'] as const,
  notionPages: () => [...experienceAddQueryKeys.notion, 'pages'] as const,
};

export function useAnalyzeExperiencePdf() {
  return useMutation({
    mutationFn: analyzeExperiencePdf,
  });
}

export function useNotionAuthUrl() {
  return useQuery({
    queryKey: experienceAddQueryKeys.notionAuthUrl(),
    queryFn: getNotionAuthUrl,
    enabled: false,
  });
}

export function useNotionPages() {
  return useQuery({
    queryKey: experienceAddQueryKeys.notionPages(),
    queryFn: getNotionPages,
  });
}

export function useAnalyzeExperienceNotion() {
  return useMutation({
    mutationFn: analyzeExperienceNotion,
  });
}
