'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ExperienceItem } from '@/app/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/experience/_components/ExperienceCategoryTab';
import { XIcon } from '@/components/common/icons/XIcon';
import { Tag } from '@/components/common/Tag';
import { DetailInput } from '@/components/common/DetailInput';
import { cn } from '@/lib/utils';

const categoryMap: Record<
  Exclude<ExperienceCategory, 'all'>,
  {
    label: string;
    icon: string;
  }
> = {
  activity: {
    label: '학내외활동',
    icon: '/activity-selected.svg',
  },
  career: {
    label: '인턴/직무경력',
    icon: '/career-selected.svg',
  },
  education: {
    label: '수강/교육',
    icon: '/education-selected.svg',
  },
  etc: {
    label: '기타',
    icon: '/etc-selected.svg',
  },
};

const detailFields = [
  ['Situation', 'situation'],
  ['Task', 'task'],
  ['Action', 'action'],
  ['Result', 'result'],
  ['Taken', 'taken'],
] as const;

export interface ExperienceDetailPanelProps extends Omit<
  React.ComponentProps<'aside'>,
  'children'
> {
  experience: ExperienceItem;
  onClose: () => void;
}

export function ExperienceDetailPanel({
  experience,
  onClose,
  className,
  ...props
}: ExperienceDetailPanelProps) {
  const category = categoryMap[experience.type];
  const [detail, setDetail] = React.useState(experience.detail);

  React.useEffect(() => {
    setDetail(experience.detail);
  }, [experience]);

  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleDetailChange =
    (key: keyof ExperienceItem['detail']): React.ChangeEventHandler<HTMLTextAreaElement> =>
    (event) => {
      setDetail((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  return (
    <aside
      data-slot="experience-detail-panel"
      className={cn(
        'fixed top-0 right-0 z-40 flex h-screen w-[500px] flex-col bg-background-w px-6 pt-8 shadow-2xl',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 border-b border-gray-300 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex min-w-0 flex-col gap-1">
              <h2 className="truncate heading-2-bold text-strong">{experience.title}</h2>
              <p className="truncate body-3-regular text-quaternary">{experience.description}</p>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex w-[83px] shrink-0 flex-col items-center gap-0.5">
                <Image src={category.icon} alt="" width={72} height={72} className="size-[72px]" />
                <span className="body-3-bold text-strong">{category.label}</span>
              </div>

              <dl className="flex flex-col gap-1.5 pt-2.5">
                {experience.detailInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <dt className="body-3-bold text-strong">{item.label}</dt>
                    <dd className="body-3-regular text-secondary">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <button
            type="button"
            aria-label="경험 상세 패널 닫기"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-tertiary"
            onClick={onClose}
          >
            <XIcon className="size-6" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {experience.skillTags.map((tag, index) => (
            <Tag key={`skill-${tag}-${index}`} tone="skill">
              {tag}
            </Tag>
          ))}
          {experience.competencyTags.map((tag, index) => (
            <Tag key={`competency-${tag}-${index}`} tone="competency">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto py-6">
        {detailFields.map(([label, key]) => (
          <div key={key} className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between px-2">
              <h3 className="body-2-bold text-[#1e2939]">{label}</h3>
            </div>
            <DetailInput value={detail[key]} onChange={handleDetailChange(key)} />
          </div>
        ))}
      </div>
    </aside>
  );
}
