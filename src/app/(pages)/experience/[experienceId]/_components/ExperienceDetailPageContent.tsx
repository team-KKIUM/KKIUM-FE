'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { ExperienceDetailContent } from '@/app/(pages)/experience/_components/ExperienceDetailContent';
import { mapExperienceDetailToItem } from '@/app/(pages)/experience/_utils/mapExperienceResponse';
import { EmptyState } from '@/components/common/EmptyState';
import { ExpandIcon } from '@/components/common/icons/ExpandIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { useExperienceDetail } from '@/hooks/experience/useExperiences';

interface ExperienceDetailPageContentProps {
  experienceId: number;
}

export function ExperienceDetailPageContent({ experienceId }: ExperienceDetailPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { data, isError, isPending } = useExperienceDetail(experienceId);
  const experience = React.useMemo(() => (data ? mapExperienceDetailToItem(data) : null), [data]);

  const handleCollapseToPanel = () => {
    const params = new URLSearchParams({ selected: String(experienceId) });

    if (category) {
      params.set('category', category);
    }

    router.push(`/experience?${params.toString()}`);
  };

  const handleBackToExperience = () => {
    router.push('/experience');
  };

  return (
    <div className="mx-16 flex min-h-[calc(100vh-32px)] flex-col bg-background-default">
      <div className="flex w-full flex-1 flex-col gap-[22px]">
        <header className="grid h-8 grid-cols-[32px_1fr_32px] items-center">
          <button
            type="button"
            aria-label="경험 상세 패널로 돌아가기"
            className="flex size-8 cursor-pointer items-center justify-center text-primary"
            onClick={handleCollapseToPanel}
          >
            <ExpandIcon className="size-6" />
          </button>

          <h1 className="text-center heading-3-extra-bold text-strong">상세 경험</h1>

          <button
            type="button"
            aria-label="경험 상세 페이지 닫기"
            className="flex size-8 cursor-pointer items-center justify-center text-primary"
            onClick={handleBackToExperience}
          >
            <XIcon className="size-6" />
          </button>
        </header>

        {/* TODO: 상세 페이지 로딩/에러 UI가 확정되면 임시 EmptyState를 교체한다. */}
        {isPending ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState title="경험을 불러오는 중이에요" illustrationLabel="경험 상세 로딩 중" />
          </div>
        ) : isError || !experience ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title="경험을 불러오지 못했어요"
              description="잠시 후 다시 시도해주세요"
              illustrationLabel="경험 상세 오류"
            />
          </div>
        ) : (
          <ExperienceDetailContent experience={experience} variant="page" scrollable={false} />
        )}
      </div>
    </div>
  );
}
