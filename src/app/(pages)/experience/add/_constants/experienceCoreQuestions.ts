export const CORE_EXPERIENCE_FIELDS = [
  {
    number: '01.',
    label: 'Situation (상황 및 목표)',
    placeholder: '이 경험을 통해 달성하고자 했던 목표를 구체적으로 작성해주세요.',
  },
  {
    number: '02.',
    label: 'Task (해결 과제)',
    placeholder: '직면했던 문제나 해결해야 했던 과제를 작성해주세요.',
  },
  {
    number: '03.',
    label: 'Act (실제 행동)',
    placeholder: '문제 해결을 위해 구체적으로 어떤 행동을 했는지 작성해주세요.',
  },
  {
    number: '04.',
    label: 'Result (결과 및 성과)',
    placeholder:
      '수치화된 성과(KPI)를 포함하여 결과를 작성해주세요. 예: 전환율 20% 상승, 참여자 100명 증가',
  },
  {
    number: '05.',
    label: 'Taken (배운 점)',
    placeholder: '이 경험을 통해 배운 점이나 성장한 부분을 작성해주세요.',
  },
] as const;

export const CORE_EXPERIENCE_TIPS = [
  '1. 결과 및 성과는 가능한 한 수치로 표현해주세요.',
  '2. STAR 기법(Situation, Task, Action, Result)을 활용하면 더 효과적입니다.',
  '3. 구체적인 도구나 방법론을 언급하면 전문성이 더 잘 드러납니다.',
] as const;
