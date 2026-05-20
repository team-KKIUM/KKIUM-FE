'use client';

import { useEffect, useState } from 'react';

import { ExperienceAddMaterialSelectView } from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialSelectView';
import { ExperienceAddNotionConnectView } from '@/app/(pages)/experience/add/_components/ExperienceAddNotionConnectView';
import { ExperienceAddNotionPageSelectView } from '@/app/(pages)/experience/add/_components/ExperienceAddNotionPageSelectView';
import { ModalDescription, ModalTitle } from '@/components/common/Modal';

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
  updatedAt: string;
}

export type ExperienceMaterial = PdfMaterial | NotionMaterial;

interface ExperienceAddMaterialModalProps {
  materials: ExperienceMaterial[];
  onSave: (materials: ExperienceMaterial[]) => void;
}

const notionPages = Array.from({ length: 9 }, (_, index) => ({
  pageId: `notion-page-${index + 1}`,
  title: '[쟁점한국현대사] 건국절 논란',
  updatedAt: '2026.4.7.',
}));

export function ExperienceAddMaterialModal({ materials, onSave }: ExperienceAddMaterialModalProps) {
  const [modalView, setModalView] = useState<'material' | 'notion-connect' | 'notion-pages'>(
    'material',
  );
  const [draftMaterials, setDraftMaterials] = useState<ExperienceMaterial[]>(materials);

  useEffect(() => {
    setDraftMaterials(materials);
  }, [materials]);

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

    setDraftMaterials([pdfMaterial]);
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

      if (isSelected) {
        return [];
      }

      return [
        {
          id: page.pageId,
          type: 'notion',
          pageId: page.pageId,
          title: page.title,
          updatedAt: page.updatedAt,
        },
      ];
    });
  };

  const handleSave = () => {
    onSave(draftMaterials);
  };

  return (
    <>
      {modalView === 'notion-pages' ? (
        <ExperienceAddNotionPageSelectView
          pages={notionPages}
          selectedPageIds={selectedNotionPageIds}
          onBack={() => setModalView('material')}
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
