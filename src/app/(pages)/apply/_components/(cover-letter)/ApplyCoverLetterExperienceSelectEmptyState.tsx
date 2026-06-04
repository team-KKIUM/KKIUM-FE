'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ApplyCoverLetterExperienceSelectEmptyStateProps {
  className?: string;
}

export function ApplyCoverLetterExperienceSelectEmptyState({
  className,
}: ApplyCoverLetterExperienceSelectEmptyStateProps) {
  const router = useRouter();

  return (
    <div
      data-slot="cover-letter-experience-select-empty"
      className={cn('flex flex-1 flex-col items-center justify-center gap-6', className)}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <Image
          src="/empty-state.svg"
          alt=""
          width={320}
          height={208}
          className="h-52 w-80 object-contain"
          loading="lazy"
          unoptimized
        />
        <p className="body-1-bold text-strong">아직 생성된 경험이 없어요</p>
        <p className="max-w-96 body-2-regular text-gray-700">경험을 추가해 파일을 끼워넣어볼까요?</p>
      </div>

      <Button
        type="button"
        variant="default"
        className="w-96 max-w-full"
        leftIcon={<PlusIcon className="text-on-fill" />}
        onClick={() => router.push('/experience/add')}
      >
        경험 추가하기
      </Button>
    </div>
  );
}
