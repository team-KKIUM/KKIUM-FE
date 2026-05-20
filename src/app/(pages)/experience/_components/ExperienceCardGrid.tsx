import * as React from 'react';
import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

import { ExperienceCard } from '@/app/(pages)/experience/_components/ExperienceCard';
import { SortableExperienceCard } from '@/app/(pages)/experience/_components/SortableExperienceCard';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
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
  sortable?: boolean;
  onExperienceClick?: (experience: ExperienceItem) => void;
  onExperienceReorder?: (experienceIds: string[]) => void;
}

export function ExperienceCardGrid({
  experiences,
  selectedExperienceId,
  sortable = false,
  onExperienceClick,
  onExperienceReorder,
  className,
  ...props
}: ExperienceCardGridProps) {
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) {
        return;
      }

      const { source } = event.operation;

      if (!isSortable(source)) {
        return;
      }

      const { initialIndex, index } = source;

      if (initialIndex === index) {
        return;
      }

      const nextExperiences = arrayMove(experiences, initialIndex, index);

      onExperienceReorder?.(nextExperiences.map((experience) => experience.id));
    },
    [experiences, onExperienceReorder],
  );

  const grid = (
    <div
      data-slot="experience-card-grid"
      className={cn('grid w-full grid-cols-2 gap-x-4 gap-y-5 min-[1720px]:grid-cols-3', className)}
      {...props}
    >
      {experiences.map((experience, index) =>
        sortable ? (
          <SortableExperienceCard
            key={experience.id}
            experience={experience}
            index={index}
            selected={selectedExperienceId === experience.id}
            onClick={onExperienceClick}
          />
        ) : (
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
        ),
      )}
    </div>
  );

  if (!sortable) {
    return grid;
  }

  return <DragDropProvider onDragEnd={handleDragEnd}>{grid}</DragDropProvider>;
}
