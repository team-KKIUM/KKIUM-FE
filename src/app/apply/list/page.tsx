import { ApplyAddJobPostingModal } from './_components/ApplyAddJobPostingModal';
import { ApplyListSection } from './_components/ApplyListSection';
import { applyListMockData } from './_constants/applyListMockData';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchBar } from '@/components/common/SearchBar';

export default function ApplyListPage() {
  const hasCards = applyListMockData.length > 0;

  return (
    <section className="w-full px-40">
      <div className="flex w-full min-w-0 max-w-[1560px] flex-col gap-5">
        <h1 className="max-w-[687px] text-2xl font-extrabold leading-9 text-gray-main">
          지원 관리
        </h1>

        <div className="flex w-full min-w-0 items-center">
          <SearchBar
            placeholder="공고명, 기업명, 모집 분야를 검색해주세요"
            className="h-11 w-[551px]"
          />
          <div className="ml-auto shrink-0">
            <ApplyAddJobPostingModal />
          </div>
        </div>

        {hasCards ? (
          <ApplyListSection cards={applyListMockData} />
        ) : (
          <EmptyState
            className="h-[823px] w-full py-64"
            illustrationLabel="생성된 공고 없음"
            title="아직 생성된 공고가 없어요"
            description="공고를 추가해 파일에 끼워넣어볼까요?"
          />
        )}
      </div>
    </section>
  );
}
