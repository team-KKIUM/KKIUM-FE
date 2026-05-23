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
