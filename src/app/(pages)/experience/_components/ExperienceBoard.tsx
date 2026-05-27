'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import {
  ExperienceCardGrid,
  type ExperienceItem,
} from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { ExperienceCategoryTabs } from '@/app/(pages)/experience/_components/ExperienceCategoryTabs';
import type { ExperienceDetailSaveValue } from '@/app/(pages)/experience/_components/ExperienceDetailContent';
import { ExperienceDetailPanel } from '@/app/(pages)/experience/_components/ExperienceDetailPanel';
import {
  mapExperienceCardToItem,
  mapExperienceDetailToItem,
} from '@/app/(pages)/experience/_utils/mapExperienceResponse';
import { mapExperienceItemToUpdateRequest } from '@/app/(pages)/experience/_utils/mapExperienceItemToUpdateRequest';
import type { PieceType } from '@/app/api/experience/types';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import {
  useDeleteExperience,
  useExperienceDetail,
  useInfiniteExperiences,
  useUpdateExperience,
  useUpdateExperienceOrder,
  useUpdateExperienceTitle,
} from '@/hooks/experience/useExperiences';
import { cn } from '@/lib/utils';

export interface ExperienceBoardProps extends React.ComponentProps<'section'> {
  initialSelectedExperienceId?: string;
  keyword?: string;
}

type ExperienceOrderMap = Record<ExperienceCategory, string[]>;

const sortableCategories: ExperienceCategory[] = ['all', 'activity', 'career', 'education', 'etc'];
const orderPieceTypeByCategory: Record<ExperienceCategory, PieceType> = {
  all: 'ALL',
  activity: 'ACTIVITY',
  career: 'CAREER',
  education: 'EDUCATION',
  etc: 'ETC',
};
const filterPieceTypeByCategory: Record<Exclude<ExperienceCategory, 'all'>, Exclude<PieceType, 'ALL'>> = {
  activity: 'ACTIVITY',
  career: 'CAREER',
  education: 'EDUCATION',
  etc: 'ETC',
};

function isExperienceCategory(category: string | null): category is ExperienceCategory {
  return sortableCategories.includes(category as ExperienceCategory);
}

