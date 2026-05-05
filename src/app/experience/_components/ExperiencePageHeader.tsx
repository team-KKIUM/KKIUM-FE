import * as React from 'react';

import { ExperienceCategoryTabs } from '@/app/experience/_components/ExperienceCategoryTabs';
import type { ExperienceCategory } from '@/app/experience/_components/ExperienceCategoryTab';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ExperiencePageHeaderProps extends React.ComponentProps<'header'> {
  selectedCategory: ExperienceCategory;
  onCategoryChange?: (category: ExperienceCategory) => void;
  onAddExperience?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ExperiencePageHeader({
  selectedCategory,
  onCategoryChange,
  onAddExperience,
  className,
  ...props
}: ExperiencePageHeaderProps) {
  return (
    <header
      data-slot="experience-page-header"
      className={cn('flex w-full items-start justify-between', className)}
      {...props}
    >
      <div className="flex flex-col items-start gap-5">
        <h1 className="text-2xl font-extrabold text-[#000]">경험 관리</h1>
        <ExperienceCategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      <Button type="button" leftIcon={<PlusIcon />} onClick={onAddExperience}>
        경험 추가
      </Button>
    </header>
  );
}
