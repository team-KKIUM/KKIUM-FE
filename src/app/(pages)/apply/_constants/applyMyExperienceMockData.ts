import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';

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
