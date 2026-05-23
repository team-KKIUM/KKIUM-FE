import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';

export type ApplyJobTagItem = {
  label: string;
  on: boolean;
};

export interface ApplyJobTagsProps {
  skills: readonly ApplyJobTagItem[];
  competencies: readonly ApplyJobTagItem[];
  className?: string;
}

type ApplyJobTagGroupProps = {
  title: string;
  variant: 'skill' | 'competency';
  items: readonly ApplyJobTagItem[];
};

function ApplyJobTagGroup({ title, variant, items }: ApplyJobTagGroupProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <span className="body-1-regular text-secondary">{title}</span>

      <div className="flex flex-wrap content-start gap-1">
        {items.map((item, index) => (
          <Tag
            key={`${title}-${item.label}-${index}`}
            size="large"
            tone={item.on ? variant : 'neutral'}
            className="rounded"
          >
            {item.label}
          </Tag>
        ))}
      </div>
    </div>
  );
}

export function ApplyJobTags({ skills, competencies, className }: ApplyJobTagsProps) {
  return (
    <section className={cn('flex w-full flex-col gap-2.5', className)}>
      <ApplyJobTagGroup title="기술" variant="skill" items={skills} />
      <ApplyJobTagGroup title="역량" variant="competency" items={competencies} />
    </section>
  );
}
