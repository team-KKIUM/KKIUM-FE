import Image from 'next/image';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { MoreVerticalIcon } from '@/components/common/icons/MoreVerticalIcon';
import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';
import type { ExperienceCategory } from './ExperienceCategoryTab';

const experienceCardVariants = cva(
  'flex w-full cursor-pointer flex-col justify-between gap-2 overflow-hidden rounded-xl border border-border-default bg-background-w px-[18px] py-5 transition-shadow hover:shadow-lg focus-visible:shadow-focus-ring focus-visible:outline-none',
  {
    variants: {
      size: {
        small: 'max-w-[336px]',
        default: 'max-w-[494px]',
        large: 'max-w-[644px]',
      },
      selected: {
        true: 'shadow-[0_0_0_3px_var(--color-mint-main)]',
        false: '',
      },
    },
    defaultVariants: {
      size: 'small',
      selected: false,
    },
  },
);

const iconMap: Record<Exclude<ExperienceCategory, 'all'>, string> = {
  activity: '/activity-selected.svg',
  career: '/career-selected.svg',
  education: '/education-selected.svg',
  etc: '/etc-selected.svg',
};

export interface ExperienceCardProps
  extends
    Omit<React.ComponentProps<'article'>, 'title'>,
    VariantProps<typeof experienceCardVariants> {
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  period: string;
  skillTags: string[];
  competencyTags: string[];
}

export function ExperienceCard({
  type,
  title,
  period,
  skillTags,
  competencyTags,
  size,
  selected,
  className,
  ...props
}: ExperienceCardProps) {
  return (
    <article
      tabIndex={0}
      data-slot="experience-card"
      data-type={type}
      className={cn(experienceCardVariants({ size, selected, className }))}
      {...props}
    >
      <div className="flex w-full items-start justify-between">
        <Image src={iconMap[type]} alt="" width={72} height={72} className="size-[72px] shrink-0" />
        <button
          type="button"
          aria-label="경험 카드 메뉴"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-gray-main"
        >
          <MoreVerticalIcon className="size-6" />
        </button>
      </div>

      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex w-full flex-col items-start gap-1">
          <h2 className="w-full truncate title-1-bold text-gray-main">{title}</h2>
          <div className="flex items-center gap-[6px] label-3-regular text-gray-700">
            <span>기간</span>
            <span>{period}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1.5">
          <TagRow tags={skillTags} tone="skill" />
          <TagRow tags={competencyTags} tone="competency" />
        </div>
      </div>
    </article>
  );
}

function TagRow({
  tags,
  tone,
}: {
  tags: string[];
  tone: React.ComponentProps<typeof Tag>['tone'];
}) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {tags.map((tag) => (
        <Tag key={tag} tone={tone}>
          {tag}
        </Tag>
      ))}
    </div>
  );
}

export { experienceCardVariants };
