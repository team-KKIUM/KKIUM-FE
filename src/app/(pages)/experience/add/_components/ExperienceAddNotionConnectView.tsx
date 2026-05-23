import { useState } from 'react';

import { NotionIcon } from '@/components/common/icons/NotionIcon';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { useNotionAuthUrl } from '@/hooks/experience/useExperienceAdd';

export function ExperienceAddNotionConnectView() {
  const notionAuthUrlQuery = useNotionAuthUrl();
  const [errorMessage, setErrorMessage] = useState('');

  const connectNotion = async () => {
    try {
      setErrorMessage('');
      const { data: authUrl } = await notionAuthUrlQuery.refetch();

      if (!authUrl) {
        setErrorMessage('노션 연결 주소를 불러오지 못했습니다. 다시 시도해주세요.');
        return;
      }

      window.location.href = authUrl;
    } catch {
      setErrorMessage('노션 연결 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex h-[474px] w-full flex-col items-center justify-center gap-3">
      <NotionIcon className="size-[60.25px]" />

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="body-1-bold text-strong">노션 연결하기</p>
        <div className="body-2-regular text-gray-700">
          <p>추가하고 싶은 페이지를 선택하면</p>
          <p>자동으로 자료를 가져옵니다.</p>
        </div>
      </div>

      <Button
        type="button"
        size="small"
        className="h-9 px-2.5 label-3-bold"
        disabled={notionAuthUrlQuery.isFetching}
        leftIcon={<PlusIcon />}
        onClick={connectNotion}
      >
        {notionAuthUrlQuery.isFetching ? '연결 중...' : '노션 연결하기'}
      </Button>

      {errorMessage && <p className="body-3-regular text-danger">{errorMessage}</p>}
    </div>
  );
}
