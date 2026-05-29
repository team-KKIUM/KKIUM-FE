'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import * as React from 'react';

import type { HomeDashboardResponse } from '@/app/api/home/types';
import type { BubbleChartItem } from '@/app/_constants/bubbleChartMockData';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { NullBubble } from './NullBubble';

export interface BubbleChartProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  onAddClick?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  experienceDistribution?: HomeDashboardResponse['experienceDistribution'];
}

const BUBBLE_POSITIONS = [
  { x: 103, y: 84 },
  { x: 206, y: 162 },
  { x: 34, y: 172 },
  { x: 224, y: 67 },
] as const;

const EXPERIENCE_TYPE_LABELS: Readonly<Record<string, string>> = {
  ACTIVITY: '학내외활동',
  CAREER: '인턴',
  EDUCATION: '수강/교육',
  ETC: '기타',
};

function toBubbleLabel(type: string) {
  return EXPERIENCE_TYPE_LABELS[type] ?? type;
}

function toBubbleData(
  experienceDistribution: HomeDashboardResponse['experienceDistribution'] | undefined,
): BubbleChartItem[] {
  const filtered = (experienceDistribution ?? []).filter((item) => item.type !== 'ALL');
  if (filtered.length === 0) return [];
  if (filtered.length === 1) {
    const only = filtered[0];
    const clampedPercent = Math.max(0, Math.min(100, Math.round(only.percentage)));
    const size = Math.round(56 + clampedPercent * 1.15);

    return [
      {
        label: toBubbleLabel(only.type),
        percent: clampedPercent,
        x: 144,
        y: 112,
        size,
        tone: 'gray300',
      },
    ];
  }

  return filtered
    .slice(0, BUBBLE_POSITIONS.length)
    .sort((a, b) => b.percentage - a.percentage)
    .map((item, index) => {
      const { x, y } = BUBBLE_POSITIONS[index];
      const clampedPercent = Math.max(0, Math.min(100, Math.round(item.percentage)));
      const size = Math.round(56 + clampedPercent * 1.15);

      return {
        label: toBubbleLabel(item.type),
        percent: clampedPercent,
        x,
        y,
        size,
        tone: 'gray300',
      };
    });
}

export function BubbleChart({
  title = '나의 경험 분포',
  onAddClick,
  emptyTitle = '아직 생성된 경험이 없어요',
  emptyDescription = '경험을 추가해 파일을 끼워넣어볼까요?',
  experienceDistribution,
  className,
  ...props
}: BubbleChartProps) {
  const bubbleData = React.useMemo(
    () => toBubbleData(experienceDistribution),
    [experienceDistribution],
  );

  const option = React.useMemo<EChartsOption>(() => {
    const sizeRankMap = new Map<number, number>();
    [...bubbleData]
      .sort((a, b) => b.size - a.size)
      .forEach((item, index) => {
        if (!sizeRankMap.has(item.size)) {
          sizeRankMap.set(item.size, index);
        }
      });

    const bubbleColors = ['#00D2BA', '#757575', '#E0E0E0', '#EEEEEE'];

    return {
      animation: false,
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
      xAxis: { type: 'value', min: 0, max: 288, show: false },
      yAxis: { type: 'value', min: 0, max: 224, inverse: true, show: false },
      series: [
        {
          type: 'scatter',
          cursor: 'default',
          data: bubbleData.map((item) => {
            const rank = sizeRankMap.get(item.size) ?? bubbleColors.length - 1;
            const bubbleColor = bubbleColors[Math.min(rank, bubbleColors.length - 1)];
            const isDark = rank <= 1;
            return {
              value: [item.x, item.y],
              symbolSize: item.size,
              percent: item.percent,
              bubbleLabel: item.label,
              tone: item.tone,
              itemStyle: {
                color: bubbleColor,
              },
              textColor: isDark ? '#FFFFFF' : '#212121',
            } as unknown as Record<string, unknown>;
          }),
          label: {
            show: true,
            position: 'inside',
            formatter: (params) => {
              const data = params.data as { percent: number; bubbleLabel: string; textColor: '#FFFFFF' | '#212121' };
              const tone = data.textColor === '#FFFFFF' ? 'on' : 'strong';
              return `{${tone}Num|${data.percent}}{${tone}Pct|%}\n{${tone}Name|${data.bubbleLabel}}`;
            },
            rich: {
              onNum: { color: '#FFFFFF', fontSize: 28, fontWeight: 800, lineHeight: 36 },
              onPct: { color: '#FFFFFF', fontSize: 18, fontWeight: 800, lineHeight: 26 },
              onName: { color: '#FFFFFF', fontSize: 12, fontWeight: 700, lineHeight: 18 },
              strongNum: { color: '#212121', fontSize: 20, fontWeight: 700, lineHeight: 30 },
              strongPct: { color: '#212121', fontSize: 14, fontWeight: 700, lineHeight: 22 },
              strongName: { color: '#212121', fontSize: 10, fontWeight: 700, lineHeight: 16 },
            },
          },
          emphasis: { disabled: true },
        },
      ],
    };
  }, [bubbleData]);

  return (
    <section
      data-slot="bubble-chart"
      className={cn(
        'flex h-[336px] min-w-0 w-full flex-col items-stretch justify-between overflow-hidden rounded-xl border border-gray-300 bg-white px-4 py-5',
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-between">
        <h3 className="text-xl font-extrabold leading-7 text-black">{title}</h3>
        <div className="size-8" aria-hidden />
      </div>

      {bubbleData.length > 0 ? (
        <div className="h-56 w-full max-w-72">
          <ReactECharts option={option} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
      ) : (
        <NullBubble title={emptyTitle} description={emptyDescription} />
      )}

      <Button type="button" variant="line" size="default" onClick={onAddClick} leftIcon={<PlusIcon className="text-tertiary" />} className="w-full">
        경험 추가하기
      </Button>
    </section>
  );
}
