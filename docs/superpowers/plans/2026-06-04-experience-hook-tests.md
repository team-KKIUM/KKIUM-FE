# Experience Hook Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add unit tests for the experience-add state hooks so step navigation, form state, and material restoration behavior are protected.

**Architecture:** Keep the first hook-test PR focused on local React state hooks only. Use Jest for consistency with the existing unit-test setup, and add React Testing Library only for `renderHook`/`act`/`waitFor`. Do not include `useExperienceAddActions` in this PR because it requires API mutation mocks, analytics mocks, and broader integration-style coverage.

**Tech Stack:** Next.js static export app, React 19, Jest 30 with `next/jest`, React Testing Library `renderHook`, TypeScript.

---

## File Structure

- Modify: `package.json`
  - Add hook testing dependencies.
- Modify: `pnpm-lock.yaml`
  - Updated automatically by `pnpm add`.
- Create: `src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts`
  - Tests step index transitions and derived step flags.
- Create: `src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts`
  - Tests initial form state, analyze response application, manual setters, and reset behavior.
- Create: `src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts`
  - Tests PDF draft restoration, no-draft behavior, duplicate PDF prevention, and storage error handling.

## Out Of Scope

- `useExperienceAddActions` tests.
- Component tests for `ExperienceAddPageContent` or modal components.
- API/service tests for Notion/PDF analysis.

---

### Task 1: Hook Test Environment

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Add hook test dependencies**

Run:

```bash
pnpm add -D @testing-library/react jest-environment-jsdom
```

Expected:

```txt
devDependencies updated with @testing-library/react and jest-environment-jsdom
pnpm-lock.yaml updated
```

- [ ] **Step 2: Confirm existing tests still run**

Run:

```bash
pnpm exec jest --config jest.config.mjs --runTestsByPath 'src/app/(pages)/experience/add/_utils/experienceAddValidation.test.ts'
```

Expected:

```txt
Test Suites: 1 passed, 1 total
```

- [ ] **Step 3: Commit dependency setup**

Run:

```bash
git add package.json pnpm-lock.yaml
git commit -m "test: hook 테스트 환경 설정 추가"
```

---

### Task 2: useExperienceAddStep Tests

**Files:**
- Create: `src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts`
- Test target: `src/app/(pages)/experience/add/_hooks/useExperienceAddStep.ts`

- [ ] **Step 1: Create the test file**

Create `src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts`:

```ts
/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';

import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';

import { useExperienceAddStep } from './useExperienceAddStep';

describe('useExperienceAddStep', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('starts at upload step with initial flags', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isBasicInfoStep).toBe(false);
    expect(result.current.isCoreInfoStep).toBe(false);
    expect(result.current.isResultStep).toBe(false);
    expect(result.current.isCompleteStep).toBe(false);
  });

  test('moves to next steps and updates derived flags', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.isBasicInfoStep).toBe(true);

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.isCoreInfoStep).toBe(true);

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length - 1);
    expect(result.current.isResultStep).toBe(true);

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length);
    expect(result.current.isCompleteStep).toBe(true);
  });

  test('does not move past first or complete step', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    act(() => {
      result.current.goPreviousStep();
    });

    expect(result.current.currentStepIndex).toBe(0);

    act(() => {
      for (let index = 0; index < EXPERIENCE_ADD_STEPS.length + 3; index += 1) {
        result.current.goNextStep();
      }
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length);

    act(() => {
      result.current.goPreviousStep();
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length - 1);
  });

  test('scrolls to top when step changes', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    act(() => {
      result.current.goNextStep();
    });

    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' });
  });
});
```

- [ ] **Step 2: Run the hook test**

Run:

```bash
pnpm exec jest --config jest.config.mjs --runTestsByPath 'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts'
```

Expected:

```txt
Test Suites: 1 passed, 1 total
Tests: 4 passed, 4 total
```

- [ ] **Step 3: Run lint and format check**

Run:

```bash
pnpm exec eslint 'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts'
pnpm exec prettier --check 'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts'
```

Expected:

```txt
All matched files use Prettier code style!
```

- [ ] **Step 4: Commit**

Run:

```bash
git add 'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts'
git commit -m "test: 경험 추가 단계 hook 테스트 추가"
```

---

### Task 3: useExperienceAddForm Tests

**Files:**
- Create: `src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts`
- Test target: `src/app/(pages)/experience/add/_hooks/useExperienceAddForm.ts`

- [ ] **Step 1: Create the test file**

Create `src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts`:

