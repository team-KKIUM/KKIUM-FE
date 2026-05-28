'use client';

import * as React from 'react';
import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';

import type { ApplyListItem } from '@/app/(pages)/apply/_constants/applyMockData';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingLottie } from '@/components/common/LoadingLottie';
import {
  useDeleteApplyJobPosting,
  useInfiniteApplyJobPostings,
  useToggleApplyTargetJobPosting,
  useUpdateApplyJobPostingOrder,
  useUpdateApplyJobPostingTitle,
} from '@/hooks/apply/useApplyJobPostings';
import { ApplyCard } from './ApplyCard';
import { ApplyDetailSidebar } from './ApplyDetailSidebar';

export interface ApplyListSectionProps {
  keyword?: string;
}

function serializeQueryError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...('status' in error ? { status: error.status } : {}),
      ...('code' in error ? { code: error.code } : {}),
      ...('cause' in error ? { cause: error.cause } : {}),
    };
  }

  return error;
}

export function ApplyListSection({ keyword }: ApplyListSectionProps) {
  const isDragDisabled = Boolean(keyword?.trim());
  const listParams = React.useMemo(
    () => ({
      size: 10,
      ...(keyword ? { keyword } : {}),
    }),
    [keyword],
  );
  const {
    data,
    error: listError,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isPending,
  } = useInfiniteApplyJobPostings(listParams);
  const [titleOverrides, setTitleOverrides] = React.useState<Record<string, string>>({});
  const cards = React.useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.items.map((item) => ({
          ...item,
          title: titleOverrides[item.id] ?? item.title,
        })),
      ) ?? [],
    [data, titleOverrides],
  );
  const [orderedCards, setOrderedCards] = React.useState<ApplyListItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const updateTitleMutation = useUpdateApplyJobPostingTitle();
  const updateOrderMutation = useUpdateApplyJobPostingOrder();
  const toggleTargetMutation = useToggleApplyTargetJobPosting();
  const deleteMutation = useDeleteApplyJobPosting();
  const menuActionDisabled =
    updateTitleMutation.isPending ||
    updateOrderMutation.isPending ||
    toggleTargetMutation.isPending ||
    deleteMutation.isPending;

  React.useEffect(() => {
    setOrderedCards(cards);
  }, [cards]);

  React.useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSidebarOpen(false);
    setActiveId(null);
    setTitleOverrides({});
  }, [keyword]);

  React.useEffect(() => {
    if (!isError) {
      return;
    }

    console.error('[ApplyListSection] 공고 목록 조회 실패', {
      keyword: keyword ?? '',
      error: serializeQueryError(listError),
    });
  }, [isError, keyword, listError]);

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

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, orderedCards.length]);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const activeItem = React.useMemo(
    () => orderedCards.find((card) => card.id === activeId) ?? null,
    [orderedCards, activeId],
  );

  function handleClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setSidebarOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setActiveId(null);
      closeTimerRef.current = null;
    }, 560);
  }

  function handleCardOpen(cardId: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveId(cardId);
    setSidebarOpen(true);
  }

  function handleUpdateTitle(cardId: string, nextTitle: string) {
    const currentTitle = orderedCards.find((card) => card.id === cardId)?.title;

    if (!nextTitle || nextTitle === currentTitle) {
      return;
    }

    setTitleOverrides((prev) => ({ ...prev, [cardId]: nextTitle }));
    setOrderedCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, title: nextTitle } : card)),
    );

    updateTitleMutation.mutate(
      { jdId: cardId, request: { title: nextTitle } },
      {
        onError: (error) => {
          console.error('[ApplyListSection] 공고 제목 수정 실패', {
            cardId,
            nextTitle,
            error: serializeQueryError(error),
          });

          setTitleOverrides((prev) => {
            const next = { ...prev };
            delete next[cardId];
            return next;
          });
          setOrderedCards((prev) =>
            prev.map((card) =>
              card.id === cardId ? { ...card, title: currentTitle ?? card.title } : card,
            ),
          );
        },
      },
    );
  }

  function handleToggleTarget(cardId: string) {
    toggleTargetMutation.mutate(cardId, {
      onSuccess: () => {
        setOrderedCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, isTarget: !card.isTarget } : card,
          ),
        );
      },
    });
  }

  function handleDelete(cardId: string) {
    deleteMutation.mutate(cardId, {
      onSuccess: () => {
        setOrderedCards((prev) => prev.filter((card) => card.id !== cardId));

        if (activeId === cardId) {
          handleClose();
        }
      },
    });
  }

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      if (isDragDisabled) {
        return;
      }

      if (event.canceled) {
        return;
      }

      const { source } = event.operation;

      if (!isSortable(source)) {
        return;
      }

      const { initialIndex, index } = source;

      if (initialIndex === index) {
        return;
      }

      const previousOrder = orderedCards;
      const nextOrder = arrayMove(orderedCards, initialIndex, index);
      setOrderedCards(nextOrder);

      updateOrderMutation.mutate(
        { jdIds: nextOrder.map((card) => Number(card.id)).filter(Number.isFinite) },
        {
          onError: (error) => {
            console.error('[ApplyListSection] 공고 순서 저장 실패', {
              error: serializeQueryError(error),
            });
            setOrderedCards(previousOrder);
          },
        },
      );
    },
    [isDragDisabled, orderedCards, updateOrderMutation],
  );

  if (isPending) {
    return (
      <div
        className="flex h-[823px] w-full flex-col items-center justify-center gap-3"
        aria-live="polite"
        aria-label="공고 목록 로딩 중"
      >
        <LoadingLottie />
        <p className="body-1-bold text-strong">공고를 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        className="h-[823px] w-full py-64"
        illustrationLabel="공고 목록 조회 실패"
        title="공고 목록을 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  if (orderedCards.length === 0) {
    return (
      <EmptyState
        className="h-[823px] w-full py-64"
        illustrationLabel={keyword ? '검색 결과 없음' : '등록된 공고 없음'}
        title={keyword ? '검색 결과가 없어요' : '아직 생성된 공고가 없어요'}
        description={
          keyword
            ? '다른 검색어로 다시 검색해보세요.'
            : '공고를 추가해 파일에 끼워넣어볼까요?'
        }
      />
    );
  }

  return (
    <>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-5 [@media(min-width:1855px)]:grid-cols-3">
          {orderedCards.map((card, index) => (
            <SortableApplyCard
              key={card.id}
              card={card}
              index={index}
              selected={sidebarOpen && activeId === card.id}
              menuActionDisabled={menuActionDisabled}
              dragDisabled={isDragDisabled}
              onCardClick={handleCardOpen}
              onUpdateTitle={handleUpdateTitle}
              onToggleTarget={handleToggleTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DragDropProvider>

      <div ref={loadMoreRef} className="h-8 w-full" aria-hidden />
      {isFetchingNextPage || (isFetching && orderedCards.length > 0) ? (
        <div
          className="flex w-full items-center justify-center py-4"
          aria-live="polite"
          aria-label="공고 추가 로딩 중"
        >
          <LoadingLottie className="size-16" />
        </div>
      ) : null}

      <ApplyDetailSidebar open={sidebarOpen} item={activeItem} onClose={handleClose} />
    </>
  );
}

interface SortableApplyCardProps {
  card: ApplyListItem;
  index: number;
  selected: boolean;
  menuActionDisabled: boolean;
  dragDisabled: boolean;
  onCardClick: (cardId: string) => void;
  onUpdateTitle: (cardId: string, nextTitle: string) => void;
  onToggleTarget: (cardId: string) => void;
  onDelete: (cardId: string) => void;
}

function SortableApplyCard({
  card,
  index,
  selected,
  menuActionDisabled,
  dragDisabled,
  onCardClick,
  onUpdateTitle,
  onToggleTarget,
  onDelete,
}: SortableApplyCardProps) {
  const { ref, isDragSource } = useSortable({
    id: card.id,
    index,
    type: 'apply-card',
    accept: 'apply-card',
    disabled: dragDisabled,
  });

  return (
    <div ref={ref} className={isDragSource ? 'relative z-10 opacity-90' : undefined}>
      <ApplyCard
        jdId={card.id}
        applyTitle={card.title}
        companyName={card.companyName}
        jobField={card.jobField}
        period={card.period}
        isTargeted={card.isTarget}
        menuActionDisabled={menuActionDisabled}
        selected={selected}
        onCardClick={() => onCardClick(card.id)}
        onUpdateTitle={onUpdateTitle}
        onToggleTarget={onToggleTarget}
        onDelete={onDelete}
      />
    </div>
  );
}
