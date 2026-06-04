import dynamic from 'next/dynamic';
import * as React from 'react';

import { ExperienceCard } from '@/app/(pages)/experience/_components/ExperienceCard';
import {
  EXPERIENCE_CARD_GRID_CLASS_NAME,
  type ExperienceCardGridProps,
  type ExperienceSortableCardGridProps,
} from '@/app/(pages)/experience/_components/experienceCardGridTypes';
import { cn } from '@/lib/utils';

export type { ExperienceCardGridProps, ExperienceItem } from './experienceCardGridTypes';

const ExperienceSortableCardGrid = dynamic<ExperienceSortableCardGridProps>(
  () => import('@/app/(pages)/experience/_components/ExperienceSortableCardGrid'),
  { ssr: false },
);

export function ExperienceCardGrid({
  experiences,
  selectedExperienceId,
  sortable = false,
  onExperienceClick,
  onExperienceDelete,
  onExperienceReorder,
  onExperienceTitleSave,
  className,
  ...props
}: ExperienceCardGridProps) {
  const [sortableGridReady, setSortableGridReady] = React.useState(false);

  React.useEffect(() => {
    if (!sortable) {
      setSortableGridReady(false);
    }
  }, [sortable]);

  const handleSortableGridReady = React.useCallback(() => {
    setSortableGridReady(true);
  }, []);

  const renderGrid = (gridProps?: React.ComponentProps<'div'>) => (
    <div
      data-slot="experience-card-grid"
      className={cn(EXPERIENCE_CARD_GRID_CLASS_NAME, className)}
      {...gridProps}
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
          onDelete={() => onExperienceDelete?.(experience)}
          onTitleSave={(nextTitle) => onExperienceTitleSave?.(experience, nextTitle)}
        />
      ))}
    </div>
  );

  const grid = renderGrid(props);
  const fallbackGrid = renderGrid();

  if (!sortable) {
    return grid;
  }

  return (
    <>
      {!sortableGridReady && fallbackGrid}
      <ExperienceSortableCardGrid
        experiences={experiences}
        selectedExperienceId={selectedExperienceId}
        onExperienceClick={onExperienceClick}
        onExperienceDelete={onExperienceDelete}
        onExperienceReorder={onExperienceReorder}
        onExperienceTitleSave={onExperienceTitleSave}
        onReady={handleSortableGridReady}
        className={cn(className, !sortableGridReady && 'hidden')}
        {...props}
      />
    </>
  );
}
