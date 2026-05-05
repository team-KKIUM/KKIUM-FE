import { ExperienceBoard } from '@/app/experience/_components/ExperienceBoard';
import { ExperiencePageHeader } from '@/app/experience/_components/ExperiencePageHeader';
import { experienceMockData } from '@/app/experience/_constants/experienceMockData';

export default function ExperiencePage() {
  return (
    <div className="mx-16 flex flex-col gap-5">
      <ExperiencePageHeader />
      <ExperienceBoard experiences={experienceMockData} />
    </div>
  );
}
