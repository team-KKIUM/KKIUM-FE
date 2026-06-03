# Jest test 관련 docs 

이 프로젝트는 CodeBuild `build` 단계에서 **`pnpm test:unit` → `pnpm build`** 순서로 실행합니다.  
유닛 테스트가 실패하면 Next.js 빌드와 배포가 진행되지 않습니다.

## AWS 연동 (`buildspec.yml`)

| 단계 | 명령 | 설명 |
|------|------|------|
| `install` | `pnpm install --frozen-lockfile` | 의존성 설치 (Jest 포함) |
| `build` | `pnpm test:unit` | Jest 유닛 테스트 |
| `build` | `pnpm build` | Next.js 정적 빌드 (`out` 아티팩트) |

### CodePipeline에서 확인할 항목

- CodeBuild 프로젝트가 루트의 `buildspec.yml`을 사용하는지
- Node.js 런타임 버전이 `20`인지
- `pnpm install --frozen-lockfile`가 성공하는지

## 로컬 실행

```bash
pnpm test:unit          # 유닛 테스트 1회
pnpm test:unit:watch    # watch 모드
pnpm build              # CodeBuild와 동일한 빌드 순서로 확인 시 test 후 실행
```

설정 파일: `jest.config.mjs` (`next/jest`, `testEnvironment: node`, `@/*` alias)

---

## 테스트 범위 요약

| 구분 | 테스트 파일 수 | 대상 |
|------|----------------|------|
| Apply (API) | 2 | 분석 상태·Zod 스키마 |
| Apply (페이지 유틸) | 10 | 매핑·저장 요청·필드 제한 |
| Home | 4 | 대시보드 스키마·기간·직무 유형·궁합 |
| **합계** | **16 suites / 42 tests** | 순수 함수·스키마 위주 |

브라우저/DOM·API 호출 오케스트레이션(`copyToClipboard`, `saveApplyCoverLetter` 등)은 유닛 테스트 대상에서 제외했습니다.

---

## Apply -API 관련 

### `src/app/api/apply/jdAnalysisStatus.test.ts`

| 테스트 | 기대 동작 |
|--------|-----------|
| `normalizeJdAnalysisStatus` | 공백 trim, 대문자 변환. `undefined` → 빈 문자열 |
| `resolveJdAnalysisStatus` | `analysisStatus` 우선, 없으면 `analysis_status` 사용 |
| terminal status | `COMPLETED` / `FAILED`만 종료 상태로 판별 |
| in progress | `PENDING`, `RUNNING`, 빈 값 등은 진행 중. `COMPLETED`·`FAILED`는 진행 중 아님 |

### `src/app/api/apply/types.test.ts`

| 테스트 | 기대 동작 |
|--------|-----------|
| `assertParseableJdUrlResponse` | 제목·회사·분야·본문 중 하나라도 값이 있으면 통과, 전부 비어 있으면 `UNPARSEABLE_JD_URL_MESSAGE` 예외 |
| `jdAnalysisResponseSchema` | **Pending** 응답에서 `jdInfo`·`matchResult`가 `null`이어도 parse 성공 |
| `jdAnalysisResponseSchema` | `analysis_status`(snake_case)를 `analysisStatus`로 정규화 |

---

## Apply - 페이지 관련 

### `buildSaveResumeRequest.test.ts`


| 함수 | 기대 동작 |
|------|-----------|
| `parseExperienceIds` | 숫자 문자열만 양의 정수로 변환. `abc`, `0`, 음수 제외 |
| `getJdQuestionIdFromCoverLetterQuestion` | `jdQuestionId` 필드 또는 `resume-q-{id}` id 패턴에서 ID 추출 |
| `buildSaveResumeRequest` | 서버 question ID가 있는 문항만 `answers` 배열에 포함. 경험 ID·답변 텍스트 매핑 |

### `limitJobPostingFieldText.test.ts`


| 함수 | 기대 동작 |
|------|-----------|
| `limitJobPostingBodyText` | 공고 본문을 `JOB_POSTING_BODY_MAX_LENGTH`(10,000자)로 자름 |
| `limitJobPostingCoverQuestionText` | 자소서 문항을 `JOB_POSTING_COVER_QUESTION_MAX_LENGTH`(300자)로 자름 |

