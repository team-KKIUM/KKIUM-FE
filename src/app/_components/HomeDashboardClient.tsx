'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ExperienceUpdateCard } from '@/app/_components/ExperienceUpdateCard';
import { JobTypeCard } from '@/app/_components/JobTypeCard';
import { NullType } from '@/app/_components/NullType';
import {
  HOME_DASHBOARD_BOTTOM_GRID_CLASS,
  HOME_DASHBOARD_CONTENT_CLASS,
  HOME_DASHBOARD_SIDE_CARD_CLASS,
} from '@/app/_constants/homeLayoutConstants';
import { mapJobTypeNameToProfile } from '@/app/_constants/jobTypeCardMappingData';
import { useHomeDashboard } from '@/hooks/home/useHomeDashboard';
import { cn } from '@/lib/utils';

const TargetPostingSection = dynamic(
  () =>
    import('@/app/_components/ExperienceMatchSection').then((mod) => ({
      default: mod.TargetPostingSection,
    })),
  { loading: () => <div className="h-[280px] w-full min-w-0 animate-pulse rounded-xl bg-gray-100" /> },
);

const BubbleChart = dynamic(
  () => import('@/app/_components/BubbleChart').then((mod) => ({ default: mod.BubbleChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[336px] w-full min-w-0 animate-pulse rounded-xl bg-gray-100 xl:max-w-[384px]" />
    ),
  },
);

function formatTodayLabelKo(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(date);
  return `${month}월 ${day}일 ${weekday}`;
}

export interface HomeDashboardClientProps {
  /** Server-rendered LCP placeholder (passed as children for static HTML). */
  children: React.ReactNode;
}

export function HomeDashboardClient({ children }: HomeDashboardClientProps) {
  const router = useRouter();
  const { data: homeData, isPending } = useHomeDashboard(true);
  const [currentPostingIndex, setCurrentPostingIndex] = useState(0);
  const todayLabel = formatTodayLabelKo(new Date());
  const mappedJobType = mapJobTypeNameToProfile(homeData?.jobType?.typeName);
  const targetJds = homeData?.targetJds ?? [];
  const hasMatchData = targetJds.length > 0;
  const targetPostingCount = targetJds.length;
  const currentTargetJd = hasMatchData ? targetJds[currentPostingIndex] : null;

  const canGoPrev = hasMatchData && currentPostingIndex > 0;
  const canGoNext = hasMatchData && currentPostingIndex < targetPostingCount - 1;
  const targetJdId = currentTargetJd?.jdId ?? currentTargetJd?.id;
  const targetApplyHref =
    targetJdId == null ? '/apply/list' : `/apply?jdid=${encodeURIComponent(String(targetJdId))}`;
  const hasAnyExperience = (homeData?.totalExperienceCount ?? 0) > 0;

  const handlePrevPosting = () => {
    if (!canGoPrev) return;
    setCurrentPostingIndex((prev) => prev - 1);
  };

  const handleNextPosting = () => {
    if (!canGoNext) return;
    setCurrentPostingIndex((prev) => prev + 1);
  };

  const handleMoveToExperience = () => {
    router.push('/experience');
  };

  const jobTypeSlot = isPending ? (
    children
  ) : hasAnyExperience ? (
    <JobTypeCard
      className={HOME_DASHBOARD_SIDE_CARD_CLASS}
      roleTypeName={mappedJobType.roleTypeName}
      roleTypeDescription={mappedJobType.description}
      strengths={mappedJobType.coreKeywords.slice(0, 4)}
    />
  ) : (
    <NullType className={HOME_DASHBOARD_SIDE_CARD_CLASS} />
  );

  return (
    <section className="flex w-full min-w-0 flex-col items-stretch gap-6 pb-12">
      <div className={cn('flex flex-col items-stretch gap-2', HOME_DASHBOARD_CONTENT_CLASS)}>
        <div className="flex flex-col items-start gap-0.5">
          <p
            className="text-base font-bold leading-6 text-gray-900 tabular-nums"
            suppressHydrationWarning
          >
            {todayLabel}
          </p>
          <h1 className="text-3xl font-extrabold leading-[47.36px] text-strong">경험 한눈에 보기</h1>
        </div>
        <p className="text-base font-bold leading-6 text-gray-500">나의 경험을 한눈에 분석하고 관리하세요</p>
      </div>

      <TargetPostingSection
        hasMatchData={hasMatchData}
        currentPostingIndex={currentPostingIndex}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevPosting={handlePrevPosting}
        onNextPosting={handleNextPosting}
        targetJd={currentTargetJd}
        applyHref={targetApplyHref}
        onEmptyCtaClick={() => router.push('/apply/list')}
      />

      <div className={cn(HOME_DASHBOARD_BOTTOM_GRID_CLASS, HOME_DASHBOARD_CONTENT_CLASS)}>
        <ExperienceUpdateCard
          className={HOME_DASHBOARD_CONTENT_CLASS}
          totalCount={homeData?.totalExperienceCount}
          monthlyNewCount={homeData?.thisMonthExperienceCount}
          monthlyDiff={homeData?.lastMonthDiff}
          onTotalNavigate={handleMoveToExperience}
        />
        {jobTypeSlot}
        <BubbleChart
          className={HOME_DASHBOARD_SIDE_CARD_CLASS}
          experienceDistribution={homeData?.experienceDistribution}
          onAddClick={handleMoveToExperience}
        />
      </div>
    </section>
  );
}
