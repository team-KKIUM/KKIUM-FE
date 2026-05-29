'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { TextField } from '@/components/common/TextField';
import { Button } from '@/components/ui/button';
import {
  buildNameCompatibilitySearchParams,
  getNameCompatibilityResultFromSearchParams,
  type NameCompatibilityResult,
} from '@/app/_utils/calculateNameCompatibility';
import { MobileLandingResult } from '@/app/_components/MobileLandingResult';

interface MobileLandingPageProps {
  onSubmit?: (value: { name: string; company: string }) => void;
}

export function MobileLandingPage({ onSubmit }: MobileLandingPageProps) {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [result, setResult] = React.useState<NameCompatibilityResult | null>(() => {
    return getNameCompatibilityResultFromCurrentUrl();
  });
  const trimmedName = name.trim();
  const trimmedCompany = company.trim();
  const canSubmit = trimmedName.length > 0 && trimmedCompany.length > 0;

  React.useEffect(() => {
    const syncResultFromUrl = () => {
      setResult(getNameCompatibilityResultFromCurrentUrl());
    };

    window.addEventListener('popstate', syncResultFromUrl);

    return () => {
      window.removeEventListener('popstate', syncResultFromUrl);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      name: trimmedName,
      company: trimmedCompany,
    });

    const params = buildNameCompatibilitySearchParams(trimmedName, trimmedCompany);
    const nextResult = getNameCompatibilityResultFromSearchParams(params);

    if (!nextResult) {
      return;
    }

    setResult(nextResult);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  if (result) {
    return (
      <MobileLandingResult name={result.name} company={result.company} score={result.score} />
    );
  }

  return (
    <section className="relative flex h-dvh w-full overflow-hidden bg-[linear-gradient(180deg,var(--color-mint-300)_0%,var(--color-mint-50)_100%)]">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5vw] top-[11dvh] size-[clamp(48px,15vw,64px)] rotate-29 bg-white/14" />
        <div className="absolute right-[5vw] top-[1.5dvh] size-[clamp(52px,15vw,64px)] -rotate-18 bg-white/14" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col items-center">
        <div className="flex flex-col items-center gap-[clamp(6px,1.1dvh,8px)] pt-[clamp(40px,8.9dvh,76px)]">
          <div className="relative aspect-244/53 w-[clamp(210px,62vw,244px)]">
            <Image src="/landing-logo.svg" alt="KKIUM" fill priority sizes="244px" />
          </div>
          <p className="body-1-bold text-center text-on-fill">당신의 경험이 제자리를 찾는 방식</p>
        </div>

        <form
          className="mt-[clamp(18px,3.7dvh,31px)] flex min-h-0 w-full flex-1 flex-col rounded-t-3xl bg-background-w px-[clamp(16px,4.8vw,24px)] pb-[clamp(20px,5.4dvh,46px)] pt-[clamp(22px,3.5dvh,30px)]"
          onSubmit={handleSubmit}
        >
          <div className="relative flex flex-col items-center text-center">
            <span
              aria-hidden="true"
              className="absolute left-[8%] top-0 text-[clamp(18px,5vw,22px)] text-yellow-500"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="absolute right-[8%] top-[clamp(36px,5dvh,43px)] text-[clamp(28px,8vw,34px)] text-yellow-500"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="absolute right-0 top-[clamp(56px,7.8dvh,67px)] text-[clamp(22px,6.8vw,27px)] text-yellow-500"
            >
              ✦
            </span>
            <h1 className="text-[clamp(24px,7.1vw,28px)] leading-[1.48] font-extrabold text-strong">
              내 이름과 희망 기업,
              <br />
              합격 궁합은 몇 점일까?
            </h1>
            <p className="mt-2 text-[clamp(14px,3.8vw,15px)] leading-[1.48] font-bold text-tertiary">
              희망 기업과 내 이름의 궁합을 테스트해보세요
            </p>
          </div>

          <div className="mt-[clamp(32px,6.9dvh,59px)] flex flex-col gap-[clamp(16px,2.35dvh,20px)]">
            <label className="flex flex-col gap-1.5">
              <span className="body-2-bold text-strong">이름</span>
              <TextField
                value={name}
                placeholder="이름을 입력하세요"
                description={false}
                maxLength={20}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="body-2-bold text-strong">희망기업</span>
              <TextField
                value={company}
                placeholder="예: 네이버, 토스, 카카오"
                description={false}
                maxLength={30}
                onChange={(event) => setCompany(event.currentTarget.value)}
              />
            </label>
          </div>

          <Button type="submit" className="mt-auto h-[52px] w-full" disabled={!canSubmit}>
            궁합 보러가기
          </Button>
        </form>
      </div>
    </section>
  );
}

function getNameCompatibilityResultFromCurrentUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  return getNameCompatibilityResultFromSearchParams(new URLSearchParams(window.location.search));
}
