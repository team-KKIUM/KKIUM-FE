import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';

// --- 지원 상세 ---

export type ApplyJobPosting = {
  title: string;
  companyName: string;
  jobField: string;
};

export const applyJobMockData: ApplyJobPosting = {
  title: '[포스코] 2026년 하계 스틸캠프(체험형 인턴십) 인턴 모집',
  companyName: '포스코',
  jobField: 'UXUI 디자이너',
};

// --- 공고 분석 ---

export type ApplyAnalysisSection = {
  title: string;
  items: string[];
};

export type ApplyJobInfoData = {
  postingTitle: string;
  companyName: string;
  jobField: string;
  period: string;
};

export const applyJobAnalysisMockData = {
  fitScore: 82,
  jobInfo: {
    postingTitle: '2024 하반기 신입 공채',
    companyName: '토스플레이스',
    jobField: 'Server Developer',
    period: '2026.04.01~04.28',
  },
  tags: {
    skills: [
      { label: 'Kafka', on: false },
      { label: 'Kafka', on: true },
      { label: 'Kafka', on: false },
      { label: 'Kubernetes', on: true },
    ],
    competencies: [
      { label: 'Kafka', on: false },
      { label: '주인의식', on: true },
      { label: '협업', on: false },
      { label: '역량', on: true },
    ],
  },
  sections: [
    {
      title: '주요 업무',
      items: [
        '오프라인 결제 경험을 위한 Product 서버 설계 및 개발',
        '서비스의 사용성, 확장성, 유지보수성을 고려한 구조 설계',
        '분산 시스템, 이벤트 기반 아키텍처, 고가용성 설계',
        '장애 대응 및 시스템 개선을 통한 제품 성장',
      ],
    },
    {
      title: '자격 요건',
      items: [
        '컴퓨터공학 또는 관련 전공 학사 이상',
        'Java/Kotlin 기반 백엔드 개발 경험 1년 이상',
        'RDBMS 및 NoSQL 활용 경험',
        'Git 기반 협업 경험',
      ],
    },
    {
      title: '우대 사항',
      items: [
        '대규모 트래픽 처리 및 성능 최적화 경험',
        'MSA, Kafka 등 이벤트 기반 아키텍처 경험',
        '결제·금융 도메인 서비스 개발 경험',
      ],
    },
  ],
} as const;

// --- 내 경험  ---

export type ExperienceAnalysisData = {
  goodPoints: string;
  badPoints: string;
  usageGuide: string;
};

export type ApplyMyExperienceItem = {
  id: string;
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  description: string;
  skillTags: readonly string[];
  competencyTags: readonly string[];
  matchScore: number;
  analysis: ExperienceAnalysisData;
};

const emptyExperienceDetail: ExperienceItem['detail'] = {
  situation: '',
  task: '',
  action: '',
  result: '',
  taken: '',
};

export function mapApplyMyExperienceToExperienceItem(item: ApplyMyExperienceItem): ExperienceItem {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    period: '',
    skillTags: [...item.skillTags],
    competencyTags: [...item.competencyTags],
    detailInfo: [],
    detail: emptyExperienceDetail,
  };
}

