'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ReactNode } from 'react';

import type {
  ExperienceAddMaterialModalProps,
  ExperienceAddMaterialModalView,
  ExperienceMaterial,
  PdfMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import {
  clearExperienceAddPdfDraft,
  saveExperienceAddPdfDraft,
} from '@/app/(pages)/experience/add/_utils/experienceAddPdfDraftStorage';
import {
  formatLastEditedTime,
  getNotionTagTone,
  getNotionTypeLabel,
  NotionPageIcon,
} from '@/app/(pages)/experience/add/_utils/notionPageDisplay';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { Tag } from '@/components/common/Tag';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { Button } from '@/components/ui/button';

const ExperienceAddMaterialModal = dynamic<ExperienceAddMaterialModalProps>(
  () =>
    import('@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal').then(
      (mod) => mod.ExperienceAddMaterialModal,
    ),
  {
    ssr: false,
    loading: ExperienceAddMaterialModalLoading,
  },
);

interface ExperienceAddUploadStepProps {
  materials: ExperienceMaterial[];
  isMaterialModalOpen: boolean;
  materialModalInitialView: ExperienceAddMaterialModalView;
  onMaterialModalOpenChange: (isOpen: boolean) => void;
  onMaterialModalInitialViewChange: (view: ExperienceAddMaterialModalView) => void;
  onMaterialsChange: (materials: ExperienceMaterial[]) => void;
}

export function ExperienceAddUploadStep({
  materials,
  isMaterialModalOpen,
  materialModalInitialView,
  onMaterialModalOpenChange,
  onMaterialModalInitialViewChange,
  onMaterialsChange,
}: ExperienceAddUploadStepProps) {
  const notionMaterials = materials.filter((material) => material.type === 'notion');
  const pdfMaterials = materials.filter((material) => material.type === 'pdf');
  const hasMaterials = materials.length > 0;
  const isMaterialAddDisabled = notionMaterials.length > 0 && pdfMaterials.length > 0;

  const removeMaterial = (materialId: string) => {
    const removedMaterial = materials.find((material) => material.id === materialId);

    if (removedMaterial?.type === 'pdf') {
      void clearExperienceAddPdfDraft().catch((error: unknown) => {
        console.warn('PDF 임시 저장 데이터를 삭제하지 못했습니다.', error);
      });
    }

    onMaterialsChange(materials.filter((material) => material.id !== materialId));
  };

  const saveMaterials = (nextMaterials: ExperienceMaterial[]) => {
    const pdfMaterial = nextMaterials.find(
      (material): material is PdfMaterial => material.type === 'pdf',
    );

    if (pdfMaterial) {
      void saveExperienceAddPdfDraft(pdfMaterial).catch((error: unknown) => {
        console.warn('PDF 임시 저장 데이터를 저장하지 못했습니다.', error);
      });
    } else {
      void clearExperienceAddPdfDraft().catch((error: unknown) => {
        console.warn('PDF 임시 저장 데이터를 삭제하지 못했습니다.', error);
      });
    }

    onMaterialsChange(nextMaterials);
    onMaterialModalOpenChange(false);
  };

  return (
    <section
      aria-labelledby="experience-add-upload-title"
      className="flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-border-default bg-background-w px-[30px] py-5"
    >
      <div className="flex flex-col gap-1">
        <p className="title-2-bold text-mint-300">Step1</p>
        <div className="flex flex-col gap-0.5">
          <h2 id="experience-add-upload-title" className="heading-3-bold text-[#050505]">
            자료 업로드
          </h2>
          <p className="body-2-regular text-gray-700">
            경험과 관련된 자료를 업로드해주세요. 자료가 많을수록 더 정확한 분석이 가능합니다.
            <br />
            자료 업로드가 필요하지 않은 경험이라면 다음단계로 바로 넘어가주세요.
          </p>
        </div>
      </div>

      <Modal
        open={isMaterialModalOpen}
        showCloseButton
        onOpenChange={onMaterialModalOpenChange}
        trigger={
          <Button
            type="button"
            className="label-3-bold"
            leftIcon={<PlusIcon />}
            disabled={isMaterialAddDisabled}
            onClick={() => onMaterialModalInitialViewChange('material')}
          >
            자료 추가하기
          </Button>
        }
      >
        <ExperienceAddMaterialModal
          materials={materials}
          initialView={materialModalInitialView}
          onSave={saveMaterials}
        />
      </Modal>

      {hasMaterials ? (
        <div className="flex w-full flex-col gap-4">
          {notionMaterials.length > 0 && (
            <ExperienceMaterialSection title="Notion">
              {notionMaterials.map((material) => (
                <ExperienceMaterialCard
                  key={material.id}
                  material={material}
                  onRemove={() => removeMaterial(material.id)}
                />
              ))}
            </ExperienceMaterialSection>
          )}

          {pdfMaterials.length > 0 && (
            <ExperienceMaterialSection title="PDF 파일">
              {pdfMaterials.map((material) => (
                <ExperienceMaterialCard
                  key={material.id}
                  material={material}
                  onRemove={() => removeMaterial(material.id)}
                />
              ))}
            </ExperienceMaterialSection>
          )}
        </div>
      ) : (
        <div className="h-[357px] w-full rounded-lg bg-gray-100 py-5">
          <EmptyState
            title="아직 추가한 경험이 없어요"
            description="지금 당장 파일이 없다면 다음 단계로 바로 넘어가도 괜찮아요!"
          />
        </div>
      )}
    </section>
  );
}

function ExperienceAddMaterialModalLoading() {
  return (
    <div className="flex min-h-[360px] w-full animate-pulse flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-32 rounded bg-gray-200" />
        <div className="h-5 w-56 rounded bg-gray-100" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[180px] rounded-xl bg-gray-100" />
        <div className="h-[180px] rounded-xl bg-gray-100" />
      </div>
      <div className="ml-auto h-10 w-24 rounded bg-gray-200" />
    </div>
  );
}

function ExperienceMaterialSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="flex w-full flex-col gap-2" aria-label={title}>
      <h3 className="title-1-bold text-strong">{title}</h3>
      <div className="flex w-full flex-col gap-2.5">{children}</div>
    </section>
  );
}

function ExperienceMaterialCard({
  material,
  onRemove,
}: {
  material: ExperienceMaterial;
  onRemove: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-sm">
          {material.type === 'pdf' ? (
            <Image src="/pdf-file.svg" alt="" width={22} height={28} className="h-7 w-[22px]" />
          ) : (
            <NotionPageIcon icon={material.icon} />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate body-1-bold text-strong">
            {material.type === 'pdf' ? material.name : material.title}
          </p>
          {material.type === 'pdf' ? (
            <p className="body-2-bold text-gray-600">
              {formatFileSize(material.size)} 중 {formatFileSize(material.size)}
            </p>
          ) : (
            <div className="flex items-center gap-2.5">
              <Tag tone={getNotionTagTone(material.notionType)}>
                {getNotionTypeLabel(material.notionType)}
              </Tag>
              <span className="body-2-regular text-gray-600">
                {formatLastEditedTime(material.lastEditedTime)}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={`${material.type === 'pdf' ? material.name : material.title} 자료 삭제`}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-w text-gray-main transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring focus-visible:outline-none"
        onClick={onRemove}
      >
        <XIcon className="size-6" />
      </button>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  return `${Math.round(size / 1024)} KB`;
}
