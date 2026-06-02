'use client';

import * as React from 'react';

interface UseExperienceBoardInfiniteScrollParams {
  fetchNextPage: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  observedItemCount: number;
}

export function useExperienceBoardInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  observedItemCount,
}: UseExperienceBoardInfiniteScrollParams) {
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, observedItemCount]);

  return {
    loadMoreRef,
  };
}
