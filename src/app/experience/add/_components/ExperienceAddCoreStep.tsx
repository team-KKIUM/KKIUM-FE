import {
  CORE_EXPERIENCE_FIELDS,
  CORE_EXPERIENCE_TIPS,
} from '@/app/experience/add/_constants/experienceCoreQuestions';
import { TextField } from '@/components/common/TextField';
import { CoreTipIcon } from '@/components/common/icons/CoreTipIcon';

export function ExperienceAddCoreStep() {
  return (
    <section
      aria-labelledby="experience-add-core-title"
      className="flex w-full flex-col gap-6 rounded-xl border border-border-default bg-background-w px-[30px] py-5"
    >
      <div className="flex flex-col gap-1">
        <p className="title-2-bold text-mint-300">Step 3</p>
        <div className="flex flex-col gap-0.5">
          <h2 id="experience-add-core-title" className="heading-3-bold text-[#050505]">
            핵심 경험 입력
          </h2>
          <p className="body-2-regular text-gray-700">
            경험의 핵심 내용을 구조화하여 입력해주세요. 구체적이고 명확할수록 더 정확한 분석결과를
            얻을 수 있습니다.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1.5 rounded-lg bg-mint-50/60 px-5 py-5">
        <div className="flex items-center gap-2">
          <CoreTipIcon className="size-6" />
          <p className="title-2-bold text-mint-600">핵심 작성 Tip</p>
        </div>
        <ul className="flex flex-col gap-0.5 pl-8">
          {CORE_EXPERIENCE_TIPS.map((tip) => (
            <li key={tip} className="body-3-bold text-gray-500">
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col gap-7">
        {CORE_EXPERIENCE_FIELDS.map((field) => (
          <CoreQuestionField
            key={field.number}
            number={field.number}
            label={field.label}
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </section>
  );
}

function CoreQuestionField({
  number,
  label,
  placeholder,
}: {
  number: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-start gap-0.5 title-2-bold">
        <span className="text-mint-300">{number}</span>
        <span className="text-strong">{label}</span>
      </div>
      <TextField
        variant="textarea"
        placeholder={placeholder}
        description={false}
        className="min-h-[140px]"
      />
    </div>
  );
}
