import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface ApplyCoverLetterExperienceEmptyStateProps {
  className?: string;
}

export function ApplyCoverLetterExperienceEmptyState({
  className,
}: ApplyCoverLetterExperienceEmptyStateProps) {
  return (
    <div
      data-slot="cover-letter-experience-empty"
      className={cn('flex w-full max-w-[478px] flex-col items-center', className)}
    >
      <div className="flex h-56 w-full items-center justify-center">
        <Image
          src="/null.svg"
          alt=""
          width={174}
          height={138}
          className="h-auto w-auto max-w-[min(100%,174px)] object-contain"
          loading="lazy"
          unoptimized
        />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="body-1-bold text-strong">선택된 경험이 여기에 표시됩니다</p>
        <p className="body-2-regular text-gray-700">
          위에 경험 선택하기를 클릭하여 내 경험들을 추가하세요.
          <br />
          추가된 경험들을 분석하여 작성 가이드를 적어드릴께요.
        </p>
      </div>
    </div>
  );
}
