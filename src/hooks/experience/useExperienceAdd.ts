'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  analyzeExperienceMaterials,
  analyzeExperienceNotion,
  analyzeExperiencePdf,
  createExperience,
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

export function useAnalyzeExperienceMaterials() {
  return useMutation({
    mutationFn: analyzeExperienceMaterials,
  });
}

export function useCreateExperience() {
  return useMutation({
    mutationFn: createExperience,
  });
}

export function useNotionAuthUrl() {
  return useQuery({
    queryKey: experienceAddQueryKeys.notionAuthUrl(),
    queryFn: getNotionAuthUrl,
    enabled: false,
  });
}

export function useNotionPages({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: experienceAddQueryKeys.notionPages(),
    queryFn: getNotionPages,
    enabled,
  });
}

export function useAnalyzeExperienceNotion() {
  return useMutation({
    mutationFn: analyzeExperienceNotion,
  });
}