export function ExperienceBoard({
  initialSelectedExperienceId,
  keyword,
  className,
  ...props
}: ExperienceBoardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedExperienceIdFromQuery = searchParams.get('selected') ?? initialSelectedExperienceId;
  const selectedCategoryFromQuery = searchParams.get('category');
  const initialSelectedCategory = isExperienceCategory(selectedCategoryFromQuery)
    ? selectedCategoryFromQuery
    : 'all';
  const [selectedCategory, setSelectedCategory] =
    React.useState<ExperienceCategory>(initialSelectedCategory);
  const [selectedExperienceId, setSelectedExperienceId] = React.useState<string | undefined>(
    selectedExperienceIdFromQuery,
  );
  const selectedPieceType =
    selectedCategory === 'all' ? undefined : filterPieceTypeByCategory[selectedCategory];
  const experienceParams = React.useMemo(
    () => ({
      ...(selectedPieceType ? { type: selectedPieceType } : {}),
      ...(keyword ? { keyword } : {}),
    }),
    [keyword, selectedPieceType],
  );
  const { data, fetchNextPage, hasNextPage, isError, isFetching, isFetchingNextPage, isPending } =
    useInfiniteExperiences(experienceParams);
  const deleteExperienceMutation = useDeleteExperience();
  const updateExperienceMutation = useUpdateExperience();
  const updateExperienceOrderMutation = useUpdateExperienceOrder();
  const updateExperienceTitleMutation = useUpdateExperienceTitle();
  const experiences = React.useMemo(
    () => data?.pages.flatMap((page) => page.experiences.map(mapExperienceCardToItem)) ?? [],
    [data],
  );
  const [experienceOrderMap, setExperienceOrderMap] = React.useState(() =>
    createExperienceOrderMap(experiences),
  );
  const [panelOpen, setPanelOpen] = React.useState(Boolean(selectedExperienceIdFromQuery));
  const [deleteTargetExperience, setDeleteTargetExperience] =
    React.useState<ExperienceItem | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const hasAppliedInitialSelectionRef = React.useRef(false);
  const previousKeywordRef = React.useRef(keyword);
  const selectedExperienceNumericId = selectedExperienceId ? Number(selectedExperienceId) : null;
  const {
    data: selectedExperienceDetail,
    isError: isDetailError,
    isFetching: isDetailFetching,
    isPending: isDetailPending,
  } = useExperienceDetail(
    Number.isFinite(selectedExperienceNumericId) ? selectedExperienceNumericId : null,
  );
  const selectedExperienceDetailMatches =
    selectedExperienceDetail?.experienceId === selectedExperienceNumericId;
  const selectedExperienceDetailItem = React.useMemo(
    () =>
      selectedExperienceDetail && selectedExperienceDetailMatches
        ? mapExperienceDetailToItem(selectedExperienceDetail)
        : null,
    [selectedExperienceDetail, selectedExperienceDetailMatches],
  );

  React.useEffect(() => {
    setExperienceOrderMap((currentOrderMap) => {
      const nextOrderMap = syncExperienceOrderMap(currentOrderMap, experiences, selectedCategory);

      if (areExperienceOrderMapsEqual(currentOrderMap, nextOrderMap)) {
        return currentOrderMap;
      }

      return nextOrderMap;
    });
  }, [experiences, selectedCategory]);

  React.useEffect(() => {
    if (previousKeywordRef.current === keyword) {
      return;
    }

    previousKeywordRef.current = keyword;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedExperienceId(undefined);
    setPanelOpen(false);

    const params = new URLSearchParams(searchParams.toString());

    params.delete('selected');

    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    router.replace(params.size > 0 ? `/experience?${params.toString()}` : '/experience', {
      scroll: false,
    });
  }, [keyword, router, searchParams, selectedCategory]);

  React.useEffect(() => {
    if (hasAppliedInitialSelectionRef.current || !selectedExperienceIdFromQuery) {
      return;
    }

    const initialSelectedExperience = experiences.find(
      (experience) => experience.id === selectedExperienceIdFromQuery,
    );

    if (!initialSelectedExperience) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedCategory(initialSelectedCategory);
    setSelectedExperienceId(initialSelectedExperience.id);
    setPanelOpen(true);
    hasAppliedInitialSelectionRef.current = true;
  }, [experiences, initialSelectedCategory, selectedExperienceIdFromQuery]);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const experienceMap = React.useMemo(
    () => new Map(experiences.map((experience) => [experience.id, experience])),
    [experiences],
  );

  const filteredExperiences = React.useMemo(
    () =>
      experienceOrderMap[selectedCategory]
        .map((id) => experienceMap.get(id))
        .filter((experience): experience is ExperienceItem => Boolean(experience)),
    [experienceMap, experienceOrderMap, selectedCategory],
  );

  React.useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, filteredExperiences.length, hasNextPage, isFetchingNextPage]);

  const selectedExperience = filteredExperiences.find(
    (experience) => experience.id === selectedExperienceId,
  );
  const panelExperience = selectedExperienceDetailItem ?? selectedExperience;
  const showDetailLoading =
    panelOpen &&
    Boolean(selectedExperienceId) &&
    (isDetailPending || (isDetailFetching && !selectedExperienceDetailMatches));
  const showListLoading =
    isPending || (isFetching && !isFetchingNextPage && filteredExperiences.length === 0);

  const handleCategoryChange = (category: ExperienceCategory) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    router.replace('/experience', { scroll: false });
    setSelectedCategory(category);
    setSelectedExperienceId(undefined);
    setPanelOpen(false);
  };

  const handleExperienceSelect = (experience: ExperienceItem) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedExperienceId(experience.id);
    setPanelOpen(true);
    router.replace(`/experience?selected=${experience.id}&category=${selectedCategory}`, {
      scroll: false,
    });
  };

  const handleExperienceReorder = React.useCallback(
    (orderedExperienceIds: string[]) => {
      const previousOrderIds = experienceOrderMap[selectedCategory];
      const parsedExperienceIds = orderedExperienceIds.map(Number);

      if (
        parsedExperienceIds.some(
          (experienceId) => !Number.isInteger(experienceId) || experienceId <= 0,
        )
      ) {
        return;
      }

      setExperienceOrderMap((currentOrderMap) => ({
        ...currentOrderMap,
        [selectedCategory]: orderedExperienceIds,
      }));

      updateExperienceOrderMutation.mutate(
        {
          type: orderPieceTypeByCategory[selectedCategory],
          experienceIds: parsedExperienceIds,
        },
        {
          onError: () => {
            setExperienceOrderMap((currentOrderMap) => ({
              ...currentOrderMap,
              [selectedCategory]: previousOrderIds,
            }));
          },
        },
      );
    },
    [experienceOrderMap, selectedCategory, updateExperienceOrderMutation],
  );

  const handleExperienceTitleSave = React.useCallback(
    async (experience: ExperienceItem, nextTitle: string) => {
      const experienceId = Number(experience.id);

      if (!Number.isInteger(experienceId) || experienceId <= 0) {
        throw new Error('수정할 경험 정보를 확인하지 못했습니다.');
      }

      await updateExperienceTitleMutation.mutateAsync({
        experienceId,
        request: { title: nextTitle },
      });
    },
    [updateExperienceTitleMutation],
  );

  const handleExperienceDeleteRequest = React.useCallback((experience: ExperienceItem) => {
    setDeleteTargetExperience(experience);
  }, []);

  const handleDeleteDialogOpenChange = React.useCallback((open: boolean) => {
    if (!open && !deleteExperienceMutation.isPending) {
      setDeleteTargetExperience(null);
    }
  }, [deleteExperienceMutation.isPending]);

  const handleExperienceDeleteConfirm = React.useCallback(
    async (experience: ExperienceItem) => {
      const experienceId = Number(experience.id);

      if (!Number.isInteger(experienceId) || experienceId <= 0) {
        setErrorMessage('삭제할 경험 정보를 확인하지 못했습니다.');
        setDeleteTargetExperience(null);
        return;
      }

      try {
        await deleteExperienceMutation.mutateAsync(experienceId);

        setExperienceOrderMap((currentOrderMap) =>
          sortableCategories.reduce<ExperienceOrderMap>((nextOrderMap, category) => {
            nextOrderMap[category] = currentOrderMap[category].filter(
              (id) => id !== experience.id,
            );
            return nextOrderMap;
          }, {} as ExperienceOrderMap),
        );

        if (selectedExperienceId === experience.id) {
          if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
          }

          setPanelOpen(false);
          setSelectedExperienceId(undefined);
          router.replace('/experience', { scroll: false });
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '경험 삭제 중 오류가 발생했습니다.');
      } finally {
        setDeleteTargetExperience(null);
      }
    },
    [deleteExperienceMutation, router, selectedExperienceId],
  );

  const handleExperienceDetailSave = React.useCallback(
    async (nextExperience: ExperienceDetailSaveValue) => {
      if (!panelExperience) {
        throw new Error('수정할 경험 정보를 확인하지 못했습니다.');
      }

      const experienceId = Number(panelExperience.id);

      if (!Number.isInteger(experienceId) || experienceId <= 0) {
        throw new Error('수정할 경험 정보를 확인하지 못했습니다.');
      }

      const updatedExperience = {
        ...panelExperience,
        ...nextExperience,
      };

      await updateExperienceMutation.mutateAsync({
        experienceId,
        request: mapExperienceItemToUpdateRequest(updatedExperience),
      });
    },
    [panelExperience, updateExperienceMutation],
  );

  const handlePanelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setPanelOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setSelectedExperienceId(undefined);
      closeTimerRef.current = null;
    }, 300);
    router.replace('/experience', { scroll: false });
  };

  const handlePanelExpand = () => {
    if (!panelExperience) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set('selected', panelExperience.id);
    params.set('category', selectedCategory);
    params.set('view', 'detail');

    router.push(`/experience?${params.toString()}`);
  };

  return (
    <section
      data-slot="experience-board"
      className={cn('flex w-full flex-1 flex-col gap-5', className)}
      {...props}
    >
      <ExperienceCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      {/* TODO: 로딩/에러 상태 전용 UI가 확정되면 임시 EmptyState를 교체한다. */}
      {showListLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState title="경험을 불러오는 중이에요" illustrationLabel="경험 목록 로딩 중" />
        </div>
      ) : isError ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="경험을 불러오지 못했어요"
            description="잠시 후 다시 시도해주세요"
            illustrationLabel="경험 목록 오류"
          />
        </div>
      ) : filteredExperiences.length > 0 ? (
        <>
          <ExperienceCardGrid
            experiences={filteredExperiences}
            selectedExperienceId={selectedExperienceId}
            sortable
            onExperienceClick={handleExperienceSelect}
            onExperienceDelete={handleExperienceDeleteRequest}
            onExperienceReorder={handleExperienceReorder}
            onExperienceTitleSave={handleExperienceTitleSave}
          />
          <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
          {/* TODO: 다음 페이지 로딩 UI가 확정되면 임시 문구를 교체한다. */}
          {isFetchingNextPage && (
            <p className="text-center body-3-regular text-tertiary">경험을 더 불러오는 중이에요</p>
          )}
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="아직 생성된 경험이 없어요"
            description="경험을 추가해 파일에 끼워넣어볼까요?"
            illustrationLabel="등록된 경험이 없습니다"
          />
        </div>
      )}
      {panelExperience && (
        <ExperienceDetailPanel
          experience={panelExperience}
          open={panelOpen}
          detailError={isDetailError}
          detailLoading={showDetailLoading}
          onExpand={handlePanelExpand}
          onSave={handleExperienceDetailSave}
          onClose={handlePanelClose}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleteTargetExperience)}
        title="정말로 삭제하시겠습니까?"
        description="삭제시 모든 기록과 분석 내용이 소멸됩니다."
        confirmLabel="삭제하기"
        confirming={deleteExperienceMutation.isPending}
        destructive
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={() => {
          if (deleteTargetExperience) {
            void handleExperienceDeleteConfirm(deleteTargetExperience);
          }
        }}
      />
      <ErrorDialog
        open={errorMessage.length > 0}
        message={errorMessage}
        onOpenChange={(open) => {
          if (!open) {
            setErrorMessage('');
          }
        }}
      />
    </section>
  );
}

