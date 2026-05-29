'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import type { ApplyListItem } from '@/app/(pages)/apply/_constants/applyMockData';
import { ApplyDetailContent } from '@/app/(pages)/apply/list/_components/ApplyDetailContent';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingLottie } from '@/components/common/LoadingLottie';
import { useInfiniteApplyJobPostings } from '@/hooks/apply/useApplyJobPostings';

interface ApplyDetailPageContentProps {
  jdId: string;
}

export function ApplyDetailPageContent({ jdId }: ApplyDetailPageContentProps) {
  const router = useRouter();
  const { data, isPending, isError } = useInfiniteApplyJobPostings({ size: 10 });

  const item = React.useMemo<ApplyListItem | null>(() => {
    const items = data?.pages.flatMap((page) => page.items) ?? [];
    return items.find((entry) => entry.id === jdId) ?? null;
  }, [data, jdId]);

  const handleClose = () => {
    router.push('/apply/list');
  };

  const handleCollapseToPanel = () => {
    router.push(`/apply/list?selected=${encodeURIComponent(jdId)}`);
  };

  if (isPending) {
    return (
      <div
        className="flex min-h-[calc(100dvh-30px)] flex-col items-center justify-center gap-3"
        aria-live="polite"
        aria-label="지원 상세 로딩 중"
      >
        <LoadingLottie />
        <p className="body-1-bold text-strong">지원 상세를 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <EmptyState
        className="min-h-[calc(100dvh-30px)] w-full py-64"
        illustrationLabel="지원 상세 조회 실패"
        title="지원 상세를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-30px)] w-full flex-col bg-[#FAFAFA]">
      <ApplyDetailContent
        item={item}
        variant="page"
        onClose={handleClose}
        onCollapseToPanel={handleCollapseToPanel}
      />
    </div>
  );
}
