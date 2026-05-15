import Image from 'next/image';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';
import { ExperienceCardDropdownMenu } from './ExperienceCardDropdownMenu';
import type { ExperienceCategory } from './ExperienceCategoryTab';

const experienceCardVariants = cva(
  'flex w-full flex-col justify-between gap-2 overflow-hidden rounded-xl border border-border-default bg-background-w px-[18px] py-5 transition-shadow focus-visible:shadow-focus-ring focus-visible:outline-none',
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
      interactive: {
        true: 'cursor-pointer hover:shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      size: 'small',
      selected: false,
      interactive: false,
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
    Omit<VariantProps<typeof experienceCardVariants>, 'interactive'> {
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  period: string;
  skillTags: string[];
  competencyTags: string[];
  disableActivationKeys?: boolean;
}

export const ExperienceCard = React.forwardRef<HTMLElement, ExperienceCardProps>(
  function ExperienceCard(
    {
      type,
      title,
      period,
      skillTags,
      competencyTags,
      size,
      selected,
      className,
      onClick,
      onKeyDown,
      disableActivationKeys = false,
      ...props
    },
    ref,
  ) {
    const isInteractive = Boolean(onClick);

    const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
      onKeyDown?.(event);

      if (event.defaultPrevented || event.target !== event.currentTarget || !onClick) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (disableActivationKeys) {
          return;
        }

        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    return (
      <article
        ref={ref}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        data-slot="experience-card"
        data-type={type}
        className={cn(
          experienceCardVariants({ size, selected, interactive: isInteractive, className }),
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className="flex w-full items-start justify-between">
          <Image
            src={iconMap[type]}
            alt=""
            width={72}
            height={72}
            className="size-[72px] shrink-0"
          />
          <ExperienceCardDropdownMenu triggerClassName="shrink-0" />
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
  },
);

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
      {tags.map((tag, index) => (
        <Tag key={`${tag}-${index}`} tone={tone}>
          {tag}
        </Tag>
      ))}
    </div>
  );
}

export { experienceCardVariants };
