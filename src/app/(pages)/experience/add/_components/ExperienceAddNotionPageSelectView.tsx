import { CheckedBoxIcon } from '@/components/common/icons/CheckedBoxIcon';
import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { EmptyBoxIcon } from '@/components/common/icons/EmptyBoxIcon';
import { NotionIcon } from '@/components/common/icons/NotionIcon';
import { ModalClose, ModalDescription, ModalTitle } from '@/components/common/Modal';
import { Tag } from '@/components/common/Tag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotionPage {
  pageId: string;
  title: string;
  updatedAt?: string;
}

interface ExperienceAddNotionPageSelectViewProps {
  pages: NotionPage[];
  isLoading?: boolean;
  errorMessage?: string;
  selectedPageIds: string[];
  onBack: () => void;
  onConnectMore: () => void;
  onPageToggle: (pageId: string) => void;
  onSave: () => void;
}

export function ExperienceAddNotionPageSelectView({
  pages,
  isLoading = false,
  errorMessage,
  selectedPageIds,
  onBack,
  onConnectMore,
  onPageToggle,
  onSave,
}: ExperienceAddNotionPageSelectViewProps) {
  const canSave = selectedPageIds.length > 0 && !isLoading;

  return (
    <>
      <div className="flex w-full items-start justify-between pr-10">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            aria-label="자료 추가 화면으로 돌아가기"
            className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-strong transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring focus-visible:outline-none"
            onClick={onBack}
          >
            <ChevronLeftIcon className="size-6" />
          </button>
          <div className="flex flex-col gap-0.5">
            <ModalTitle>노션에서 가져오기</ModalTitle>
            <div className="flex flex-wrap items-center gap-x-[19px] gap-y-2">
              <ModalDescription>/홍길동의 Notion</ModalDescription>
              <Button
                type="button"
                variant="secondary"
                size="small"
                className="h-8 px-3 label-3-bold"
                onClick={onConnectMore}
              >
                페이지 추가 연동하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-h-[calc(100dvh-260px)] min-h-[360px] w-full flex-col gap-2 overflow-y-auto">
        {isLoading && (
          <div className="flex min-h-[360px] w-full items-center justify-center rounded-lg bg-gray-50">
            <p className="body-2-regular text-gray-700">노션 페이지를 불러오는 중이에요</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="flex min-h-[360px] w-full items-center justify-center rounded-lg bg-gray-50 px-5 text-center">
            <p className="body-2-regular text-gray-700">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && pages.length === 0 && (
          <div className="flex min-h-[360px] w-full items-center justify-center rounded-lg bg-gray-50">
            <p className="body-2-regular text-gray-700">가져올 수 있는 노션 페이지가 없어요</p>
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          pages.map((page) => {
            const isSelected = selectedPageIds.includes(page.pageId);

            return (
              <button
                key={page.pageId}
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left',
                  'focus-visible:shadow-focus-ring focus-visible:outline-none',
                  isSelected ? 'bg-[#eefffd]' : 'bg-gray-50 hover:bg-gray-100',
                )}
                onClick={() => onPageToggle(page.pageId)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center text-tertiary',
                    isSelected && 'text-mint-500',
                  )}
                >
                  {isSelected ? (
                    <CheckedBoxIcon className="size-6" />
                  ) : (
                    <EmptyBoxIcon className="size-6" />
                  )}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-background-w">
                  <NotionIcon className="size-6" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate body-1-bold text-strong">{page.title}</span>
                  <span className="flex items-center gap-2.5">
                    <Tag tone="competency">페이지</Tag>
                    <span className="body-2-regular text-gray-600">
                      {page.updatedAt ?? '최근 수정일 정보 없음'}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
      </div>

      <div className="w-full pt-2.5">
        <ModalClose asChild>
          <Button
            type="button"
            className="h-10 w-full body-3-bold"
            disabled={!canSave}
            onClick={onSave}
          >
            저장하기
          </Button>
        </ModalClose>
      </div>
    </>
  );
}