### `mapJdAnalysisToView.test.ts`


| 테스트 | 기대 동작 |
|--------|-----------|
| 완료 응답 매핑 | 적합도·공고 정보·스킬/역량 태그·주요 업무/자격/우대 섹션을 UI 뷰 모델로 변환 |
| Pending/null | `jdInfo`·`matchResult` 없을 때 섹션 빈 배열, 채용 기간 `상시 채용` |

### `mapJdAnalysisExperienceToApplyMatch.test.ts`


| 기대 동작 |
|-----------|
| API 경험 타입(`CAREER` 등) → UI 카테고리(`career`). TECH/COMPETENCY 태그 분리, `usageFitScore` → `matchScore` |

### `mapJdExperienceAnalysisToView.test.ts`


| 기대 동작 |
|-----------|
| 강점·약점·활용 가이드·하이라이트 키워드를 경험 분석 패널 데이터 형태로 매핑 |

### `mapJdResumeToCoverLetterQuestions.test.ts`


| 기대 동작 |
|-----------|
| `orderNum` 정렬. 문항 제목·prompt·답변·AI 초안 trim. `resume` null이면 `[]` |

### `mapJdResumeToJobPostingSnapshot.test.ts`


| 기대 동작 |
|-----------|
| `jdId`·제목·회사·직무·채용 기간 스냅샷 생성. 날짜 없으면 `상시 채용` |

### `mapExperienceCardToApplyMatch.test.ts`


| 기대 동작 |
|-----------|
| 경험 카드 API 응답 → 지원 화면 경험 매칭 카드 모델 (`matchScore` 0, 빈 analysis) |

### `mapResumeQuestionExperience.test.ts`


| 기대 동작 |
|-----------|
| 자소서 문항별 경험 → 커버레터 선택 UI 모델. 기간·타입·`usageFitScore` 매핑 |

### `enrichResumeQuestionExperiences.test.ts`


| 기대 동작 |
|-----------|
| 경험 `type`이 비어 있으면 `typeByExperienceId` 맵에서 보강. 이미 타입 있으면 유지 |

---

## Home

### `src/app/api/home/types.test.ts`


| 테스트 | 기대 동작 |
|--------|-----------|
| 대시보드 parse | `null` 필드 → 빈 문자열, 숫자 문자열 coerce, `targetJds`·분포 배열 정규화 |
| 필수 필드 | `totalExperienceCount` 등 없는 payload는 parse 실패 (스키마 계약) |

### `src/app/_utils/formatRecruitmentPeriod.test.ts`


| 기대 동작 |
|-----------|
| 시작·종료 모두 없음 → `상시 채용`. 둘 다 있으면 `YYYY.MM.DD ~ YYYY.MM.DD`. 한쪽만 있으면 해당 날짜만 |

### `src/app/_constants/jobTypeCardMappingData.test.ts`


| 기대 동작 |
|-----------|
| `typeName` 없음/빈 값/알 수 없는 값 → 기본 프로필(`목표 설계자`). `정밀 분석가` 등 알려진 이름 → 해당 프로필 |

### `src/app/_utils/calculateNameCompatibility.test.ts`


| 함수 | 기대 동작 |
|------|-----------|
| `calculateNameCompatibility` | 동일 입력 → 동일 점수(90~100). 입력 변경 시 점수 변경 |
| `buildNameCompatibilityRows` | 마지막 숫자 행이 점수 자릿수와 일치 |
| `buildNameCompatibilitySearchParams` | name·company trim 후 query string 생성 |
| `getNameCompatibilityResultFromSearchParams` | 필수 param 없으면 `null`, 있으면 score 포함 결과 |

---

## 파일 위치 규칙

- 테스트 파일은 **대상 소스와 같은 디렉터리**에 `*.test.ts`로 둡니다.
- 예: `mapJdAnalysisToView.ts` ↔ `mapJdAnalysisToView.test.ts`
