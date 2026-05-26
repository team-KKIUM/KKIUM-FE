'use client';

import Image from 'next/image';
import * as React from 'react';

import { ModalDescription, ModalTitle } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { JobPostingUrlValidation } from '@/hooks/apply/useJobPostingUrlField';

export interface ApplyAddJobPostingUrlStepProps {
  url: string;
  setUrl: (value: string) => void;
  validation: JobPostingUrlValidation;
  showError: boolean;
  markTouched: () => void;
  maxLength: number;
  errorId: string;
  onRequestManual: () => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
  isAnalyzing?: boolean;
  analyzeError?: string | null;
  isOcrAnalyzing?: boolean;
  onImageFileSelected?: (file: File) => void;
}

export function ApplyAddJobPostingUrlStep({
  url,
  setUrl,
  validation,
  showError,
  markTouched,
  maxLength,
  errorId,
  onRequestManual,
  onAnalyze,
  canAnalyze,
  isAnalyzing = false,
  analyzeError,
  isOcrAnalyzing = false,
  onImageFileSelected,
}: ApplyAddJobPostingUrlStepProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const hasSelectedImage = selectedImagePreviewUrl != null;
  const shouldShowUrlError = showError && !validation.ok && !hasSelectedImage;
  const canSubmitAnalyze = canAnalyze || hasSelectedImage;
  const disabledAnalyze = !canSubmitAnalyze || isAnalyzing || isOcrAnalyzing;

  React.useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl);
      }
    };
  }, [selectedImagePreviewUrl]);

  const isSupportedImageFile = React.useCallback((file: File) => {
    const lowerName = file.name.toLowerCase();
    const hasSupportedExtension =
      lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png');
    const hasSupportedMimeType = file.type === '' || file.type === 'image/jpeg' || file.type === 'image/png';

    return hasSupportedExtension && hasSupportedMimeType;
  }, []);

  const handleImageFileSelect = React.useCallback(
    (file: File | null) => {
      if (!file) return;

      if (!isSupportedImageFile(file)) {
        setSelectedImagePreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setFileError('jpg, jpeg, png 형식만 업로드할 수 있어요.');
        return;
      }

      setSelectedImagePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setFileError(null);
      onImageFileSelected?.(file);
    },
    [isSupportedImageFile, onImageFileSelected],
  );

  return (
    <>
      <div className="flex w-full min-w-0 items-start justify-between pr-10">
        <div className="flex min-w-0 flex-col gap-0.5">
          <ModalTitle className="text-strong">공고 등록</ModalTitle>
          <ModalDescription>지원하고 싶은 기업의 공고 링크를 입력해주세요</ModalDescription>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          <label htmlFor="apply-job-posting-url" className="title-2-bold text-strong">
            공고 링크
          </label>
          <div className="flex flex-col gap-1.5">
            <Input
              id="apply-job-posting-url"
              type="url"
              inputMode="url"
              name="jobPostingUrl"
              autoComplete="url"
              value={url}
              maxLength={maxLength}
              aria-invalid={shouldShowUrlError}
              aria-describedby={shouldShowUrlError ? errorId : undefined}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={markTouched}
              placeholder="링크를 입력해주세요"
            />
            {shouldShowUrlError ? (
              <p id={errorId} className="body-3-regular text-red-700" role="alert">
                {validation.error}
              </p>
            ) : null}
            {analyzeError ? (
              <p className="body-3-regular text-red-700" role="alert">
                {analyzeError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="body-1-bold text-quaternary">공고 링크가 없나요?</span>
          <button
            type="button"
            className="body-1-bold text-secondary underline underline-offset-4 hover:text-strong"
            onClick={onRequestManual}
          >
            공고 직접 등록하기
          </button>
        </div>

        <div className="flex w-full flex-col items-start gap-4">
          <h3 className="title-2-bold text-strong">공고 이미지 추가</h3>
          <input
            ref={imageInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(event) => {
              handleImageFileSelect(event.currentTarget.files?.[0] ?? null);
              event.currentTarget.value = '';
            }}
          />
          <div
            className={`relative flex h-72 w-full flex-col items-center justify-start overflow-hidden rounded-lg border border-dashed ${
              isDragOver ? 'border-gray-700 bg-gray-50' : 'border-gray-500 bg-gray-100'
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDragOver(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDragOver(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDragOver(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDragOver(false);
              handleImageFileSelect(event.dataTransfer.files?.[0] ?? null);
            }}
          >
            {selectedImagePreviewUrl ? (
              <>
                <Image
                  src={selectedImagePreviewUrl}
                  alt="업로드한 공고 이미지 미리보기"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-black/45 px-4 py-3">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-background-w px-3 text-base font-bold leading-6 text-strong hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-w"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    이미지 변경
                  </button>
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-start gap-3 px-5 pt-0 text-center">
                <Image
                  src="/null.svg"
                  alt=""
                  width={132}
                  height={100}
                  className="h-24 w-32 object-contain"
                />
                <div className="flex flex-col items-center gap-1">
                  <p className="body-1-bold text-strong">공고 이미지 파일 업로드</p>
                  <p className="body-1-regular text-gray-700">
                    파일을 선택하거나 드래그 앤 드롭으로 파일을 추가해주세요
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center overflow-hidden rounded-lg bg-gray-main px-2.5 py-0.5 text-xs font-bold leading-5 text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                  onClick={() => imageInputRef.current?.click()}
                >
                  공고 이미지 업로드
                </button>
              </div>
            )}
            {!selectedImagePreviewUrl ? (
              <p className="mt-2 body-1-regular text-gray-700">jpg, jpeg, png 형식만 지원해요</p>
            ) : null}
          </div>
          {fileError ? <p className="body-2-regular text-red-700">{fileError}</p> : null}
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="default"
        disabled={disabledAnalyze}
        className="w-full text-base font-bold leading-5"
        onClick={onAnalyze}
      >
        {isOcrAnalyzing ? '이미지 분석 중...' : isAnalyzing ? '공고 분석 중...' : '공고 분석하기'}
      </Button>
    </>
  );
}
