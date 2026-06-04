'use client';

import Image from 'next/image';
import * as React from 'react';

import { JOB_POSTING_PRIMARY_BUTTON_CLASS } from '@/app/(pages)/apply/_constants/applyConstants';
import { ModalDescription, ModalTitle } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { JobPostingUrlValidation } from '@/hooks/apply/useJobPostingUrlField';

const IMAGE_PREVIEW_ACTION_BUTTON_CLASS =
  'inline-flex h-9 items-center justify-center gap-1 overflow-hidden rounded-lg border border-border-default bg-background-w px-2.5 py-0.5 body-3-bold outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-border-default';

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
  onImageFileChange?: (file: File | null) => void;
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
  onImageFileChange,
}: ApplyAddJobPostingUrlStepProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const hasSelectedImage = selectedImagePreviewUrl != null;
  const hasUrl = url.trim().length > 0;
  const isUrlInputDisabled = hasSelectedImage;
  const isImageUploadDisabled = hasUrl;
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
    const hasSupportedMimeType =
      file.type === '' || file.type === 'image/jpeg' || file.type === 'image/png';

    return hasSupportedExtension && hasSupportedMimeType;
  }, []);

  const clearSelectedImage = React.useCallback(() => {
    setSelectedImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFileError(null);
    onImageFileChange?.(null);
  }, [onImageFileChange]);

  const handleImageFileSelect = React.useCallback(
    (file: File | null) => {
      if (!file) return;

      if (!isSupportedImageFile(file)) {
        clearSelectedImage();
        setFileError('jpg, jpeg, png 형식만 업로드할 수 있어요.');
        return;
      }

      setUrl('');
      setSelectedImagePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setFileError(null);
      onImageFileChange?.(file);
    },
    [clearSelectedImage, isSupportedImageFile, onImageFileChange, setUrl],
  );

  const handleUrlChange = (value: string) => {
    setUrl(value);

    if (value.trim()) {
      clearSelectedImage();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full min-w-0 shrink-0 items-start justify-between pr-10">
        <div className="flex min-w-0 flex-col gap-0.5">
          <ModalTitle className="text-strong">공고 등록</ModalTitle>
          <ModalDescription>지원하고 싶은 기업의 공고 링크를 입력해주세요</ModalDescription>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-1">
        <div className="flex w-full shrink-0 flex-col gap-4">
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
              disabled={isUrlInputDisabled}
              aria-invalid={shouldShowUrlError}
              aria-describedby={shouldShowUrlError ? errorId : undefined}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={markTouched}
              placeholder="링크를 입력해주세요"
            />
            {isUrlInputDisabled ? (
              <p className="body-3-regular text-tertiary">
                이미지를 업로드하면 링크 입력은 사용할 수 없어요.
              </p>
            ) : null}
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

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="body-1-bold text-quaternary">공고 링크가 없나요?</span>
          <button
            type="button"
            className="body-1-bold text-secondary underline underline-offset-4 hover:text-strong"
            onClick={onRequestManual}
          >
            공고 직접 등록하기
          </button>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3">
          <h3 className="title-2-bold text-strong">공고 이미지 추가</h3>
          {isImageUploadDisabled ? (
            <p className="body-3-regular text-tertiary">
              링크를 입력하면 이미지 업로드는 사용할 수 없어요.
            </p>
          ) : null}
          <input
            ref={imageInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            disabled={isImageUploadDisabled}
            onChange={(event) => {
              handleImageFileSelect(event.currentTarget.files?.[0] ?? null);
              event.currentTarget.value = '';
            }}
          />
          <div
            className={cn(
              'relative flex h-72 w-full overflow-hidden rounded-lg',
              hasSelectedImage
                ? 'outline-1 -outline-offset-1 outline-gray-500'
                : cn(
                    'items-center justify-center border border-dashed',
                    isDragOver ? 'border-gray-700 bg-gray-50' : 'border-gray-500 bg-gray-100',
                    isImageUploadDisabled && 'pointer-events-none opacity-50',
                  ),
            )}
            onDragEnter={(event) => {
              if (isImageUploadDisabled) return;
              event.preventDefault();
              event.stopPropagation();
              setIsDragOver(true);
            }}
            onDragOver={(event) => {
              if (isImageUploadDisabled) return;
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
              if (isImageUploadDisabled) return;
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
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-neutral-700/0 to-neutral-700/60"
                  aria-hidden
                />
                <div className="absolute right-4 bottom-4 flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(IMAGE_PREVIEW_ACTION_BUTTON_CLASS, 'text-red-300')}
                    onClick={clearSelectedImage}
                  >
                    이미지 제거
                  </button>
                  <button
                    type="button"
                    className={cn(IMAGE_PREVIEW_ACTION_BUTTON_CLASS, 'text-tertiary')}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    이미지 변경
                  </button>
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-3 px-5 text-center">
                <Image
                  src="/empty-state.svg"
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
                  disabled={isImageUploadDisabled}
                  className="inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-gray-main px-3 body-3-bold text-on-fill hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => imageInputRef.current?.click()}
                >
                  공고 이미지 업로드
                </button>
                <p className="body-1-regular text-gray-700">jpg, jpeg, png 형식만 지원해요</p>
              </div>
            )}
          </div>
          {fileError ? <p className="body-2-regular text-red-700">{fileError}</p> : null}
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="default"
        disabled={disabledAnalyze}
        className={JOB_POSTING_PRIMARY_BUTTON_CLASS}
        onClick={onAnalyze}
      >
        {isOcrAnalyzing ? '이미지 분석 중...' : isAnalyzing ? '공고 분석 중...' : '공고 분석하기'}
      </Button>
    </div>
  );
}
