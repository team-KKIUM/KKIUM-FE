import Image from 'next/image';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { getExperienceCategoryMeta } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { Tag } from '@/components/common/Tag';
import { XIcon } from '@/components/common/icons/XIcon';
import { cn } from '@/lib/utils';

const detailFields = [
  ['Situation', 'situation'],
  ['Task', 'task'],
  ['Action', 'action'],
  ['Result', 'result'],
  ['Taken', 'taken'],
] as const;

const fallbackDetail: ExperienceItem['detail'] = {
  situation: '정산 배치가 특정 조건에서 실패/지연되어 수동 확인이 필요했고, 팀 내 운영 부담이 커지고 있었다.',
  task: '배치 실패 원인을 추적해 재시도/모니터링을 정비하고, 누락 없이 안정적으로 정산되도록 개선한다.',
  action:
    '실패 케이스 로그를 수집·분류→트랜잭션/락 이슈를 개선→재시도 정책과 알림(모니터링)을 추가→운영 매뉴얼을 정리했다.',
  result: '배치 실패율이 줄고, 장애 대응 시간이 단축됐다.',
  taken: '운영 관점에서 장애 원인을 좁히고 재발을 막는 체계를 만드는 법을 배웠다.',
};

function getDetailValue(experience: ExperienceItem, key: keyof ExperienceItem['detail']) {
  return experience.detail[key] || fallbackDetail[key];
}

function getDetailInfo(experience: ExperienceItem) {
  if (experience.detailInfo.length > 0) {
    return experience.detailInfo;
  }

  return [
    { label: '기간', value: experience.period || '2025.11.01~2025.12.20' },
    { label: '회사/기관/단체명', value: '토스' },
    { label: '고용 형태', value: '인턴' },
  ];
}

export interface SelectedExperienceDetailPanelProps {
  experience: ExperienceItem;
  className?: string;
  onClose: () => void;
}

export function SelectedExperienceDetailPanel({
  experience,
  className,
  onClose,
}: SelectedExperienceDetailPanelProps) {
  const category = getExperienceCategoryMeta(experience.type);
  const detailInfo = getDetailInfo(experience);

  return (
    <section
      data-slot="selected-experience-detail-panel"
      className={cn(
        'flex h-[calc(100dvh-160px)] min-h-0 w-full flex-col overflow-hidden bg-background-default',
        className,
      )}
    >
      <div className="flex h-full min-h-0 w-full flex-col gap-11 overflow-hidden px-6 py-6 pr-1">
        <div className="flex w-full shrink-0 flex-col gap-4">
          <div className="flex w-full flex-col gap-2.5">
            <header className="flex min-w-0 items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h2 className="line-clamp-1 text-xl font-bold leading-7 text-strong">
                  {experience.title}
                </h2>
                <p className="line-clamp-1 body-3-bold text-quaternary">
                  {experience.description}
                </p>
              </div>

              <button
                type="button"
                aria-label="경험 상세 닫기"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-primary outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
              >
                <XIcon className="size-6" />
              </button>
            </header>

            <div className="flex items-center gap-5">
              <div className="flex shrink-0 flex-col items-center gap-0.5">
                <Image
                  src={category.selectedIconSrc}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16"
                />
                <span className="body-3-bold text-strong">{category.label}</span>
              </div>

              <dl className="flex min-w-0 flex-col gap-1.5">
                {detailInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <dt className="body-3-bold text-strong">{item.label}</dt>
                    <dd className="body-3-regular text-secondary">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {experience.skillTags.map((tag, index) => (
                <Tag key={`skill-${tag}-${index}`} tone="skill">
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {experience.competencyTags.map((tag, index) => (
                <Tag key={`competency-${tag}-${index}`} tone="competency">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <hr className="w-full border-0 border-t border-gray-300" />
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto pb-6 pr-2">
          {detailFields.map(([label, key]) => (
            <section key={key} className="flex w-full flex-col gap-1.5">
              <div className="px-2">
                <h3 className="body-1-bold text-primary">{label}</h3>
              </div>
              <div className="flex h-36 w-full flex-col rounded-2xl border border-border-thick bg-background-w px-3 py-4">
                <p className={cn('text-sm leading-5 text-strong', key === 'taken' && 'font-bold')}>
                  {getDetailValue(experience, key)}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
