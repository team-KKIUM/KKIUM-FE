'use client';

import * as React from 'react';

import { ExperienceMatchGauge } from '@/app/_components/ExperienceMatchChart';
import { HOME_DASHBOARD_CONTENT_CLASS } from '@/app/_constants/homeLayoutConstants';
import { EXPERIENCE_MATCH_MOCK } from '@/app/_constants/experienceMatchMockData';
import { cn } from '@/lib/utils';

export interface ExperienceMatchProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  percent?: number;
  title?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  companyName?: string;
  recruitmentField?: string;
  recruitmentPeriod?: string;
  requiredSkills?: readonly string[];
  requiredCompetencies?: readonly string[];
}

const ARC_START_DEG = 210;
const ARC_SWEEP_DEG = 230;
const ARC_RADIUS = 132;
const ARC_CX = 160;
const ARC_CY = 176;

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function toPoint(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArcPath() {
  const start = toPoint(ARC_CX, ARC_CY, ARC_RADIUS, ARC_START_DEG);
  const end = toPoint(ARC_CX, ARC_CY, ARC_RADIUS, ARC_START_DEG - ARC_SWEEP_DEG);
  const largeArcFlag = ARC_SWEEP_DEG > 180 ? 1 : 0;
  const sweepFlag = 0; 

  return `M ${start.x} ${start.y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

function getKnobPoint(percent: number) {
  const angle = ARC_START_DEG - ARC_SWEEP_DEG * (percent / 100);
  return toPoint(ARC_CX, ARC_CY, ARC_RADIUS, angle);
}

function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function ExperienceMatch({
  percent = EXPERIENCE_MATCH_MOCK.percent,
  title = '내 경험과 적합도',
  ctaHref = '/apply',
  onCtaClick,
  companyName = EXPERIENCE_MATCH_MOCK.companyName,
  recruitmentField = EXPERIENCE_MATCH_MOCK.recruitmentField,
  recruitmentPeriod = EXPERIENCE_MATCH_MOCK.recruitmentPeriod,
  requiredSkills = EXPERIENCE_MATCH_MOCK.requiredSkills,
  requiredCompetencies = EXPERIENCE_MATCH_MOCK.requiredCompetencies,
  className,
  ...props
}: ExperienceMatchProps) {
  const safePercent = clampPercent(percent);
  const arcPath = React.useMemo(() => describeArcPath(), []);
  const knob = getKnobPoint(safePercent);
  const progressGradientCenter = getKnobPoint(50);
  const progressGradientRadius = Math.max(
    distanceBetween(progressGradientCenter, getKnobPoint(0)),
    distanceBetween(progressGradientCenter, getKnobPoint(100)),
  );

  return (
    <section
      data-slot="experience-match"
      className={cn(
        HOME_DASHBOARD_CONTENT_CLASS,
        'flex flex-col items-stretch gap-5 overflow-hidden rounded-xl border border-gray-300 bg-background-w p-3 xl:flex-row xl:flex-nowrap xl:items-stretch',
        className,
      )}
      {...props}
    >
      <ExperienceMatchGauge
        title={title}
        percent={safePercent}
        arcPath={arcPath}
        arcFlipTranslateY={ARC_CY * 2}
        knob={knob}
        progressGradientCenter={progressGradientCenter}
        progressGradientRadius={progressGradientRadius}
        ctaHref={ctaHref}
        onCtaClick={onCtaClick}
      />

      <div className="flex min-w-0 flex-1 flex-col items-stretch gap-4 self-stretch overflow-hidden rounded-xl bg-background-w">
        <div className="flex w-full min-w-0 flex-col items-stretch gap-5 rounded-lg border border-border-thick bg-background-w px-5 py-4">
          <div className="flex w-full min-w-0 flex-wrap items-start gap-x-12 gap-y-4">
            <div className="flex min-w-0 flex-1 basis-48 flex-col items-start gap-1">
              <span className="text-xs font-bold leading-5 text-secondary">기업</span>
              <span className="text-xl font-extrabold leading-7 text-strong">{companyName}</span>
            </div>
            <div className="flex min-w-0 flex-1 basis-48 flex-col items-start gap-1">
              <span className="text-xs font-bold leading-5 text-secondary">모집 분야</span>
              <span className="text-xl font-extrabold leading-7 text-strong">{recruitmentField}</span>
            </div>
            <div className="flex min-w-0 flex-1 basis-48 flex-col items-start gap-1">
              <span className="text-xs font-bold leading-5 text-secondary">모집 기간</span>
              <span className="text-xl font-extrabold leading-7 text-strong">{recruitmentPeriod}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col items-stretch gap-2.5 sm:flex-row sm:items-stretch">
          <div className="flex min-h-36 min-w-0 flex-1 basis-0 flex-col gap-10 rounded-lg border border-border-thick bg-background-w px-4 py-5 sm:min-h-[164px]">
            <h4 className="text-lg font-bold leading-7 text-strong">요구 기술</h4>
            <div className="flex flex-wrap items-start gap-1.5">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-blue-50 px-3 py-1 text-xs font-bold leading-5 text-blue-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-36 min-w-0 flex-1 basis-0 flex-col gap-10 rounded-lg border border-border-thick bg-background-w px-4 py-5 sm:min-h-[164px]">
            <h4 className="text-lg font-bold leading-7 text-strong">요구 역량</h4>
            <div className="flex flex-wrap items-start gap-1.5">
              {requiredCompetencies.map((competency) => (
                <span
                  key={competency}
                  className="rounded bg-mint-50 px-3 py-1 text-xs font-bold leading-5 text-success"
                >
                  {competency}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
