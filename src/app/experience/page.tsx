import { ExperiencePageHeader } from './_components/ExperiencePageHeader';

export default function ExperiencePage() {
  return (
    <div className="flex min-h-full flex-col">
      경험 관리 페이지
      <ExperiencePageHeader selectedCategory="all" />
    </div>
  );
}