```ts
/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';

import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';
import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
  createEmptyResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

import { useExperienceAddForm } from './useExperienceAddForm';

function createAnalyzeResponse(
  override: Partial<ExperienceAnalyzeResponse> = {},
): ExperienceAnalyzeResponse {
  return {
    title: '분석된 경험',
    oneLineIntro: '분석된 한 줄 소개',
    activityInfo: {
      name: '프로젝트',
      teamNum: 4,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      contributionRate: 70,
      role: '프론트엔드',
    },
    careerInfo: null,
    educationInfo: null,
    situation: '상황',
    task: '과제',
    act: '행동',
    result: '결과',
    taken: '배운 점',
    tags: [
      { category: 'TECH', field: 'React' },
      { category: 'COMPETENCY', field: '협업' },
    ],
    ...override,
  };
}

describe('useExperienceAddForm', () => {
  test('starts with empty form state', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    expect(result.current.basicInfo).toEqual(createEmptyBasicInfoForm());
    expect(result.current.coreInfo).toEqual(createEmptyCoreInfoForm());
    expect(result.current.resultInfo).toEqual(createEmptyResultInfoForm());
  });

  test('updates individual form states through setters', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    act(() => {
      result.current.setBasicInfo({
        ...createEmptyBasicInfoForm(),
        type: 'career',
        title: '인턴 경험',
      });
      result.current.setCoreInfo({
        ...createEmptyCoreInfoForm(),
        situation: '매출 지표 개선 필요',
      });
      result.current.setResultInfo({
        skillTags: ['Spring'],
        competencyTags: ['문제 해결'],
      });
    });

    expect(result.current.basicInfo).toMatchObject({
      type: 'career',
      title: '인턴 경험',
    });
    expect(result.current.coreInfo.situation).toBe('매출 지표 개선 필요');
    expect(result.current.resultInfo).toEqual({
      skillTags: ['Spring'],
      competencyTags: ['문제 해결'],
    });
  });

  test('applies analyze response to all form sections', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    act(() => {
      result.current.applyAnalyzeResponse(createAnalyzeResponse());
    });

    expect(result.current.basicInfo).toMatchObject({
      type: 'activity',
      title: '분석된 경험',
      oneLineIntro: '분석된 한 줄 소개',
      teamNum: '4',
      role: '프론트엔드',
      contributionRate: '70',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(result.current.coreInfo).toEqual({
      situation: '상황',
      task: '과제',
      act: '행동',
      result: '결과',
      taken: '배운 점',
    });
    expect(result.current.resultInfo).toEqual({
      skillTags: ['React'],
      competencyTags: ['협업'],
    });
  });

  test('resets all form sections to empty state', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    act(() => {
      result.current.applyAnalyzeResponse(createAnalyzeResponse());
      result.current.resetForm();
    });

    expect(result.current.basicInfo).toEqual(createEmptyBasicInfoForm());
    expect(result.current.coreInfo).toEqual(createEmptyCoreInfoForm());
    expect(result.current.resultInfo).toEqual(createEmptyResultInfoForm());
  });
});
```

- [ ] **Step 2: Run the hook test**

Run:

```bash
pnpm exec jest --config jest.config.mjs --runTestsByPath 'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts'
```

Expected:

```txt
Test Suites: 1 passed, 1 total
Tests: 4 passed, 4 total
```

- [ ] **Step 3: Run lint and format check**

Run:

```bash
pnpm exec eslint 'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts'
pnpm exec prettier --check 'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts'
```

Expected:

```txt
All matched files use Prettier code style!
```

- [ ] **Step 4: Commit**

Run:

```bash
git add 'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts'
git commit -m "test: 경험 추가 폼 hook 테스트 추가"
```

---

### Task 4: useExperienceAddMaterials Tests

**Files:**
- Create: `src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts`
- Test target: `src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.ts`

- [ ] **Step 1: Create the test file**

Create `src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts`:

