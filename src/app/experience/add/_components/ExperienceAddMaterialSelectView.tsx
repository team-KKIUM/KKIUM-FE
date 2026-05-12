import { LogoIcon } from '@/components/common/icons/LogoIcon';
import { NotionIcon } from '@/components/common/icons/NotionIcon';
import { Button } from '@/components/ui/button';

interface ExperienceAddMaterialSelectViewProps {
  onNotionConnect: () => void;
}

export function ExperienceAddMaterialSelectView({
  onNotionConnect,
}: ExperienceAddMaterialSelectViewProps) {
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

          <div className="flex h-[274px] w-full flex-col items-center justify-between rounded-lg border border-dashed border-gray-500 bg-gray-100 py-5">
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <LogoIcon />
              <div className="flex flex-col items-center gap-1">
                <p className="body-1-bold text-strong">PDF 파일 업로드</p>
                <p className="body-2-regular text-gray-700">
                  파일을 선택하거나 드래그 앤 드롭으로 파일을 추가해주세요
                </p>
              </div>
              <Button type="button" size="small" className="h-9 w-[113px] label-3-bold">
                PDF 업로드
              </Button>
            </div>
            <p className="text-center body-2-regular text-gray-700">
              HWP, DOC, DOCK 형식은 지원하지 않아요.
            </p>
          </div>
        </section>

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
      </div>

      <Button type="button" className="h-10 w-full" disabled>
        저장하기
      </Button>
    </>
  );
}