export const applyMyExperienceMockData: readonly ApplyMyExperienceItem[] = [
  {
    id: '1',
    type: 'etc',
    title: '고가용성 결제 시스템 설계 및 운영',
    description: '99.99% 가용성을 목표로 한 분산 결제 시스템 설계 및 장애 대응',
    skillTags: [
      'Chrome Extension',
      'Multi-Variate Testing',
      'Multi-Variate Testing',
      'Multi-Variate Testing',
    ],
    competencyTags: ['문제 해결', '주인의식', '시스템 설계'],
    matchScore: 88,
    analysis: {
      goodPoints:
        '이 경험은 협업, 기술적 도전 역량을 보여줍니다. TPS 500 → 2000으로 4배 향상, 검색 응답 속도 50% 개선',
      badPoints: '구체적인 수치나 성과 지표를 추가하면 더욱 설득력 있는 경험이 될 수 있습니다.',
      usageGuide:
        'Redis 캐싱 레이어 구축, MySQL 쿼리 최적화, Elasticsearch 검색 인덱스 설계를 구체적으로 서술하고, TPS 500 → 2000으로 4배 향상, 검색 응답 속도 50% 개선를 강조하세요.',
    },
  },
  {
    id: '2',
    type: 'career',
    title: '토스페이먼츠 백엔드 인턴',
    description: '결제 도메인 API 개발 및 장애 대응 프로세스 개선',
    skillTags: ['Java', 'Spring', 'Kafka'],
    competencyTags: ['협업', '문제 해결'],
    matchScore: 76,
    analysis: {
      goodPoints: '결제 도메인 경험과 Kafka 기반 이벤트 처리 역량이 공고 요구사항과 잘 맞습니다.',
      badPoints: '장애 대응 사례의 정량적 결과를 보강하면 설득력이 높아집니다.',
      usageGuide:
        'API 설계 원칙, 장애 대응 프로세스 개선 사례, Kafka 메시지 처리 경험을 STAR 구조로 정리해 작성하세요.',
    },
  },
  {
    id: '3',
    type: 'activity',
    title: '해커톤 우수상 수상',
    description: '실시간 협업 도구 프로토타입 설계 및 프론트엔드 구현',
    skillTags: ['React', 'TypeScript'],
    competencyTags: ['주도성', '커뮤니케이션'],
    matchScore: 64,
    analysis: {
      goodPoints: '짧은 기간 내 프로토타입 완성과 팀 협업 경험이 드러납니다.',
      badPoints: '백엔드·인프라 관련 키워드가 상대적으로 부족합니다.',
      usageGuide:
        '팀 내 역할, 기술 스택 선택 이유, 해커톤 결과물의 사용자 반응을 구체적으로 추가하세요.',
    },
  },
];

/** 경험 선택 모달 mock (적합도·정렬은 백엔드 응답 그대로) */
export const coverLetterQuestionExperiencesMock = applyMyExperienceMockData.map((item) => ({
  experience: mapApplyMyExperienceToExperienceItem(item),
  fitScore: item.matchScore,
}));

// --- 자기소개서 ---

export const APPLY_COVER_LETTER_MAX_QUESTIONS = 5;
export const APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES = 3;

export type ApplyCoverLetterQuestion = {
  id: string;
  title: string;
  content: string;
  prompt?: string;
};

export function getCoverLetterQuestionDisplayText(question: ApplyCoverLetterQuestion) {
  const prompt = question.prompt?.trim();

  return prompt && prompt.length > 0 ? prompt : question.title;
}

export const applyCoverLetterQuestionsMock: ApplyCoverLetterQuestion[] = [
  { id: 'cover-letter-q1', title: '직무 경험', content: '' },
  {
    id: 'cover-letter-q2',
    title: '성장 과정',
    content: '',
    prompt:
      'LG에너지솔루션이 지향해야할 방향성에 대해 논하고, 위의 경험을 바탕으로 해당 직무에 어떻게 기여할 수 있는지 구체적으로 작성해주세요.',
  },
  { id: 'cover-letter-q3', title: '입사 후 포부', content: '' },
];

export const coverLetterAiDraftMock =
  '기존 결제 시스템이 트래픽 급증 시 다운타임이 발생하여 매출 손실이 발생했던 경험을 통해 문제 해결의 중요성을 깊이 이해하게 되었습니다. 이후 Redis 캐싱 레이어를 구축하고 MySQL 쿼리를 최적화하여 TPS를 500에서 2000으로 향상시켰으며, 검색 응답 속도를 50% 개선했습니다. 이러한 경험을 바탕으로 귀사의 대규모 트래픽 환경에서도 안정적인 서비스를 제공하고, 기술적 의사결정에 적극적으로 기여하겠습니다.';

