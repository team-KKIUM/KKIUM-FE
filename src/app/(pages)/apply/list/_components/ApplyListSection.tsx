'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';

import type { ApplyListItem } from '@/app/(pages)/apply/_constants/applyMockData';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingLottie } from '@/components/common/LoadingLottie';
import { useClientSearchParams } from '@/hooks/useClientSearchParams';
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
  initialSelectedJdId?: string | null;
}

export function ApplyListSection({ keyword, initialSelectedJdId }: ApplyListSectionProps) {
  const router = useRouter();
  const searchParams = useClientSearchParams();
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
  const [sidebarAnimated, setSidebarAnimated] = React.useState(false);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAppliedInitialSelectionRef = React.useRef(false);
  const previousKeywordRef = React.useRef(keyword);
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
    if (previousKeywordRef.current === keyword) {
      return;
    }

    previousKeywordRef.current = keyword;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSidebarOpen(false);
    setActiveId(null);
    setSidebarAnimated(false);
    setTitleOverrides({});
    hasAppliedInitialSelectionRef.current = false;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('selected');
    params.delete('view');

    router.replace(params.size > 0 ? `/apply/list?${params.toString()}` : '/apply/list', {
      scroll: false,
    });
  }, [keyword, router, searchParams]);

  React.useEffect(() => {
    if (hasAppliedInitialSelectionRef.current || !initialSelectedJdId) {
      return;
    }

    const initialSelectedCard = orderedCards.find((card) => card.id === initialSelectedJdId);

    if (!initialSelectedCard) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setActiveId(initialSelectedCard.id);
    setSidebarAnimated(false);
    setSidebarOpen(true);
    hasAppliedInitialSelectionRef.current = true;
  }, [initialSelectedJdId, orderedCards]);

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

    const params = new URLSearchParams(searchParams.toString());
    params.delete('selected');
    params.delete('view');
    router.replace(params.size > 0 ? `/apply/list?${params.toString()}` : '/apply/list', {
      scroll: false,
    });
  }

  function handleCardOpen(cardId: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveId(cardId);
    setSidebarAnimated(true);
    setSidebarOpen(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set('selected', cardId);
    params.delete('view');
    router.replace(`/apply/list?${params.toString()}`, { scroll: false });
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
        onError: () => {
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
          onError: () => {
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
        className="flex flex-1 items-center justify-center gap-3"
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
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          illustrationLabel="공고 목록 조회 실패"
          title="공고 목록을 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </div>
    );
  }

  if (orderedCards.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          illustrationLabel={keyword ? '검색 결과 없음' : '등록된 공고 없음'}
          title={keyword ? '검색 결과가 없어요' : '아직 생성된 공고가 없어요'}
          description={
            keyword
              ? '다른 검색어로 다시 검색해보세요.'
              : '공고를 추가해 파일에 끼워넣어볼까요?'
          }
        />
      </div>
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

      <ApplyDetailSidebar
        open={sidebarOpen}
        item={activeItem}
        animated={sidebarAnimated}
        onClose={handleClose}
      />
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
        priority={index === 0}
        onCardClick={() => onCardClick(card.id)}
        onUpdateTitle={onUpdateTitle}
        onToggleTarget={onToggleTarget}
        onDelete={onDelete}
      />
    </div>
  );
}
