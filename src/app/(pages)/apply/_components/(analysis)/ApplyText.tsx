import { cn } from '@/lib/utils';

export interface ApplyTextProps {
  title: string;
  items: readonly string[];
  className?: string;
}

export function ApplyText({ title, items, className }: ApplyTextProps) {
  return (
    <section className={cn('flex w-full flex-col gap-3', className)}>
      <h2 className="title-2-bold text-gray-900">{title}</h2>

      <ul className="flex w-full flex-col gap-2">
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className="body-3-regular text-gray-700">
            <span className="body-3-bold">✓ </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
