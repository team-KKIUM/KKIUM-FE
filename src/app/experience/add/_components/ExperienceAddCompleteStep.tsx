'use client';

import { useRouter } from 'next/navigation';

import { ExperienceAddCompleteIcon } from '@/components/common/icons/ExperienceAddCompleteIcon';
import { Button } from '@/components/ui/button';

export function ExperienceAddCompleteStep() {
  const router = useRouter();

  return (
    <section
      aria-labelledby="experience-add-complete-title"
      className="flex w-full flex-1 flex-col items-center justify-center gap-6 rounded-xl border border-border-default bg-background-w px-[30px]"
    >
      <div className="flex flex-col items-center gap-6">
        <ExperienceAddCompleteIcon className="h-[162px] w-[176px]" />
        <div className="flex flex-col items-center gap-1">
          <h2 id="experience-add-complete-title" className="body-1-bold text-strong">
            경험 추가가 완료되었습니다!
          </h2>
          <p className="body-2-regular text-gray-700">
            경험 관리로 돌아가 추가된 경험을 확인해보세요.
          </p>
        </div>
      </div>

      <Button type="button" className="w-40" onClick={() => router.push('/experience')}>
        경험관리로 이동하기
      </Button>
    </section>
  );
}
