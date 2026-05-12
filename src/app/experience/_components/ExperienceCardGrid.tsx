import * as React from 'react';

import { ExperienceCard } from '@/app/experience/_components/ExperienceCard';
import type { ExperienceCategory } from '@/app/experience/_components/ExperienceCategoryTab';
import { cn } from '@/lib/utils';

export interface ExperienceItem {
  id: string;
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  description: string;
  period: string;
  detailInfo: {
    label: string;
    value: string;
  }[];
  skillTags: string[];
  competencyTags: string[];
  detail: {
    situation: string;
    task: string;
    action: string;
    result: string;
    taken: string;
  };
}

export interface ExperienceCardGridProps extends React.ComponentProps<'div'> {
  experiences: ExperienceItem[];
  selectedExperienceId?: string;
  onExperienceClick?: (experience: ExperienceItem) => void;
}

export function ExperienceCardGrid({
  experiences,
  selectedExperienceId,
  onExperienceClick,
  className,
  ...props
}: ExperienceCardGridProps) {
  return (
    <div
      data-slot="experience-card-grid"
      className={cn('grid w-full grid-cols-2 gap-x-4 gap-y-5 min-[1720px]:grid-cols-3', className)}
      {...props}
    >
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience.id}
          type={experience.type}
          title={experience.title}
          period={experience.period}
          skillTags={experience.skillTags}
          competencyTags={experience.competencyTags}
          selected={selectedExperienceId === experience.id}
          className="max-w-none"
          onClick={() => onExperienceClick?.(experience)}
        />
      ))}
    </div>
  );
}
