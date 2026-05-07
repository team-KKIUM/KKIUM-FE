'use client';

import * as React from 'react';

import {
  ExperienceCardGrid,
  type ExperienceItem,
} from '@/app/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/experience/_components/ExperienceCategoryTab';
import { ExperienceCategoryTabs } from '@/app/experience/_components/ExperienceCategoryTabs';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';

export interface ExperienceBoardProps extends React.ComponentProps<'section'> {
  experiences: ExperienceItem[];
}

export function ExperienceBoard({ experiences, className, ...props }: ExperienceBoardProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ExperienceCategory>('all');

  const filteredExperiences =
    selectedCategory === 'all'
      ? experiences
      : experiences.filter((experience) => experience.type === selectedCategory);

  return (
    <section
      data-slot="experience-board"
      className={cn('flex w-full flex-1 flex-col gap-5', className)}
      {...props}
    >
      <ExperienceCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {filteredExperiences.length > 0 ? (
        <ExperienceCardGrid experiences={filteredExperiences} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="아직 생성된 경험이 없어요"
            description="경험을 추가해 파일에 끼워넣어볼까요?"
            illustrationLabel="등록된 경험이 없습니다"
          />
        </div>
      )}
    </section>
  );
}
