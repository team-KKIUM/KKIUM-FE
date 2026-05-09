import { ApplyListSection } from './_components/ApplyListSection';
import { NullList } from './_components/NullList';
import { applyListMockData } from './_constants/applyListMockData';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';

export default function ApplyListPage() {
  const hasCards = applyListMockData.length > 0;

  return (
    <main className="w-full px-40">
      <div className="flex w-full min-w-0 max-w-[1560px] flex-col gap-5">
        <SearchBar
          placeholder="공고명, 기업명, 모집 분야를 검색해주세요"
          className="h-11 w-[551px]"
        />

        <div className="inline-flex w-full items-start justify-between self-stretch">
          <h1 className="max-w-[687px] text-2xl font-extrabold leading-9 text-gray-main">
            지원 관리
          </h1>
          <Button type="button" variant="default" size="default" leftIcon={<PlusIcon />}>
            지원 추가
          </Button>
        </div>

        {hasCards ? (
          <ApplyListSection cards={applyListMockData} />
        ) : (
          <NullList />
        )}
      </div>
    </main>
  );
}
