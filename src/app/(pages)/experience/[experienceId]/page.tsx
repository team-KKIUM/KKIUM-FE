import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ExperienceDetailPageContent } from '@/app/(pages)/experience/[experienceId]/_components/ExperienceDetailPageContent';

export function generateStaticParams() {
  // S3 동적 라우트 대응 
  return Array.from({ length: 20 }, (_, index) => ({
    experienceId: String(index + 1),
  }));
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const numericExperienceId = Number(experienceId);

  if (!Number.isInteger(numericExperienceId) || numericExperienceId <= 0) {
    notFound();
  }

  return (
    <Suspense>
      <ExperienceDetailPageContent experienceId={numericExperienceId} />
    </Suspense>
  );
}
