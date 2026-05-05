import * as React from 'react';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ExperiencePageHeaderProps extends React.ComponentProps<'header'> {
  onAddExperience?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ExperiencePageHeader({
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
      <h1 className="text-2xl font-extrabold text-[#000]">경험 관리</h1>

      <Button type="button" leftIcon={<PlusIcon />} onClick={onAddExperience}>
        경험 추가
      </Button>
    </header>
  );
}
