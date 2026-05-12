import { ExperienceAddMaterialModal } from '@/app/experience/add/_components/ExperienceAddMaterialModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';

export function ExperienceAddUploadStep() {
  return (
    <section
      aria-labelledby="experience-add-upload-title"
      className="flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-border-default bg-background-w px-[30px] py-5"
    >
      <div className="flex flex-col gap-1">
        <p className="title-2-bold text-mint-300">Step1</p>
        <div className="flex flex-col gap-0.5">
          <h2 id="experience-add-upload-title" className="heading-3-bold text-[#050505]">
            자료 업로드
          </h2>
          <p className="body-2-regular text-gray-700">
            경험과 관련된 자료를 업로드해주세요. 자료가 많을수록 더 정확한 분석이 가능합니다.
            <br />
            자료 업로드가 필요하지 않은 경험이라면 다음단계로 바로 넘어가주세요.
          </p>
        </div>
      </div>

      <Modal
        showCloseButton
        trigger={
          <Button type="button" className="h-10 w-full body-3-bold" leftIcon={<PlusIcon />}>
            자료 추가하기
          </Button>
        }
      >
        <ExperienceAddMaterialModal />
      </Modal>

      <div className="h-[357px] w-full rounded-lg bg-gray-100 py-5">
        <EmptyState
          title="아직 추가한 경험이 없어요"
          description="지금 당장 파일이 없다면 다음 단계로 바로 넘어가도 괜찮아요!"
        />
      </div>
    </section>
  );
}
