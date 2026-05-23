'use client';

import { useEffect, useState } from 'react';

import { ExperienceAddMaterialSelectView } from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialSelectView';
import { ExperienceAddNotionConnectView } from '@/app/(pages)/experience/add/_components/ExperienceAddNotionConnectView';
import { ExperienceAddNotionPageSelectView } from '@/app/(pages)/experience/add/_components/ExperienceAddNotionPageSelectView';
import { ApiError } from '@/app/api/client';
import { ModalDescription, ModalTitle } from '@/components/common/Modal';
import { useNotionPages } from '@/hooks/experience/useExperienceAdd';

export interface PdfMaterial {
  id: string;
  type: 'pdf';
  file: File;
  name: string;
  size: number;
  status: 'completed';
}

export interface NotionMaterial {
  id: string;
  type: 'notion';
  pageId: string;
  title: string;
  updatedAt?: string;
}

export type ExperienceMaterial = PdfMaterial | NotionMaterial;
export type ExperienceAddMaterialModalView = 'material' | 'notion-connect' | 'notion-pages';

interface ExperienceAddMaterialModalProps {
  materials: ExperienceMaterial[];
  initialView?: ExperienceAddMaterialModalView;
  onSave: (materials: ExperienceMaterial[]) => void;
}

export function ExperienceAddMaterialModal({
  materials,
  initialView = 'material',
  onSave,
}: ExperienceAddMaterialModalProps) {
  const [modalView, setModalView] = useState<ExperienceAddMaterialModalView>(initialView);
  const [draftMaterials, setDraftMaterials] = useState<ExperienceMaterial[]>(materials);
  const [isPdfAddedInCurrentSession, setIsPdfAddedInCurrentSession] = useState(false);
  const notionPagesQuery = useNotionPages({ enabled: modalView === 'notion-pages' });
  const notionPages = notionPagesQuery.data?.pages ?? [];
  const hasDraftPdf = draftMaterials.some((material) => material.type === 'pdf');

  useEffect(() => {
    setModalView(initialView);
  }, [initialView]);

  useEffect(() => {
    setDraftMaterials(materials.filter((material) => material.type !== 'pdf'));
    setIsPdfAddedInCurrentSession(false);
  }, [materials]);

  useEffect(() => {
    if (!(notionPagesQuery.error instanceof ApiError)) return;
    if (notionPagesQuery.error.code !== 'N002') return;
    setModalView('notion-connect');
  }, [notionPagesQuery.error]);

  const selectedNotionPageIds = draftMaterials
    .filter((material): material is NotionMaterial => material.type === 'notion')
    .map((material) => material.pageId);

  const handlePdfFilesAdd = (files: File[]) => {
    const file = files[0];

    if (!file) return;

    const pdfMaterial: PdfMaterial = {
      id: `${file.name}-${file.lastModified}-${file.size}`,
      type: 'pdf',
      file,
      name: file.name,
      size: file.size,
      status: 'completed',
    };

    setDraftMaterials((currentMaterials) => [
      ...currentMaterials.filter((material) => material.type !== 'pdf'),
      pdfMaterial,
    ]);
    setIsPdfAddedInCurrentSession(true);
  };

  const handleMaterialRemove = (materialId: string) => {
    setDraftMaterials((currentMaterials) =>
      currentMaterials.filter((material) => material.id !== materialId),
    );
  };

  const handleNotionPageToggle = (pageId: string) => {
    const page = notionPages.find((notionPage) => notionPage.pageId === pageId);

    if (!page) return;

    setDraftMaterials((currentMaterials) => {
      const isSelected = currentMaterials.some((material) => material.id === page.pageId);

      const materialsWithoutNotion = currentMaterials.filter(
        (material) => material.type !== 'notion',
      );

      if (isSelected) {
        return materialsWithoutNotion;
      }

      return [
        ...materialsWithoutNotion,
        {
          id: page.pageId,
          type: 'notion',
          pageId: page.pageId,
          title: page.title,
        },
      ];
    });
  };

  const handleSave = () => {
    const hiddenPdfMaterials = hasDraftPdf
      ? []
      : materials.filter((material) => material.type === 'pdf');

    onSave([...hiddenPdfMaterials, ...draftMaterials]);
  };

  return (
    <>
      {modalView === 'notion-pages' ? (
        <ExperienceAddNotionPageSelectView
          pages={notionPages}
          isLoading={notionPagesQuery.isPending}
          errorMessage={
            notionPagesQuery.isError && notionPagesQuery.error instanceof Error
              ? notionPagesQuery.error.message
              : undefined
          }
          selectedPageIds={selectedNotionPageIds}
          onBack={() => setModalView('material')}
          onConnectMore={() => setModalView('notion-connect')}
          onPageToggle={handleNotionPageToggle}
          onSave={handleSave}
        />
      ) : (
        <>
          <ExperienceAddMaterialModalHeader />

          {modalView === 'notion-connect' ? (
            <ExperienceAddNotionConnectView />
          ) : (
            <ExperienceAddMaterialSelectView
              materials={draftMaterials}
              hideNotionConnect={isPdfAddedInCurrentSession && hasDraftPdf}
              onMaterialRemove={handleMaterialRemove}
              onNotionConnect={() => setModalView('notion-connect')}
              onPdfFilesAdd={handlePdfFilesAdd}
              onSave={handleSave}
            />
          )}
        </>
      )}
    </>
  );
}

function ExperienceAddMaterialModalHeader() {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col gap-0.5">
        <ModalTitle>자료 추가하기</ModalTitle>
        <ModalDescription>자료를 업로드해 경험을 추가할 수 있어요</ModalDescription>
      </div>
    </div>
  );
}