export const coverLetterWritingGuideMock = {
  sections: [
    {
      title: '핵심 키워드',
      content: '수치화된 성과, Java, MySQL, Redis',
    },
    {
      title: '공고와의 연결점',
      content:
        'Java, MySQL, Redis, Elasticsearch 기술을 활용한 구체적인 성과가 이 공고에서 요구하는 실행력과 문제 해결 능력을 증명합니다. 수치화된 결과를 중심으로 작성하면 설득력이 높아집니다.',
    },
    {
      title: '작성 가이드',
      content:
        '하나의 스토리로 자연스럽게 연결하세요. 구체적인 수치나 데이터를 제시하여 성과를 명확히 보여주는 것이 중요합니다.',
    },
  ],
} as const;

// --- 지원 목록 ---

export type ApplyListCoverLetter = {
  motivation: string;
  experience: string;
  aspiration: string;
};

export type ApplyListItem = {
  id: string;
  title: string;
  companyName: string;
  jobField: string;
  period: string;
  coverLetter: ApplyListCoverLetter;
};

const sampleListCoverLetter: ApplyListCoverLetter = {
  motivation:
    '대규모 서비스 운영 경험을 통해 안정성과 확장성의 중요성을 깊이 이해하게 되었습니다. 네이버의 기술적 도전과 글로벌 서비스 운영 노하우를 배우고 싶어 지원하게 되었습니다.',
  experience:
    '블랙프라이데이 기간 동안 동시 접속자 10만명을 안정적으로 처리하기 위해 Redis 캐싱 레이어를 구축하고 MySQL 쿼리를 최적화했습니다. 그 결과 TPS를 500에서 2000으로 4배 향상시켰고, 검색 응답 속도를 50% 개선했습니다.',
  aspiration:
    '네이버에 입사하게 된다면 글로벌 서비스의 대규모 트래픽 처리 경험을 쌓으며, 더 나은 사용자 경험을 제공하는 백엔드 시스템을 설계하고 싶습니다. 특히 AI 기술과 결합된 차세대 검색 엔진 개발에 기여하고 싶습니다.',
};

export const applyListMockData: ApplyListItem[] = [
  {
    id: '1',
    title: 'Frontend Developer 채용',
    companyName: '네이버',
    jobField: '프론트엔드 개발자',
    period: '2026.05.10 10:00~05.24 17:00',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '2',
    title: 'Frontend Engineer Internship',
    companyName: '카카오',
    jobField: '프론트엔드 인턴',
    period: '2026.05.12 09:00~05.27 18:00',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '3',
    title: 'Backend Engineer 채용',
    companyName: '쿠팡',
    jobField: '백엔드 개발자',
    period: '2026.05.12 09:00~05.26 18:00',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '4',
    title: 'Product Manager 채용',
    companyName: '카카오',
    jobField: '기획자',
    period: '2026.04.01~04.28',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '5',
    title: 'UI/UX Designer 채용',
    companyName: 'LINE',
    jobField: '디자이너',
    period: '2026.04.01~04.28',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '6',
    title: 'Frontend Engineer 채용',
    companyName: '토스',
    jobField: '프론트엔드',
    period: '2026.04.01~04.28',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '7',
    title: 'Backend Developer 채용',
    companyName: '당근마켓',
    jobField: '백엔드',
    period: '2026.04.01~04.28',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '8',
    title: '서비스 기획 채용',
    companyName: '우아한형제들',
    jobField: '서비스 기획',
    period: '2026.04.01~04.28',
    coverLetter: sampleListCoverLetter,
  },
  {
    id: '9',
    title: 'Product Designer 채용',
    companyName: '무신사',
    jobField: '프로덕트 디자이너',
    period: '2026.04.01~04.28',
    coverLetter: sampleListCoverLetter,
  },
];

// --- 공고 등록 모달 ---

export const JOB_POSTING_ANALYSIS_MOCK = {
  companyName: '토스플레이스',
  field: 'Server Developer',
} as const;

export const RESULT_RECRUITMENT_FIELD_OPTIONS = [
  JOB_POSTING_ANALYSIS_MOCK.field,
  'Frontend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Data Engineer',
] as const;

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
