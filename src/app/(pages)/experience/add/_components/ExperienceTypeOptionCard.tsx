import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface ExperienceTypeOptionCardProps extends React.ComponentProps<'button'> {
  label: string;
  defaultIconSrc: string;
  selectedIconSrc: string;
  selected?: boolean;
}

export function ExperienceTypeOptionCard({
  label,
  defaultIconSrc,
  selectedIconSrc,
  selected = false,
  className,
  ...props
}: ExperienceTypeOptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex h-[125px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] py-4 transition-colors focus-visible:shadow-focus-ring focus-visible:outline-none',
        selected
          ? 'border-mint-200 bg-mint-50'
          : 'border-border-thick bg-background-w hover:border-border-bold',
        className,
      )}
      {...props}
    >
      <Image
        src={selected ? selectedIconSrc : defaultIconSrc}
        alt=""
        width={60}
        height={60}
        className="size-[60px] shrink-0"
      />
      <span className="text-center text-[17px] leading-[1.48] font-semibold tracking-[-0.17px] text-strong">
        {label}
      </span>
    </button>
  );
}
