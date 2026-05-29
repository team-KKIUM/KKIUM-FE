'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { ExperienceMatchGaugeInfo } from '@/app/_components/ExperienceMatchGaugeInfo';
import { cn } from '@/lib/utils';

type Point = { x: number; y: number };

export interface ExperienceMatchGaugeProps {
  title: string;
  percent: number;
  arcPath: string;
  arcFlipTranslateY: number;
  knob: Point;
  progressGradientCenter: Point;
  progressGradientRadius: number;
  ctaHref: string;
  onCtaClick?: () => void;
}

export function ExperienceMatchGauge({
  title,
  percent,
  arcPath,
  arcFlipTranslateY,
  knob,
  progressGradientCenter,
  progressGradientRadius,
  ctaHref,
  onCtaClick,
}: ExperienceMatchGaugeProps) {
  const progressGradientId = React.useId().replace(/:/g, '');

  return (
    <div className="flex w-full max-w-96 shrink-0 flex-col items-stretch gap-0 self-stretch overflow-hidden rounded-base bg-mint-50 p-5 xl:w-96 xl:min-w-96">
      <div className="relative mx-auto h-[360px] w-full max-w-80 overflow-hidden">
        <div className="absolute inset-x-0 top-0 flex items-center justify-between">
          <h3 className="text-xl font-bold leading-8 text-strong">{title}</h3>
          <ExperienceMatchGaugeInfo />
        </div>

        <svg
          viewBox="0 0 320 300"
          className="pointer-events-none absolute top-[6px] left-1/2 h-[300px] w-80 -translate-x-1/2"
          aria-hidden
        >
          <defs>
            <radialGradient
              id={progressGradientId}
              cx={progressGradientCenter.x}
              cy={progressGradientCenter.y}
              r={progressGradientRadius}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00b998" />
              <stop offset="40%" stopColor="#00c6a9" />
              <stop offset="72%" stopColor="#00d2ba" />
              <stop offset="100%" stopColor="#72e0ce" />
            </radialGradient>
          </defs>
          <g transform={`translate(0 ${arcFlipTranslateY}) scale(1 -1)`}>
            <path
              d={arcPath}
              pathLength={100}
              className="stroke-gray-300"
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={arcPath}
              pathLength={100}
              stroke={`url(#${progressGradientId})`}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${percent} 100`}
            />
            <circle cx={knob.x} cy={knob.y} r={16} fill="var(--color-mint-400)" />
            <circle cx={knob.x} cy={knob.y} r={10} fill="var(--color-white)" />
          </g>
        </svg>

        <div className="absolute left-1/2 top-[69px] flex -translate-x-1/2 items-end gap-1">
          <span className="text-5xl font-extrabold leading-[64.75px] text-gray-900">{percent}</span>
          <span className="pb-3 text-base font-bold leading-6 text-gray-900">%</span>
        </div>

        <Image
          src="/character.svg"
          alt=""
          width={160}
          height={160}
          className="pointer-events-none absolute bottom-18 left-1/2 h-auto w-[168px] -translate-x-1/2 object-contain"
          unoptimized
        />
      </div>

      <Link
        href={ctaHref}
        onClick={onCtaClick}
        className={cn(
          'relative z-20 -mt-15 inline-flex h-10 w-full items-center justify-center gap-1 overflow-hidden rounded-lg border border-border-default bg-background-w px-3 py-1',
          'body-1-bold text-tertiary outline-none transition-colors',
          'hover:bg-gray-50 focus-visible:shadow-focus-ring',
        )}
      >
        공고 확인하러 가기
      </Link>
    </div>
  );
}
