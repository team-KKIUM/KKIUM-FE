import type { ComponentProps, ReactNode } from 'react';

import type { ExperienceAnalysisData } from '@/app/(pages)/apply/_constants/applyMockData';
import { BadIcon } from '@/components/common/icons/BadIcon';
import { GoodIcon } from '@/components/common/icons/GoodIcon';
import { cn } from '@/lib/utils';

export type { ExperienceAnalysisData };

export interface ExperienceAnalysisPanelProps extends Omit<ComponentProps<'section'>, 'children'> {
  analysis: ExperienceAnalysisData;
}

function AnalysisPoint({
  icon,
  label,
  description,
}: {
  icon: ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="inline-flex items-center gap-2">
        {icon}
        <span className="body-1-bold text-strong">{label}</span>
      </div>
      <p className="body-3-regular text-gray-700">{description}</p>
    </div>
  );
}

export function ExperienceAnalysisPanel({
  analysis,
  className,
  ...sectionProps
}: ExperienceAnalysisPanelProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col gap-4 rounded-b-xl border-t border-border-default bg-background-w px-4 py-5',
        className,
      )}
      {...sectionProps}
    >
      <h4 className="title-2-bold text-gray-900">경험 분석</h4>

      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <AnalysisPoint
            icon={<GoodIcon className="size-4 text-success" />}
            label="좋은 점"
            description={analysis.goodPoints}
          />
          <AnalysisPoint
            icon={<BadIcon className="size-4 text-red-300" />}
            label="부족한 점"
            description={analysis.badPoints}
          />
        </div>

        <hr className="h-px w-full border-0 bg-border-bold" />

        <div className="flex w-full flex-col gap-2">
          <span className="body-1-bold text-strong">활용 가이드</span>
          <p className="body-3-regular text-gray-700">{analysis.usageGuide}</p>
        </div>
      </div>
    </section>
  );
}
