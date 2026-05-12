'use client';

import * as React from 'react';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export type ExperiencePageHeaderProps = React.ComponentProps<'header'>;

export function ExperiencePageHeader({ className, ...props }: ExperiencePageHeaderProps) {
  const router = useRouter();

  return (
    <header
      data-slot="experience-page-header"
      className={cn('flex w-full items-start justify-between', className)}
      {...props}
    >
      <h1 className="text-2xl font-extrabold text-[#000]">경험 관리</h1>

      <Button onClick={() => router.push('/experience/add')} leftIcon={<PlusIcon />}>
        경험 추가
      </Button>
    </header>
  );
}
