export type ApplyCoverLetter = {
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
  coverLetter: ApplyCoverLetter;
};

const sampleCoverLetter: ApplyCoverLetter = {
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
    coverLetter: sampleCoverLetter,
  },
  {
    id: '2',
    title: 'Frontend Engineer Internship',
    companyName: '카카오',
    jobField: '프론트엔드 인턴',
    period: '2026.05.12 09:00~05.27 18:00',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '3',
    title: 'Backend Engineer 채용',
    companyName: '쿠팡',
    jobField: '백엔드 개발자',
    period: '2026.05.12 09:00~05.26 18:00',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '4',
    title: 'Product Manager 채용',
    companyName: '카카오',
    jobField: '기획자',
    period: '2026.04.01~04.28',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '5',
    title: 'UI/UX Designer 채용',
    companyName: 'LINE',
    jobField: '디자이너',
    period: '2026.04.01~04.28',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '6',
    title: 'Frontend Engineer 채용',
    companyName: '토스',
    jobField: '프론트엔드',
    period: '2026.04.01~04.28',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '7',
    title: 'Backend Developer 채용',
    companyName: '당근마켓',
    jobField: '백엔드',
    period: '2026.04.01~04.28',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '8',
    title: '서비스 기획 채용',
    companyName: '우아한형제들',
    jobField: '서비스 기획',
    period: '2026.04.01~04.28',
    coverLetter: sampleCoverLetter,
  },
  {
    id: '9',
    title: 'Product Designer 채용',
    companyName: '무신사',
    jobField: '프로덕트 디자이너',
    period: '2026.04.01~04.28',
    coverLetter: sampleCoverLetter,
  },
];
