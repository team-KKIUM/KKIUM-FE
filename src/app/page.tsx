'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

import { BubbleChart } from '@/app/_components/BubbleChart';
import { ExperienceUpdateCard } from '@/app/_components/ExperienceUpdateCard';
import { JobTypeCard } from '@/app/_components/JobTypeCard';
import { MobileLandingPage } from '@/app/_components/MobileLandingPage';
import { NullType } from '@/app/_components/NullType';
import {
  HOME_DASHBOARD_BOTTOM_GRID_CLASS,
  HOME_DASHBOARD_CONTENT_CLASS,
  HOME_DASHBOARD_SIDE_CARD_CLASS,
} from '@/app/_constants/homeLayoutConstants';
import { mapJobTypeNameToProfile } from '@/app/_constants/jobTypeCardMappingData';
import { TargetPostingSection } from '@/app/_components/ExperienceMatchSection';
import { getAccessTokenFromSession } from '@/app/_utils/authFetch';
import { useHomeDashboard } from '@/hooks/home/useHomeDashboard';
import { cn } from '@/lib/utils';

const MOBILE_LANDING_MEDIA_QUERY = '(max-width: 767px)';

type HomeEntryMode = 'checking' | 'dashboard' | 'mobile-landing';

function getHomeEntryModeSnapshot(): HomeEntryMode {
  if (typeof window === 'undefined') {
    return 'checking';
  }

  if (getAccessTokenFromSession()) {
    return 'dashboard';
  }

  return window.matchMedia(MOBILE_LANDING_MEDIA_QUERY).matches ? 'mobile-landing' : 'dashboard';
}

function subscribeToHomeEntryModeChange(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(MOBILE_LANDING_MEDIA_QUERY);

  mediaQueryList.addEventListener('change', onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function formatTodayLabelKo(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(date);
  return `${month}월 ${day}일 ${weekday}`;
}

export default function Home() {
  const router = useRouter();
  const entryMode = useSyncExternalStore(
    subscribeToHomeEntryModeChange,
    getHomeEntryModeSnapshot,
    () => 'checking',
  );
  const isDashboard = entryMode === 'dashboard';
  const { data: homeData } = useHomeDashboard(isDashboard);
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

  if (entryMode === 'checking') {
    return null;
  }

  if (entryMode === 'mobile-landing') {
    return <MobileLandingPage />;
  }

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
        {hasAnyExperience ? (
          <JobTypeCard
            className={HOME_DASHBOARD_SIDE_CARD_CLASS}
            roleTypeName={mappedJobType.roleTypeName}
            roleTypeDescription={mappedJobType.description}
            strengths={mappedJobType.coreKeywords.slice(0, 4)}
          />
        ) : (
          <NullType className={HOME_DASHBOARD_SIDE_CARD_CLASS} />
        )}
        <BubbleChart
          className={HOME_DASHBOARD_SIDE_CARD_CLASS}
          experienceDistribution={homeData?.experienceDistribution}
          onAddClick={handleMoveToExperience}
        />
      </div>
    </section>
  );
}
