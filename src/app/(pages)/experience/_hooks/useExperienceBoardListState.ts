'use client';

import * as React from 'react';

import type { ExperienceCategory } from '@/app/(pages)/experience/_utils/ExperienceCategory';

interface ExperienceBoardListData {
  pages: readonly {
    experiences: readonly unknown[];
  }[];
}

interface UseExperienceBoardListStateParams {
  data?: ExperienceBoardListData | null;
  hasNextPage?: boolean;
  isError: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
  keyword?: string;
  selectedCategory: ExperienceCategory;
  filteredExperienceCount: number;
}

export function useExperienceBoardListState({
  data,
  hasNextPage,
  isError,
  isFetching,
  isFetchingNextPage,
  isPending,
  keyword,
  selectedCategory,
  filteredExperienceCount,
}: UseExperienceBoardListStateParams) {
  const keywordKey = keyword ?? '';
  const [emptyAllKeywordKey, setEmptyAllKeywordKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedCategory !== 'all' || !data || isError || isPending) {
      return;
    }

    const isAllExperienceEmpty =
      !hasNextPage && data.pages.every((page) => page.experiences.length === 0);

    setEmptyAllKeywordKey((currentKeywordKey) => {
      if (isAllExperienceEmpty) {
        return keywordKey;
      }

      return currentKeywordKey === keywordKey ? null : currentKeywordKey;
    });
  }, [data, hasNextPage, isError, isPending, keywordKey, selectedCategory]);

  const showKnownAllEmpty =
    selectedCategory !== 'all' &&
    emptyAllKeywordKey === keywordKey &&
    filteredExperienceCount === 0;
  const showListLoading =
    !showKnownAllEmpty &&
    (isPending || (isFetching && !isFetchingNextPage && filteredExperienceCount === 0));

  return {
    showListLoading,
  };
}
