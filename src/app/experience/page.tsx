import { Suspense } from 'react';

import { ExperienceBoard } from '@/app/experience/_components/ExperienceBoard';
import { ExperiencePageHeader } from '@/app/experience/_components/ExperiencePageHeader';

export default function ExperiencePage() {
  return (
    <div className="mx-16 flex min-h-[calc(100vh-32px)] flex-col">
      <div className="flex flex-1 flex-col gap-5">
        <ExperiencePageHeader />
        <Suspense>
          <ExperienceBoard />
        </Suspense>
      </div>
    </div>
  );
}
