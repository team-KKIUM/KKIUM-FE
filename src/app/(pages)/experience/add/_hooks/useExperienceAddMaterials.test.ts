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
    const notionMaterial = createNotionMaterial();
    let resolveDraft: (material: PdfMaterial) => void = () => {};

    getExperienceAddPdfDraftMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDraft = resolve;
      }),
    );

    const { result } = renderHook(() => useExperienceAddMaterials());

    act(() => {
      result.current.setMaterials([existingPdf, notionMaterial]);
    });

    await act(async () => {
      resolveDraft(restoredPdf);
    });

    await waitFor(() => {
      expect(result.current.materials).toEqual([existingPdf, notionMaterial]);
    });
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
