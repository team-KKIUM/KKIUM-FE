export const EXPERIENCE_ADD_STEPS = ['자료 업로드', '기본 정보 입력', '핵심 경험 입력', '결과 확인'] as const;

export type ExperienceAddStep = (typeof EXPERIENCE_ADD_STEPS)[number];