```ts
/**
 * @jest-environment jsdom
 */

import { act, renderHook, waitFor } from '@testing-library/react';

import type {
  ExperienceMaterial,
  PdfMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import { getExperienceAddPdfDraft } from '@/app/(pages)/experience/add/_utils/experienceAddPdfDraftStorage';

import { useExperienceAddMaterials } from './useExperienceAddMaterials';

jest.mock('@/app/(pages)/experience/add/_utils/experienceAddPdfDraftStorage', () => ({
  getExperienceAddPdfDraft: jest.fn(),
}));

const getExperienceAddPdfDraftMock = jest.mocked(getExperienceAddPdfDraft);

function createPdfMaterial(override: Partial<PdfMaterial> = {}): PdfMaterial {
  return {
    id: 'resume.pdf-1-1024',
    type: 'pdf',
    file: new File(['pdf'], 'resume.pdf', { type: 'application/pdf' }),
    name: 'resume.pdf',
    size: 1024,
    status: 'completed',
    ...override,
  };
}

function createNotionMaterial(): ExperienceMaterial {
  return {
    id: 'notion-page-1',
    type: 'notion',
    pageId: 'notion-page-1',
    title: 'Notion page',
    icon: null,
    notionType: 'page',
    lastEditedTime: '2024-01-01T00:00:00.000Z',
  };
}

describe('useExperienceAddMaterials', () => {
  beforeEach(() => {
    getExperienceAddPdfDraftMock.mockReset();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('starts empty when there is no saved PDF draft', async () => {
    getExperienceAddPdfDraftMock.mockResolvedValue(null);

    const { result } = renderHook(() => useExperienceAddMaterials());

    await waitFor(() => {
      expect(getExperienceAddPdfDraftMock).toHaveBeenCalledTimes(1);
    });

    expect(result.current.materials).toEqual([]);
  });

  test('restores saved PDF draft on mount', async () => {
    const pdfMaterial = createPdfMaterial();
    getExperienceAddPdfDraftMock.mockResolvedValue(pdfMaterial);

    const { result } = renderHook(() => useExperienceAddMaterials());

    await waitFor(() => {
      expect(result.current.materials).toEqual([pdfMaterial]);
    });
  });

  test('does not duplicate PDF when materials already contain one before restoration resolves', async () => {
    const existingPdf = createPdfMaterial({ id: 'existing.pdf-1-2048', name: 'existing.pdf' });
    const restoredPdf = createPdfMaterial({ id: 'restored.pdf-1-1024', name: 'restored.pdf' });
    let resolveDraft: (material: PdfMaterial) => void = () => {};

    getExperienceAddPdfDraftMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDraft = resolve;
      }),
    );

    const { result } = renderHook(() => useExperienceAddMaterials());

    act(() => {
      result.current.setMaterials([existingPdf, createNotionMaterial()]);
    });

    await act(async () => {
      resolveDraft(restoredPdf);
    });

    expect(result.current.materials).toEqual([existingPdf, createNotionMaterial()]);
  });

  test('keeps current materials and warns when PDF draft restoration fails', async () => {
    getExperienceAddPdfDraftMock.mockRejectedValue(new Error('IndexedDB failed'));

    const { result } = renderHook(() => useExperienceAddMaterials());

    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith(
        'PDF 임시 저장 데이터를 복구하지 못했습니다.',
        expect.any(Error),
      );
    });

    expect(result.current.materials).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the hook test**

Run:

```bash
pnpm exec jest --config jest.config.mjs --runTestsByPath 'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
```

Expected:

```txt
Test Suites: 1 passed, 1 total
Tests: 4 passed, 4 total
```

- [ ] **Step 3: Run lint and format check**

Run:

```bash
pnpm exec eslint 'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
pnpm exec prettier --check 'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
```

Expected:

```txt
All matched files use Prettier code style!
```

- [ ] **Step 4: Commit**

Run:

```bash
git add 'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
git commit -m "test: 경험 추가 자료 hook 테스트 추가"
```

---

### Task 5: Final Verification

**Files:**
- Verify all files changed in this plan.

- [ ] **Step 1: Run all experience hook tests**

Run:

```bash
pnpm exec jest --config jest.config.mjs --runTestsByPath \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
```

Expected:

```txt
Test Suites: 3 passed, 3 total
```

- [ ] **Step 2: Run existing experience tests plus new hook tests**

Run:

```bash
pnpm exec jest --config jest.config.mjs --runTestsByPath \
  'src/app/(pages)/experience/_utils/mapExperiencePieceType.test.ts' \
  'src/app/(pages)/experience/_utils/mapExperienceResponse.test.ts' \
  'src/app/(pages)/experience/_utils/mapExperienceItemToUpdateRequest.test.ts' \
  'src/app/(pages)/experience/add/_utils/mapAnalyzeResponseToBasicInfoForm.test.ts' \
  'src/app/(pages)/experience/add/_utils/mapExperienceAddFormToCreateRequest.test.ts' \
  'src/app/(pages)/experience/add/_utils/experienceAddValidation.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
```

Expected:

```txt
Test Suites: 9 passed, 9 total
```

- [ ] **Step 3: Run lint for changed test files**

Run:

```bash
pnpm exec eslint \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
```

Expected: command exits with status `0`.

- [ ] **Step 4: Run prettier check for changed files**

Run:

```bash
pnpm exec prettier --check \
  package.json \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddStep.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddForm.test.ts' \
  'src/app/(pages)/experience/add/_hooks/useExperienceAddMaterials.test.ts'
```

Expected:

```txt
All matched files use Prettier code style!
```

- [ ] **Step 5: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected:

```txt
## refactor/#163-experience-hook-tests...origin/refactor/#163-experience-hook-tests [ahead N]
```

No unstaged changes should remain.

---

## Self-Review

- Spec coverage:
  - `useExperienceAddStep`: covered by Task 2.
  - `useExperienceAddForm`: covered by Task 3.
  - `useExperienceAddMaterials`: covered by Task 4.
  - `useExperienceAddActions`: intentionally excluded and documented as out of scope.
- Placeholder scan:
  - No `TBD`, `TODO`, or unspecified test steps remain.
- Type consistency:
  - Test helpers use existing `ExperienceAnalyzeResponse`, `ExperienceAddBasicInfoForm`, `PdfMaterial`, and `ExperienceMaterial` types.
  - All Jest commands use `--runTestsByPath` because route group paths contain parentheses.
