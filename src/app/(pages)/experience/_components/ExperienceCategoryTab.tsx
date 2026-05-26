import Image from 'next/image';

import {
  EXPERIENCE_CATEGORY_ITEMS,
  type ExperienceCategory,
} from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { cn } from '@/lib/utils';

export type { ExperienceCategory } from '@/app/(pages)/experience/_utils/ExperienceCategory';

export interface ExperienceCategoryTabProps extends React.ComponentProps<'button'> {
  category: ExperienceCategory;
  selected?: boolean;
}

export function ExperienceCategoryTab({
  category,
  selected = false,
  className,
  ...props
}: ExperienceCategoryTabProps) {
  const item = EXPERIENCE_CATEGORY_ITEMS[category];
  const hasIcon = 'defaultIconSrc' in item && 'selectedIconSrc' in item;

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
      {hasIcon && (
        <Image
          src={selected ? item.selectedIconSrc : item.defaultIconSrc}
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
