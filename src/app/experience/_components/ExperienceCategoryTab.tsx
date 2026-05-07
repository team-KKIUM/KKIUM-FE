import Image from 'next/image';

import { cn } from '@/lib/utils';

export type ExperienceCategory = 'all' | 'activity' | 'career' | 'education' | 'etc';

export interface ExperienceCategoryTabProps extends React.ComponentProps<'button'> {
  category: ExperienceCategory;
  selected?: boolean;
}

const categoryItems: Record<
  ExperienceCategory,
  {
    label: string;
    icon?: {
      default: string;
      selected: string;
    };
  }
> = {
  all: {
    label: '전체',
  },
  activity: {
    label: '학내외활동',
    icon: {
      default: '/activity-default.svg',
      selected: '/activity-selected.svg',
    },
  },
  career: {
    label: '인턴/직무경력',
    icon: {
      default: '/career-default.svg',
      selected: '/career-selected.svg',
    },
  },
  education: {
    label: '수강/교육',
    icon: {
      default: '/education-default.svg',
      selected: '/education-selected.svg',
    },
  },
  etc: {
    label: '기타',
    icon: {
      default: '/etc-default.svg',
      selected: '/etc-selected.svg',
    },
  },
};

export function ExperienceCategoryTab({
  category,
  selected = false,
  className,
  ...props
}: ExperienceCategoryTabProps) {
  const item = categoryItems[category];

  return (
    <button
      type="button"
      data-slot="experience-category-tab"
      data-category={category}
      data-selected={selected}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-1 px-1.5 py-0.5 body-1-bold',
        selected ? 'text-strong' : 'text-quaternary',
        className,
      )}
      {...props}
    >
      {item.icon && (
        <Image
          src={selected ? item.icon.selected : item.icon.default}
          alt=""
          width={18}
          height={18}
          className="shrink-0"
        />
      )}
      <span>{item.label}</span>
    </button>
  );
}
