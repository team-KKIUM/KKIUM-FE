'use client';

import * as React from 'react';

import {
  ExperienceCardGrid,
  type ExperienceItem,
} from '@/app/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/experience/_components/ExperienceCategoryTab';
import { ExperienceCategoryTabs } from '@/app/experience/_components/ExperienceCategoryTabs';
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
      className={cn('flex w-full flex-col gap-5', className)}
      {...props}
    >
      <ExperienceCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ExperienceCardGrid experiences={filteredExperiences} />
    </section>
  );
}
