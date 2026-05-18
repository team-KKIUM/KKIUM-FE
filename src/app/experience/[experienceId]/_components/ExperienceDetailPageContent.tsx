'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { ExperienceDetailContent } from '@/app/experience/_components/ExperienceDetailContent';
import type { ExperienceItem } from '@/app/experience/_components/ExperienceCardGrid';
import { ExpandIcon } from '@/components/common/icons/ExpandIcon';
import { XIcon } from '@/components/common/icons/XIcon';

interface ExperienceDetailPageContentProps {
  experience: ExperienceItem;
}

export function ExperienceDetailPageContent({ experience }: ExperienceDetailPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const handleCollapseToPanel = () => {
    const params = new URLSearchParams({ selected: experience.id });

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

        <ExperienceDetailContent experience={experience} variant="page" scrollable={false} />
      </div>
    </div>
  );
}
