import Image from 'next/image';

export function ExperienceAddAnalyzingStep() {
  return (
    <section
      aria-live="polite"
      aria-label="경험 분석 중"
      className="flex h-[690px] w-full items-center justify-center overflow-hidden rounded-xl border border-border-default bg-background-w"
    >
      <div className="flex w-[211px] flex-col items-center gap-3">
        <div className="relative flex h-[155px] w-[199px] items-center justify-center">
          <Image
            src="/logo-light-mark.svg"
            alt=""
            width={155}
            height={155}
            className="size-[155px] animate-pulse"
            priority
          />
        </div>
        <p className="body-1-bold text-strong">경험을 분석해 끼우는 중이에요..</p>
      </div>
    </section>
  );
}
