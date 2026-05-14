'use client';

import { useState } from 'react';

import { Modal, ModalDescription, ModalTitle } from '@/components/common/Modal';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ApplyAddJobPostingModal() {
  const [url, setUrl] = useState('');

  return (
    <Modal
      showCloseButton
      trigger={
        <Button type="button" variant="default" size="default" leftIcon={<PlusIcon />}>
          지원 추가
        </Button>
      }
    >
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
          <Input
            id="apply-job-posting-url"
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="링크를 입력해주세요"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="body-1-bold text-quaternary">공고 링크가 없나요?</span>
          <button
            type="button"
            className="body-1-bold text-secondary underline underline-offset-4 hover:text-strong"
          >
            공고 직접 등록하기
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="flex h-10 w-full shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-3 py-1 text-xs font-bold leading-5 text-gray-400"
      >
        공고 분석하기
      </button>
    </Modal>
  );
}
