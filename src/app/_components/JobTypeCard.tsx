import Image from 'next/image';

import { JOB_TYPE_CARD_MOCK } from '@/app/_constants/jobTypeCardMockData';
import { cn } from '@/lib/utils';

export interface JobTypeCardProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  roleTypeName?: string;
  roleTypeDescription?: string;
  strengths?: readonly string[];
  backgroundColor?: 'red' | 'yellow' | 'blue' | 'green';
}

const BACKGROUND_IMAGE_BY_COLOR: Record<NonNullable<JobTypeCardProps['backgroundColor']>, string> = {
  red: '/TypeBackgroud/TypeBackgroundRed.svg',
  yellow: '/TypeBackgroud/TypeBackgroundYellow.svg',
  blue: '/TypeBackgroud/TypeBackgroundBlue.svg',
  green: '/TypeBackgroud/TypeBackgroundGreen.svg',
};

export function JobTypeCard({
  roleTypeName = JOB_TYPE_CARD_MOCK.roleTypeName,
  roleTypeDescription = JOB_TYPE_CARD_MOCK.roleTypeDescription,
  strengths = JOB_TYPE_CARD_MOCK.strengths,
  backgroundColor = JOB_TYPE_CARD_MOCK.backgroundColor,
  className,
  ...props
}: JobTypeCardProps) {
  const backgroundImage = BACKGROUND_IMAGE_BY_COLOR[backgroundColor];

  return (
    <section
      data-slot="job-type-card"
      className={cn('relative h-[336px] w-96 overflow-hidden rounded-xl border border-gray-300 bg-background-w', className)}
      {...props}
    >
      <Image src={backgroundImage} alt="" fill className="object-cover" sizes="384px" priority={false} />

      <div className="absolute left-5 top-[26px] inline-flex w-80 items-start justify-between">
        <h3 className="text-xl font-extrabold leading-7 text-gray-main">나의 직무 유형</h3>
        <div className="size-8" aria-hidden />
      </div>

      <div className="absolute left-[14px] top-[103px] inline-flex flex-col items-start justify-start gap-1">
        <p className="text-lg font-bold leading-7 text-gray-main">{roleTypeName}</p>
        <p className="w-44 break-keep text-base font-bold leading-6 text-gray-800">{roleTypeDescription}</p>
      </div>

      <div className="absolute left-0 top-[238px] h-28 w-96 overflow-hidden bg-background-w">
        <div className="absolute left-5 top-3 inline-flex w-80 flex-col items-start justify-start gap-1.5">
          <h4 className="text-lg font-bold leading-7 text-background-b">나의 역량 강점</h4>
          <div className="inline-flex flex-wrap items-start gap-1">
            {strengths.map((strength) => (
              <span key={strength} className="rounded bg-mint-50 px-3 py-1 text-base font-bold leading-6 text-success">
                {strength}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
