import type * as React from 'react';

import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';

export const EXPERIENCE_CARD_GRID_CLASS_NAME =
  'grid w-full grid-cols-2 gap-x-4 gap-y-5 min-[1720px]:grid-cols-3';

export interface ExperienceItem {
  id: string;
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  period: string;
  detailInfo: {
    label: string;
    value: string;
  }[];
  basicDetail: {
    name?: string;
    teamNum?: string;
    role?: string;
    contributionRate?: string;
    company?: string;
    employmentStatus?: string;
    organizationName?: string;
  };
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
  onExperienceDelete?: (experience: ExperienceItem) => Promise<void> | void;
  onExperienceReorder?: (experienceIds: string[]) => void;
  onExperienceTitleSave?: (experience: ExperienceItem, nextTitle: string) => Promise<void> | void;
}

export type ExperienceSortableCardGridProps = Omit<ExperienceCardGridProps, 'sortable'> & {
  onReady?: () => void;
};
