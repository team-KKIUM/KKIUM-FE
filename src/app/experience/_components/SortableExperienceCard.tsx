import { useSortable } from '@dnd-kit/react/sortable';

import { ExperienceCard } from '@/app/experience/_components/ExperienceCard';
import type { ExperienceItem } from '@/app/experience/_components/ExperienceCardGrid';
import { cn } from '@/lib/utils';

export interface SortableExperienceCardProps {
  experience: ExperienceItem;
  index: number;
  selected?: boolean;
  onClick?: (experience: ExperienceItem) => void;
}

export function SortableExperienceCard({
  experience,
  index,
  selected = false,
  onClick,
}: SortableExperienceCardProps) {
  const { ref, isDragSource, isDragging } = useSortable({
    id: experience.id,
    index,
    type: 'experience-card',
    accept: 'experience-card',
  });

  return (
    <ExperienceCard
      ref={ref}
      data-dragging={isDragging || undefined}
      type={experience.type}
      title={experience.title}
      period={experience.period}
      skillTags={experience.skillTags}
      competencyTags={experience.competencyTags}
      selected={selected}
      disableActivationKeys
      className={cn('max-w-none', isDragSource && 'relative z-10 opacity-90')}
      onClick={() => onClick?.(experience)}
    />
  );
}
