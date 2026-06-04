import { EmptyTypeBackground } from '@/app/_components/EmptyTypeBackground';
import { cn } from '@/lib/utils';

export interface NullTypeProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = '아직 직무 유형을 파악할 수 없어요.';
const DEFAULT_DESCRIPTION = '경험을 추가하면 직무 유형을 분석해드릴게요.';

export function NullType({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
  ...props
}: NullTypeProps) {
  return (
    <section
      data-slot="null-type"
      className={cn(
        'relative h-[336px] min-w-0 overflow-hidden rounded-xl border border-gray-300 bg-background-w',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0" aria-hidden>
        <EmptyTypeBackground />
      </div>

      <div className="absolute inset-x-5 top-[26px] inline-flex items-start justify-between">
        <h3 className="text-xl font-extrabold leading-7 text-gray-main">나의 직무 유형</h3>
        <div className="size-8" aria-hidden />
      </div>

      <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-1 px-4 text-center">
        <p className="text-base font-bold leading-6 text-strong">{title}</p>
        <p className="whitespace-nowrap text-base font-normal leading-6 text-gray-700">
          {description}
        </p>
      </div>
    </section>
  );
}
