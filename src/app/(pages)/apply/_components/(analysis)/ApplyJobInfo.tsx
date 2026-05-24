import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { cn } from '@/lib/utils';

export interface ApplyJobInfoProps {
  postingTitle: string;
  companyName: string;
  jobField: string;
  period: string;
  className?: string;
}

function ApplyJobInfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <span className="body-1-regular text-secondary">{label}</span>
      <span className="title-2-bold text-strong">{value}</span>
    </div>
  );
}

export function ApplyJobInfo({
  postingTitle,
  companyName,
  jobField,
  period,
  className,
}: ApplyJobInfoProps) {
  return (
    <section className={cn('flex w-full flex-col gap-3', className)}>
      <div className="flex w-full flex-col gap-2">
        <ApplyJobInfoField label="공고명" value={postingTitle} />
        <ApplyJobInfoField label="기업명" value={companyName} />
        <ApplyJobInfoField label="모집분야" value={jobField} />
      </div>

      <div className="inline-flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          <CalendarIcon className="size-5 text-tertiary" />
          <span className="text-xs leading-5 font-normal text-tertiary">모집 기간</span>
        </div>
        <span className="text-xs leading-5 font-normal text-tertiary">{period}</span>
      </div>
    </section>
  );
}
