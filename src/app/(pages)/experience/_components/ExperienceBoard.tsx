'use client';

import * as React from 'react';

import {
  ExperienceCardGrid,
  type ExperienceItem,
} from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { ExperienceCategoryTabs } from '@/app/(pages)/experience/_components/ExperienceCategoryTabs';
import type { ExperienceDetailSaveValue } from '@/app/(pages)/experience/_components/ExperienceDetailContent';
import { ExperienceDetailPanel } from '@/app/(pages)/experience/_components/ExperienceDetailPanel';
import { useExperienceBoardInfiniteScroll } from '@/app/(pages)/experience/_hooks/useExperienceBoardInfiniteScroll';
import { useExperienceBoardSelection } from '@/app/(pages)/experience/_hooks/useExperienceBoardSelection';
import {
  mapExperienceCardToItem,
  mapExperienceDetailToItem,
} from '@/app/(pages)/experience/_utils/mapExperienceResponse';
import {
  areExperienceOrderMapsEqual,
  createExperienceOrderMap,
  parseOrderedExperienceIds,
  removeExperienceFromOrderMap,
  syncExperienceOrderMap,
} from '@/app/(pages)/experience/_utils/experienceOrder';
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

const orderPieceTypeByCategory: Record<ExperienceCategory, PieceType> = {
  all: 'ALL',
  activity: 'ACTIVITY',
  career: 'CAREER',
  education: 'EDUCATION',
  etc: 'ETC',
};
const filterPieceTypeByCategory: Record<
  Exclude<ExperienceCategory, 'all'>,
  Exclude<PieceType, 'ALL'>
> = {
  activity: 'ACTIVITY',
  career: 'CAREER',
  education: 'EDUCATION',
  etc: 'ETC',
};

export function ExperienceBoard({
  initialSelectedExperienceId,
  keyword,
  className,
  ...props
}: ExperienceBoardProps) {
  const {
    selectedCategory,
    selectedExperienceId,
    panelOpen,
    applyInitialSelectedExperience,
    handleCategoryChange,
    handleExperienceSelect,
    closeSelectedExperience,
    handlePanelClose,
    handlePanelExpand,
  } = useExperienceBoardSelection({
    initialSelectedExperienceId,
    keyword,
  });
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
  const keywordKey = keyword ?? '';
  const [emptyAllKeywordKey, setEmptyAllKeywordKey] = React.useState<string | null>(null);
  const [experienceOrderMap, setExperienceOrderMap] = React.useState(() =>
    createExperienceOrderMap(experiences),
  );
  const [deleteTargetExperience, setDeleteTargetExperience] = React.useState<ExperienceItem | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = React.useState('');
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
    applyInitialSelectedExperience(experiences);
  }, [applyInitialSelectedExperience, experiences]);

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
  const { loadMoreRef } = useExperienceBoardInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    observedItemCount: filteredExperiences.length,
  });

  const selectedExperience = filteredExperiences.find(
    (experience) => experience.id === selectedExperienceId,
  );
  const panelExperience = selectedExperienceDetailItem ?? selectedExperience;
  const showDetailLoading =
    panelOpen &&
    Boolean(selectedExperienceId) &&
    (isDetailPending || (isDetailFetching && !selectedExperienceDetailMatches));
  const showKnownAllEmpty =
    selectedCategory !== 'all' &&
    emptyAllKeywordKey === keywordKey &&
    filteredExperiences.length === 0;
  const showListLoading =
    !showKnownAllEmpty &&
    (isPending || (isFetching && !isFetchingNextPage && filteredExperiences.length === 0));

  const handleExperienceReorder = React.useCallback(
    (orderedExperienceIds: string[]) => {
      const previousOrderIds = experienceOrderMap[selectedCategory];
      const parsedExperienceIds = parseOrderedExperienceIds(orderedExperienceIds);

      if (!parsedExperienceIds) {
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

  const handleDeleteDialogOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open && !deleteExperienceMutation.isPending) {
        setDeleteTargetExperience(null);
      }
    },
    [deleteExperienceMutation.isPending],
  );

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
          removeExperienceFromOrderMap(currentOrderMap, experience.id),
        );

        if (selectedExperienceId === experience.id) {
          closeSelectedExperience();
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '경험 삭제 중 오류가 발생했습니다.',
        );
      } finally {
        setDeleteTargetExperience(null);
      }
    },
    [closeSelectedExperience, deleteExperienceMutation, selectedExperienceId],
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
          onExpand={() => handlePanelExpand(panelExperience.id)}
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
