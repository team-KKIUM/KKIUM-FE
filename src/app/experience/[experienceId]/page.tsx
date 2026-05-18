import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ExperienceDetailPageContent } from '@/app/experience/[experienceId]/_components/ExperienceDetailPageContent';
import { experienceMockData } from '@/app/experience/_constants/experienceMockData';

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const experience = experienceMockData.find((item) => item.id === experienceId);

  if (!experience) {
    notFound();
  }

  return (
    <Suspense>
      <ExperienceDetailPageContent experience={experience} />
    </Suspense>
  );
}
