'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { ExperienceCardGrid } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { ExperienceCategoryTabs } from '@/app/(pages)/experience/_components/ExperienceCategoryTabs';
import type { ExperienceDetailPanelProps } from '@/app/(pages)/experience/_components/ExperienceDetailPanel';
import { useExperienceBoardActions } from '@/app/(pages)/experience/_hooks/useExperienceBoardActions';
import { useExperienceBoardDetail } from '@/app/(pages)/experience/_hooks/useExperienceBoardDetail';
import { useExperienceBoardInfiniteScroll } from '@/app/(pages)/experience/_hooks/useExperienceBoardInfiniteScroll';
import { useExperienceBoardListState } from '@/app/(pages)/experience/_hooks/useExperienceBoardListState';
import { useExperienceBoardOrder } from '@/app/(pages)/experience/_hooks/useExperienceBoardOrder';
import { useExperienceBoardReorder } from '@/app/(pages)/experience/_hooks/useExperienceBoardReorder';
import { useExperienceBoardSelection } from '@/app/(pages)/experience/_hooks/useExperienceBoardSelection';
import { mapExperienceCardToItem } from '@/app/(pages)/experience/_utils/mapExperienceResponse';
import type { PieceType } from '@/app/api/experience/types';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { useInfiniteExperiences } from '@/hooks/experience/useExperiences';
import { cn } from '@/lib/utils';

export interface ExperienceBoardProps extends React.ComponentProps<'section'> {
  initialSelectedExperienceId?: string;
  keyword?: string;
}

const filterPieceTypeByCategory: Record<
  Exclude<ExperienceCategory, 'all'>,
  Exclude<PieceType, 'ALL'>
> = {
  activity: 'ACTIVITY',
  career: 'CAREER',
  education: 'EDUCATION',
  etc: 'ETC',
};

const ExperienceDetailPanel = dynamic<ExperienceDetailPanelProps>(
  () =>
    import('@/app/(pages)/experience/_components/ExperienceDetailPanel').then(
      (mod) => mod.ExperienceDetailPanel,
    ),
  {
    ssr: false,
    loading: ExperienceDetailPanelLoading,
  },
);

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
  const experiences = React.useMemo(
    () => data?.pages.flatMap((page) => page.experiences.map(mapExperienceCardToItem)) ?? [],
    [data],
  );
  const { experienceOrderMap, setExperienceOrderMap, filteredExperiences } =
    useExperienceBoardOrder({
      experiences,
      selectedCategory,
    });

  React.useEffect(() => {
    applyInitialSelectedExperience(experiences);
  }, [applyInitialSelectedExperience, experiences]);

  const { loadMoreRef } = useExperienceBoardInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    observedItemCount: filteredExperiences.length,
  });
  const { showListLoading } = useExperienceBoardListState({
    data,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isPending,
    keyword,
    selectedCategory,
    filteredExperienceCount: filteredExperiences.length,
  });

  const selectedExperience = filteredExperiences.find(
    (experience) => experience.id === selectedExperienceId,
  );
  const { panelExperience, isDetailError, showDetailLoading } = useExperienceBoardDetail({
    selectedExperienceId,
    selectedExperience,
    panelOpen,
  });
  const {
    deleteTargetExperience,
    errorMessage,
    isDeletingExperience,
    handleExperienceTitleSave,
    handleExperienceDeleteRequest,
    handleDeleteDialogOpenChange,
    handleExperienceDeleteConfirm,
    handleExperienceDetailSave,
    handleErrorDialogOpenChange,
  } = useExperienceBoardActions({
    panelExperience,
    selectedExperienceId,
    closeSelectedExperience,
    setExperienceOrderMap,
  });
  const { handleExperienceReorder } = useExperienceBoardReorder({
    selectedCategory,
    experienceOrderMap,
    setExperienceOrderMap,
  });

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
        confirming={isDeletingExperience}
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
        onOpenChange={handleErrorDialogOpenChange}
      />
    </section>
  );
}

function ExperienceDetailPanelLoading() {
  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="경험 상세 패널 로딩 중"
      className="fixed top-0 right-0 z-40 flex h-dvh w-full max-w-[500px] flex-col gap-6 bg-background-default px-6 pt-8 pb-8 shadow-2xl"
    >
      <div className="grid h-8 grid-cols-[32px_1fr_32px] items-center">
        <div className="size-8 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="size-8 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex animate-pulse flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-5 w-full rounded bg-gray-100" />
          <div className="h-5 w-2/3 rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-28 rounded-lg bg-gray-100" />
          <div className="h-28 rounded-lg bg-gray-100" />
        </div>
      </div>
    </aside>
  );
}
