'use client';

import Image from 'next/image';
import { useRef } from 'react';

import type { ExperienceMaterial } from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import { LogoIcon } from '@/components/common/icons/LogoIcon';
import { NotionIcon } from '@/components/common/icons/NotionIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { ModalClose } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExperienceAddMaterialSelectViewProps {
  materials: ExperienceMaterial[];
  hideNotionConnect?: boolean;
  onMaterialRemove: (materialId: string) => void;
  onNotionConnect: () => void;
  onPdfFilesAdd: (files: File[]) => void;
  onSave: () => void;
}

export function ExperienceAddMaterialSelectView({
  materials,
  hideNotionConnect = false,
  onMaterialRemove,
  onNotionConnect,
  onPdfFilesAdd,
  onSave,
}: ExperienceAddMaterialSelectViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfMaterials = materials.filter((material) => material.type === 'pdf');
  const canSave = materials.length > 0;

  const addPdfFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const pdfFiles = Array.from(fileList).filter(
      (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
    );

    if (pdfFiles.length > 0) {
      onPdfFilesAdd(pdfFiles);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <section
          className="flex w-full flex-col gap-2.5"
          aria-labelledby="experience-add-pdf-title"
        >
          <h3 id="experience-add-pdf-title" className="title-1-bold text-[#050505]">
            PDF
          </h3>

          <div
            className="flex h-[274px] w-full flex-col items-center justify-between rounded-lg border border-dashed border-gray-500 bg-gray-100 py-5"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addPdfFiles(event.dataTransfer.files);
            }}
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <LogoIcon />
              <div className="flex flex-col items-center gap-1">
                <p className="body-1-bold text-strong">PDF 파일 업로드</p>
                <p className="body-2-regular text-gray-700">
                  파일을 선택하거나 드래그 앤 드롭으로 파일을 추가해주세요
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(event) => {
                  addPdfFiles(event.currentTarget.files);
                  event.currentTarget.value = '';
                }}
              />
              <Button
                type="button"
                size="medium"
                className="w-[115px] pr-2 pl-2.5 label-3-bold"
                onClick={() => fileInputRef.current?.click()}
              >
                PDF 업로드
              </Button>
            </div>
            <p className="text-center body-2-regular text-gray-700">
              HWP, DOC, DOCX 형식은 지원하지 않아요.
            </p>
          </div>
        </section>

        {pdfMaterials.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {pdfMaterials.map((material) => (
              <UploadedPdfCard
                key={material.id}
                name={material.name}
                size={material.size}
                onRemove={() => onMaterialRemove(material.id)}
              />
            ))}
          </div>
        )}

        {!hideNotionConnect && (
          <section className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-5">
            <div className="flex items-center gap-5">
              <div className="flex size-[52px] shrink-0 items-center justify-center rounded-sm bg-gray-100">
                <NotionIcon className="size-8" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="body-1-bold text-strong">Notion</p>
                <p className="body-2-regular text-gray-700">
                  노션에서 페이지와 워크스페이스에서 파일을 가져오세요
                </p>
              </div>
            </div>
            <Button type="button" className="h-9 w-[118px] label-3-bold" onClick={onNotionConnect}>
              노션에서 가져오기
            </Button>
          </section>
        )}
      </div>

      <ModalClose asChild>
        <Button type="button" className="h-10 w-full" disabled={!canSave} onClick={onSave}>
          저장하기
        </Button>
      </ModalClose>
    </>
  );
}

interface UploadedPdfCardProps {
  name: string;
  size: number;
  onRemove: () => void;
}

function UploadedPdfCard({ name, size, onRemove }: UploadedPdfCardProps) {
  const fileSize = formatFileSize(size);

  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-gray-50 px-2.5 py-2">
      <div className="flex size-10 shrink-0 items-center justify-center">
        <Image src="/pdf.svg" alt="" width={22} height={28} className="h-7 w-[22px]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate body-1-bold text-strong">{name}</p>
        <p className="body-2-bold text-gray-600">
          {fileSize} 중 {fileSize}
        </p>
      </div>
      <button
        type="button"
        aria-label={`${name} 삭제`}
        className={cn(
          'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-gray-600',
          'transition-colors hover:bg-gray-100 hover:text-strong focus-visible:shadow-focus-ring focus-visible:outline-none',
        )}
        onClick={onRemove}
      >
        <XIcon className="size-5" />
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
