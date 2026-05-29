'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface NullBubbleProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = '아직 생성된 경험이 없어요';
const DEFAULT_DESCRIPTION = '경험을 추가해 파일을 끼워넣어볼까요?';

export function NullBubble({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
  ...props
}: NullBubbleProps) {
  return (
    <div
      data-slot="null-bubble"
      className={cn('relative h-52 w-full min-w-0 self-stretch', className)}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 flex h-[138px] items-center justify-center">
        <Image
          src="/null.svg"
          alt=""
          width={174}
          height={138}
          className="h-[138px] w-[174px] shrink-0 object-contain"
          unoptimized
        />
      </div>

      <div className="absolute -inset-x-2 bottom-0 flex flex-col items-center gap-1 text-center">
        <p className="whitespace-nowrap text-base font-bold leading-6 text-strong">{title}</p>
        <p className="whitespace-nowrap text-base font-normal leading-6 text-gray-700">{description}</p>
      </div>
    </div>
  );
}
