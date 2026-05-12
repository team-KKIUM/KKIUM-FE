import { NotionIcon } from '@/components/common/icons/NotionIcon';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';

export function ExperienceAddNotionConnectView() {
  return (
    <div className="flex h-[474px] w-full flex-col items-center justify-center gap-3 py-[79px]">
      <NotionIcon className="size-[60.25px]" />

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="body-1-bold text-strong">노션 연결하기</p>
        <div className="body-2-regular text-gray-700">
          <p>추가하고 싶은 페이지를 선택하면</p>
          <p>자동으로 자료를 가져옵니다.</p>
        </div>
      </div>

      <Button type="button" size="small" className="h-9 px-2.5 label-3-bold" leftIcon={<PlusIcon />}>
        노션 연결하기
      </Button>
    </div>
  );
}
