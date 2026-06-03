import Image from 'next/image';

import { DEFAULT_HOME_JOB_TYPE_PROFILE } from '@/app/_constants/jobTypeCardMappingData';
import { cn } from '@/lib/utils';

export interface JobTypeCardProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  roleTypeName?: string;
  roleTypeDescription?: string;
  strengths?: readonly string[];
}

const JOB_TYPE_BACKGROUND_IMAGE = '/TypeBackground.svg';

export function JobTypeCard({
  roleTypeName = DEFAULT_HOME_JOB_TYPE_PROFILE.roleTypeName,
  roleTypeDescription = DEFAULT_HOME_JOB_TYPE_PROFILE.description,
  strengths = DEFAULT_HOME_JOB_TYPE_PROFILE.coreKeywords.slice(0, 4),
  className,
  ...props
}: JobTypeCardProps) {
  const backgroundImage = JOB_TYPE_BACKGROUND_IMAGE;

  return (
    <section
      data-slot="job-type-card"
      className={cn('relative h-[336px] min-w-0 overflow-hidden rounded-xl border border-gray-300 bg-background-w', className)}
      {...props}
    >
      <Image src={backgroundImage} alt="" fill className="object-cover" sizes="384px" priority={false} />

      <div className="absolute left-5 top-[26px] inline-flex w-80 items-start justify-between">
        <h3 className="text-xl font-extrabold leading-7 text-gray-main">나의 직무 유형</h3>
        <div className="size-8" aria-hidden />
      </div>

      <div className="absolute left-[14px] top-[96px] bottom-[126px] inline-flex flex-col items-start justify-start gap-1">
        <p className="text-lg font-bold leading-7 text-gray-main">{roleTypeName}</p>
        <p className="w-44 break-keep text-base font-bold leading-6 text-gray-800">{roleTypeDescription}</p>
      </div>

      <div className="absolute inset-x-0 top-[238px] h-28 overflow-hidden bg-background-w px-5">
        <div className="absolute left-5 top-3 right-5 inline-flex flex-col items-start justify-start gap-1.5">
          <h4 className="text-lg font-bold leading-7 text-background-b">나의 역량 강점</h4>
          <div className="flex w-full flex-wrap items-center gap-1">
            {strengths.map((strength) => (
              <span
                key={strength}
                className="rounded bg-mint-50 px-2 py-0.5 text-xs font-bold leading-5 text-success"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
