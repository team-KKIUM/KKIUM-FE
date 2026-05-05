import * as React from 'react';

import { SearchBar } from '@/components/common/SearchBar';
import { cn } from '@/lib/utils';

export type ExperienceTopBarProps = React.ComponentProps<'div'>;

export function ExperienceTopBar({ className, ...props }: ExperienceTopBarProps) {
  return (
    <div
      data-slot="experience-top-bar"
      className={cn('flex w-full items-center justify-between', className)}
      {...props}
    >
      <SearchBar
        className="w-full max-w-[551px]"
        placeholder="경험 제목, 기술 태그, 역량 태그를 검색해주세요"
      />
      <button
        type="button"
        aria-label="프로필 열기"
        className="size-[44.5px] cursor-pointer overflow-hidden rounded-md border border-border-default bg-background-w"
      />
    </div>
  );
}
