'use client';

import * as React from 'react';

import {
  ExperienceCategoryTab,
  type ExperienceCategory,
} from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { cn } from '@/lib/utils';

export const experienceCategories: ExperienceCategory[] = [
  'all',
  'activity',
  'career',
  'education',
  'etc',
];

export interface ExperienceCategoryTabsProps extends React.ComponentProps<'div'> {
  selectedCategory: ExperienceCategory;
  onCategoryChange?: (category: ExperienceCategory) => void;
}

export function ExperienceCategoryTabs({
  selectedCategory,
  onCategoryChange,
  className,
  ...props
}: ExperienceCategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="경험 유형 필터"
      data-slot="experience-category-tabs"
      className={cn('flex items-center gap-3', className)}
      {...props}
    >
      {experienceCategories.map((category) => {
        const selected = selectedCategory === category;

        return (
          <ExperienceCategoryTab
            key={category}
            role="tab"
            aria-selected={selected}
            category={category}
            selected={selected}
            onClick={() => onCategoryChange?.(category)}
          />
        );
      })}
    </div>
  );
}
