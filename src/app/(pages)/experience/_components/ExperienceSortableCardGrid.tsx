'use client';

import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import * as React from 'react';

import {
  EXPERIENCE_CARD_GRID_CLASS_NAME,
  type ExperienceSortableCardGridProps,
} from '@/app/(pages)/experience/_components/experienceCardGridTypes';
import { SortableExperienceCard } from '@/app/(pages)/experience/_components/SortableExperienceCard';
import { cn } from '@/lib/utils';

export default function ExperienceSortableCardGrid({
  experiences,
  selectedExperienceId,
  onExperienceClick,
  onExperienceDelete,
  onExperienceReorder,
  onExperienceTitleSave,
  onReady,
  className,
  ...props
}: ExperienceSortableCardGridProps) {
  React.useEffect(() => {
    onReady?.();
  }, [onReady]);

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

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div
        data-slot="experience-card-grid"
        className={cn(EXPERIENCE_CARD_GRID_CLASS_NAME, className)}
        {...props}
      >
        {experiences.map((experience, index) => (
          <SortableExperienceCard
            key={experience.id}
            experience={experience}
            index={index}
            selected={selectedExperienceId === experience.id}
            onClick={onExperienceClick}
            onDelete={onExperienceDelete}
            onTitleSave={onExperienceTitleSave}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
