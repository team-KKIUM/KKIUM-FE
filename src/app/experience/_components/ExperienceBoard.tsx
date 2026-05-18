'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import {
  ExperienceCardGrid,
  type ExperienceItem,
} from '@/app/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/experience/_components/ExperienceCategoryTab';
import { ExperienceCategoryTabs } from '@/app/experience/_components/ExperienceCategoryTabs';
import { ExperienceDetailPanel } from '@/app/experience/_components/ExperienceDetailPanel';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';

export interface ExperienceBoardProps extends React.ComponentProps<'section'> {
  experiences: ExperienceItem[];
  initialSelectedExperienceId?: string;
}

type ExperienceOrderMap = Record<ExperienceCategory, string[]>;

const sortableCategories: ExperienceCategory[] = ['all', 'activity', 'career', 'education', 'etc'];

function isExperienceCategory(category: string | null): category is ExperienceCategory {
  return sortableCategories.includes(category as ExperienceCategory);
}

export function ExperienceBoard({
  experiences,
  initialSelectedExperienceId,
  className,
  ...props
}: ExperienceBoardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedExperienceIdFromQuery = searchParams.get('selected') ?? initialSelectedExperienceId;
  const selectedCategoryFromQuery = searchParams.get('category');
  const initialSelectedCategory = isExperienceCategory(selectedCategoryFromQuery)
    ? selectedCategoryFromQuery
    : 'all';
  const [selectedCategory, setSelectedCategory] =
    React.useState<ExperienceCategory>(initialSelectedCategory);
  const [selectedExperienceId, setSelectedExperienceId] = React.useState<string | undefined>(
    selectedExperienceIdFromQuery,
  );
  const [experienceOrderMap, setExperienceOrderMap] = React.useState(() =>
    createExperienceOrderMap(experiences),
  );
  const [panelOpen, setPanelOpen] = React.useState(Boolean(selectedExperienceIdFromQuery));
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setExperienceOrderMap((currentOrderMap) => {
      const nextOrderMap = syncExperienceOrderMap(currentOrderMap, experiences);

      if (areExperienceOrderMapsEqual(currentOrderMap, nextOrderMap)) {
        return currentOrderMap;
      }

      return nextOrderMap;
    });
  }, [experiences]);

  React.useEffect(() => {
    if (!selectedExperienceIdFromQuery) {
      return;
    }

    const initialSelectedExperience = experiences.find(
      (experience) => experience.id === selectedExperienceIdFromQuery,
    );

    if (!initialSelectedExperience) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedCategory(initialSelectedCategory);
    setSelectedExperienceId(initialSelectedExperience.id);
    setPanelOpen(true);
  }, [experiences, initialSelectedCategory, selectedExperienceIdFromQuery]);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const experienceMap = React.useMemo(
    () => new Map(experiences.map((experience) => [experience.id, experience])),
    [experiences],
  );

  const filteredExperiences = React.useMemo(
    () =>
      experienceOrderMap[selectedCategory]
        .map((id) => experienceMap.get(id))
        .filter((experience): experience is ExperienceItem => Boolean(experience)),
    [experienceMap, experienceOrderMap, selectedCategory],
  );

  const selectedExperience = filteredExperiences.find(
    (experience) => experience.id === selectedExperienceId,
  );

  const handleCategoryChange = (category: ExperienceCategory) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    router.replace('/experience', { scroll: false });
    setSelectedCategory(category);
    setSelectedExperienceId(undefined);
    setPanelOpen(false);
  };

  const handleExperienceSelect = (experience: ExperienceItem) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedExperienceId(experience.id);
    setPanelOpen(true);
    router.replace(`/experience?selected=${experience.id}&category=${selectedCategory}`, {
      scroll: false,
    });
  };

  const handleExperienceReorder = React.useCallback(
    (orderedExperienceIds: string[]) => {
      setExperienceOrderMap((currentOrderMap) => ({
        ...currentOrderMap,
        [selectedCategory]: orderedExperienceIds,
      }));
    },
    [selectedCategory],
  );

  const handlePanelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setPanelOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setSelectedExperienceId(undefined);
      closeTimerRef.current = null;
    }, 300);
    router.replace('/experience', { scroll: false });
  };

  const handlePanelExpand = () => {
    if (!selectedExperience) {
      return;
    }

    router.push(`/experience/${selectedExperience.id}?category=${selectedCategory}`);
  };

  return (
    <section
      data-slot="experience-board"
      className={cn('flex w-full flex-1 flex-col gap-5', className)}
      {...props}
    >
      <ExperienceCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      {filteredExperiences.length > 0 ? (
        <ExperienceCardGrid
          experiences={filteredExperiences}
          selectedExperienceId={selectedExperienceId}
          sortable
          onExperienceClick={handleExperienceSelect}
          onExperienceReorder={handleExperienceReorder}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="아직 생성된 경험이 없어요"
            description="경험을 추가해 파일에 끼워넣어볼까요?"
            illustrationLabel="등록된 경험이 없습니다"
          />
        </div>
      )}
      {selectedExperience && (
        <ExperienceDetailPanel
          experience={selectedExperience}
          open={panelOpen}
          onExpand={handlePanelExpand}
          onClose={handlePanelClose}
        />
      )}
    </section>
  );
}

function areStringArraysEqual(source: string[], target: string[]) {
  return source.length === target.length && source.every((item, index) => item === target[index]);
}

function createExperienceOrderMap(experiences: ExperienceItem[]): ExperienceOrderMap {
  return {
    all: experiences.map((experience) => experience.id),
    activity: getExperienceIdsByCategory(experiences, 'activity'),
    career: getExperienceIdsByCategory(experiences, 'career'),
    education: getExperienceIdsByCategory(experiences, 'education'),
    etc: getExperienceIdsByCategory(experiences, 'etc'),
  };
}

function syncExperienceOrderMap(
  currentOrderMap: ExperienceOrderMap,
  experiences: ExperienceItem[],
): ExperienceOrderMap {
  const defaultOrderMap = createExperienceOrderMap(experiences);

  return sortableCategories.reduce<ExperienceOrderMap>((nextOrderMap, category) => {
    const nextIds = defaultOrderMap[category];
    const nextIdSet = new Set(nextIds);
    const currentIds = currentOrderMap[category];
    const currentIdSet = new Set(currentIds);
    const preservedIds = currentIds.filter((id) => nextIdSet.has(id));
    const addedIds = nextIds.filter((id) => !currentIdSet.has(id));

    nextOrderMap[category] = [...preservedIds, ...addedIds];

    return nextOrderMap;
  }, {} as ExperienceOrderMap);
}

function getExperienceIdsByCategory(
  experiences: ExperienceItem[],
  category: Exclude<ExperienceCategory, 'all'>,
) {
  return experiences
    .filter((experience) => experience.type === category)
    .map((experience) => experience.id);
}

function areExperienceOrderMapsEqual(source: ExperienceOrderMap, target: ExperienceOrderMap) {
  return sortableCategories.every((category) =>
    areStringArraysEqual(source[category], target[category]),
  );
}
