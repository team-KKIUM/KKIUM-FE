'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import type { ExperienceCategory } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { EXPERIENCE_ORDER_CATEGORIES } from '@/app/(pages)/experience/_utils/experienceOrder';

interface ExperienceSelectionItem {
  id: string;
}

interface UseExperienceBoardSelectionParams {
  initialSelectedExperienceId?: string;
  keyword?: string;
  onDetailViewRequest?: (experienceId: string) => void;
}

function isExperienceCategory(category: string | null): category is ExperienceCategory {
  return EXPERIENCE_ORDER_CATEGORIES.includes(category as ExperienceCategory);
}

function getCurrentSearchParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
}

export function useExperienceBoardSelection({
  initialSelectedExperienceId,
  keyword,
  onDetailViewRequest,
}: UseExperienceBoardSelectionParams) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<ExperienceCategory>('all');
  const [selectedExperienceId, setSelectedExperienceId] = React.useState<string | undefined>(
    initialSelectedExperienceId,
  );
  const [panelOpen, setPanelOpen] = React.useState(Boolean(initialSelectedExperienceId));
  const [initialSelectedCategory, setInitialSelectedCategory] =
    React.useState<ExperienceCategory>('all');
  const [selectedExperienceIdFromQuery, setSelectedExperienceIdFromQuery] = React.useState<
    string | undefined
  >(initialSelectedExperienceId);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAppliedInitialSelectionRef = React.useRef(false);
  const previousKeywordRef = React.useRef(keyword);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const syncRouteSelection = React.useCallback(() => {
    clearCloseTimer();
    const searchParams = getCurrentSearchParams();
    const nextSelectedExperienceId = searchParams.get('selected') ?? initialSelectedExperienceId;
    const selectedCategoryFromQuery = searchParams.get('category');
    const nextSelectedCategory = isExperienceCategory(selectedCategoryFromQuery)
      ? selectedCategoryFromQuery
      : 'all';

    hasAppliedInitialSelectionRef.current = false;
    setInitialSelectedCategory(nextSelectedCategory);
    setSelectedCategory(nextSelectedCategory);
    setSelectedExperienceIdFromQuery(nextSelectedExperienceId);

    if (nextSelectedExperienceId) {
      setSelectedExperienceId(nextSelectedExperienceId);
      setPanelOpen(true);
    } else {
      setSelectedExperienceId(undefined);
      setPanelOpen(false);
    }
  }, [clearCloseTimer, initialSelectedExperienceId]);

  React.useEffect(() => {
    syncRouteSelection();
    window.addEventListener('popstate', syncRouteSelection);

    return () => window.removeEventListener('popstate', syncRouteSelection);
  }, [syncRouteSelection]);

  const applyInitialSelectedExperience = React.useCallback(
    (experiences: readonly ExperienceSelectionItem[]) => {
      if (hasAppliedInitialSelectionRef.current || !selectedExperienceIdFromQuery) {
        return;
      }

      const initialSelectedExperience = experiences.find(
        (experience) => experience.id === selectedExperienceIdFromQuery,
      );

      if (!initialSelectedExperience) {
        return;
      }

      clearCloseTimer();
      setSelectedCategory(initialSelectedCategory);
      setSelectedExperienceId(initialSelectedExperience.id);
      setPanelOpen(true);
      hasAppliedInitialSelectionRef.current = true;
    },
    [clearCloseTimer, initialSelectedCategory, selectedExperienceIdFromQuery],
  );

  React.useEffect(() => {
    if (previousKeywordRef.current === keyword) {
      return;
    }

    previousKeywordRef.current = keyword;
    clearCloseTimer();
    setSelectedExperienceId(undefined);
    setPanelOpen(false);

    const params = getCurrentSearchParams();

    params.delete('selected');

    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    router.replace(params.size > 0 ? `/experience?${params.toString()}` : '/experience', {
      scroll: false,
    });
  }, [clearCloseTimer, keyword, router, selectedCategory]);

  React.useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const handleCategoryChange = React.useCallback(
    (category: ExperienceCategory) => {
      clearCloseTimer();
      const nextPath = category === 'all' ? '/experience' : `/experience?category=${category}`;

      router.replace(nextPath, { scroll: false });
      setSelectedCategory(category);
      setSelectedExperienceId(undefined);
      setPanelOpen(false);
    },
    [clearCloseTimer, router],
  );

  const handleExperienceSelect = React.useCallback(
    (experience: ExperienceSelectionItem) => {
      clearCloseTimer();
      setSelectedExperienceId(experience.id);
      setPanelOpen(true);
      router.replace(`/experience?selected=${experience.id}&category=${selectedCategory}`, {
        scroll: false,
      });
    },
    [clearCloseTimer, router, selectedCategory],
  );

  const closeSelectedExperience = React.useCallback(() => {
    clearCloseTimer();
    setPanelOpen(false);
    setSelectedExperienceId(undefined);
    router.replace('/experience', { scroll: false });
  }, [clearCloseTimer, router]);

  const handlePanelClose = React.useCallback(() => {
    clearCloseTimer();
    setPanelOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setSelectedExperienceId(undefined);
      closeTimerRef.current = null;
    }, 300);
    router.replace('/experience', { scroll: false });
  }, [clearCloseTimer, router]);

  const handlePanelExpand = React.useCallback(
    (experienceId?: string) => {
      if (!experienceId) {
        return;
      }

      const params = getCurrentSearchParams();

      params.set('selected', experienceId);
      params.set('category', selectedCategory);
      params.set('view', 'detail');

      router.push(`/experience?${params.toString()}`);
      onDetailViewRequest?.(experienceId);
    },
    [onDetailViewRequest, router, selectedCategory],
  );

  return {
    selectedCategory,
    selectedExperienceId,
    panelOpen,
    applyInitialSelectedExperience,
    handleCategoryChange,
    handleExperienceSelect,
    closeSelectedExperience,
    handlePanelClose,
    handlePanelExpand,
  };
}