function areStringArraysEqual(source: string[], target: string[]) {
  return source.length === target.length && source.every((item, index) => item === target[index]);
}

function createExperienceOrderMap(experiences: ExperienceItem[]): ExperienceOrderMap {
  return {
    all: experiences.map((experience) => experience.id),
    activity: getExperienceIdsByCategory(experiences, 'activity'),
    career: getExperienceIdsByCategory(experiences, 'career'),
    education: getExperienceIdsByCategory(experiences, 'education'),
    etc: getExperienceIdsByCategory(experiences, 'etc'),
  };
}

function syncExperienceOrderMap(
  currentOrderMap: ExperienceOrderMap,
  experiences: ExperienceItem[],
  syncedCategory: ExperienceCategory,
): ExperienceOrderMap {
  const defaultOrderMap = createExperienceOrderMap(experiences);

  if (syncedCategory === 'all') {
    return defaultOrderMap;
  }

  return sortableCategories.reduce<ExperienceOrderMap>((nextOrderMap, category) => {
    if (category === syncedCategory) {
      nextOrderMap[category] = defaultOrderMap[category];
      return nextOrderMap;
    }

    const nextIds = defaultOrderMap[category];
    const nextIdSet = new Set(nextIds);
    const currentIds = currentOrderMap[category] ?? [];
    const currentIdSet = new Set(currentIds);
    const preservedIds = currentIds.filter((id) => nextIdSet.has(id));
    const addedIds = nextIds.filter((id) => !currentIdSet.has(id));

    nextOrderMap[category] = [...preservedIds, ...addedIds];

    return nextOrderMap;
  }, {} as ExperienceOrderMap);
}

function getExperienceIdsByCategory(
  experiences: ExperienceItem[],
  category: Exclude<ExperienceCategory, 'all'>,
) {
  return experiences
    .filter((experience) => experience.type === category)
    .map((experience) => experience.id);
}

function areExperienceOrderMapsEqual(source: ExperienceOrderMap, target: ExperienceOrderMap) {
  return sortableCategories.every((category) =>
    areStringArraysEqual(source[category], target[category]),
  );
}
