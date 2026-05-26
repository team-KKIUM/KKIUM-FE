'use client';

import { useState } from 'react';

import { applyMyExperienceMockData } from '../../_constants/applyMockData';
import { ApplySectionHeader } from './ApplySectionHeader';
import { ExperienceMatchCard } from './ExperienceMatchCard';

export function ApplyMyExperience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <aside className="flex h-full w-full min-w-0 flex-col gap-5">
      <ApplySectionHeader title="내 경험" infoVariant="my-experience" />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {applyMyExperienceMockData.map((experience) => {
          const expanded = expandedId === experience.id;

          return (
            <ExperienceMatchCard
              key={experience.id}
              type={experience.type}
              title={experience.title}
              description={experience.description}
              skillTags={experience.skillTags}
              competencyTags={experience.competencyTags}
              matchScore={experience.matchScore}
              analysis={experience.analysis}
              expanded={expanded}
              onToggle={() => setExpandedId(expanded ? null : experience.id)}
            />
          );
        })}
      </div>
    </aside>
  );
}
