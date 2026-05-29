// --- 페이지 레이아웃 ---

export const APPLY_PAGE_HORIZONTAL_PADDING = 'px-20';
export const APPLY_COVER_LETTER_SECTION_EXTEND =
  'box-border -ml-20 pl-20 pr-0 -mr-20 w-[calc(100%+10rem)] max-w-none';

/** 탭 하단 전체 너비 스트로크  */
export const APPLY_TAB_STROKE_COVER_LETTER =
  'box-border -ml-20 -mr-20 w-[calc(100%+10rem)] max-w-none';

/** section pl-20을 상쇄해 split·세로 스트로크를 가로 스트로크와 맞춤 */
export const APPLY_COVER_LETTER_SPLIT_BLEED = '-ml-20 w-[calc(100%+5rem)] max-w-none';

/** 탭 하단 전체 너비 스트로크  */
export const APPLY_TAB_STROKE_ANALYSIS = APPLY_PAGE_HORIZONTAL_PADDING;

/** 자소서 작성 패널 왼쪽 inset */
export const APPLY_COVER_LETTER_LEFT_PANEL_INSET = 160;

/** 자소서 작성 패널만 우측 여백 */
export const APPLY_COVER_LETTER_RIGHT_PANEL_PADDING = 'pr-20';

/** 자소서 작성 패널 배경  */
export const APPLY_COVER_LETTER_RIGHT_PANEL_BG =
  'overflow-x-visible bg-background-w pt-3 min-h-[calc(100dvh-160px)]';

/** AI 초안 패널만 좌측,우측 패널 밖으로 확장 */
export const APPLY_COVER_LETTER_AI_DRAFT_PANEL_BLEED = '-left-9 -right-20';

// --- 자기소개서 제한 ---

export const APPLY_COVER_LETTER_MAX_QUESTIONS = 5;
export const APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES = 3;

// --- 공고 등록 모달 ---

export const JOB_POSTING_BODY_MAX_LENGTH = 10_000;
export const JOB_POSTING_COVER_QUESTION_MAX_LENGTH = 300;

export const JOB_POSTING_MODAL_CONTENT_CLASS =
  'flex h-[857px] max-h-[calc(100dvh-40px)] w-full max-w-[864px] flex-col gap-6 overflow-hidden px-[30px] py-5';

export const JOB_POSTING_PRIMARY_BUTTON_CLASS = 'h-12 w-full shrink-0';

export const JOB_EDIT_STEP_HEADER: Record<'result' | 'manual', { title: string; description: string }> =
  {
    result: {
      title: '분석 결과 확인하기',
      description: '등록한 공고 결과를 확인해주세요.',
    },
    manual: {
      title: '공고 등록',
      description: '새로운 공고를 등록해주세요.',
    },
  };

export const RESULT_RECRUITMENT_FIELD_OPTIONS = [
  'Server Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Data Engineer',
] as const;
