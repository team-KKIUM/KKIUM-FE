import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const APPLY_SECTION_INFO_CARD_WIDTH = 296;
export const APPLY_QUESTION_FIT_INFO_CARD_WIDTH = 340;
export const APPLY_SECTION_INFO_HORIZONTAL_MARGIN = 20;

export type ApplySectionInfoVariant = 'job-analysis' | 'my-experience' | 'question-fit';

export interface ApplySectionInfoCardProps {
  variant: ApplySectionInfoVariant;
  className?: string;
}

function JobAnalysisInfoBody() {
  return (
    <p className="w-full text-xs leading-4 font-normal text-secondary">
      ✓ 공고에서 중요하게 보는 업무, 기술, 역량과 내 경험 전체가 얼마나 잘 연결되는지 분석해요.
      <br />
      <br />✓ 이 점수는 <span className="font-bold">합격 가능성이 아니라,</span> 내 경험을 이 공고에
      얼마나 잘 활용할 수 있는지 보여주는 <span className="font-bold">참고 점수</span>예요.
    </p>
  );
}

function MyExperienceInfoBody() {
  return (
    <p className="w-full text-xs leading-4 font-normal text-secondary">
      ✓ 현재 공고의 주요 업무, 기술, 역량과 이 경험의 핵심 내용, 주요 기술 및 역량이 얼마나 연결되는지
      살펴봐요.
      <br />
      <br />✓ <span className="font-bold">점수가 높은 경험</span>은 자기소개서나 포트폴리오에서{' '}
      <br />
      <span className="font-bold">먼저 강조하기 좋은 경험</span>이에요.
    </p>
  );
}

function QuestionFitInfoBody() {
  return (
    <p className="w-full text-xs leading-4 font-normal text-secondary">
      ✓ 문항의 의도를 먼저 파악한 뒤, 내 경험과 공고 내용 중 관련 있는 부분을 함께 찾아요.
      <br />
      <br />✓ 점수가 높은 경험은 해당 문항의 답변 소재로 활용하기 좋은 경험이에요.
    </p>
  );
}

const INFO_CONTENT: Record<
  ApplySectionInfoVariant,
  { titleHighlight: string; titleRest: string; body: ReactNode }
> = {
  'job-analysis': {
    titleHighlight: '내 경험이 공고와 얼마나 맞는지',
    titleRest: ' 살펴봤어요',
    body: <JobAnalysisInfoBody />,
  },
  'my-experience': {
    titleHighlight: '이 경험이 공고에 얼마나 어울리는지',
    titleRest: ' 확인했어요',
    body: <MyExperienceInfoBody />,
  },
  'question-fit': {
    titleHighlight: '이 문항에 어떤 경험을 쓰면 좋을지 ',
    titleRest: '살펴봤어요',
    body: <QuestionFitInfoBody />,
  },
};

function getInfoCardWidth(variant: ApplySectionInfoVariant) {
  return variant === 'question-fit' ? APPLY_QUESTION_FIT_INFO_CARD_WIDTH : APPLY_SECTION_INFO_CARD_WIDTH;
}

export function ApplySectionInfoCard({ variant, className }: ApplySectionInfoCardProps) {
  const content = INFO_CONTENT[variant];
  const cardWidth = getInfoCardWidth(variant);

  return (
    <div
      role="dialog"
      aria-label="안내"
      className={cn(
        'flex flex-col gap-2.5 rounded-xl bg-background-w p-5 shadow-lg',
        className,
      )}
      style={{ width: cardWidth }}
    >
      <p className="w-full text-sm leading-5 font-bold">
        <span className="text-success underline">{content.titleHighlight}</span>
        <span className="text-strong">{content.titleRest}</span>
      </p>
      {content.body}
    </div>
  );
}
