import Image from 'next/image';

import { NameCompatibilityAnimation } from '@/app/_components/NameCompatibilityAnimation';
import { Button } from '@/components/ui/button';
import { loadKakaoSdk } from '@/lib/loadKakaoSdk';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
const KKIUM_DESCRIPTION = '당신의 경험이 제자리를 찾는 방식';

interface MobileLandingResultProps {
  name: string;
  company: string;
  score: number;
}

export function MobileLandingResult({ name, company, score }: MobileLandingResultProps) {
  const handleKakaoShare = async () => {
    if (!SITE_URL) {
      return;
    }

    try {
      await loadKakaoSdk();
    } catch {
      return;
    }

    const kakao = window.Kakao;
    if (!kakao?.isInitialized()) {
      return;
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: 'KKIUM',
        description: KKIUM_DESCRIPTION,
        imageUrl: `${SITE_URL}/opengraph-image.png`,
        link: {
          mobileWebUrl: SITE_URL,
          webUrl: SITE_URL,
        },
      },
      buttons: [
        {
          title: 'KKIUM 보러가기',
          link: {
            mobileWebUrl: SITE_URL,
            webUrl: SITE_URL,
          },
        },
      ],
    });
  };

  return (
    <section className="relative flex min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[linear-gradient(180deg,var(--color-mint-300)_0%,var(--color-mint-50)_100%)]">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5vw] top-[11dvh] size-[clamp(48px,15vw,64px)] rotate-29 bg-white/14" />
        <div className="absolute right-[5vw] top-[1.5dvh] size-[clamp(52px,15vw,64px)] -rotate-18 bg-white/14" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center">
        <div className="flex flex-col items-center pt-[clamp(40px,7.9dvh,67px)]">
          <div className="relative aspect-244/53 w-[clamp(210px,62vw,244px)]">
            <Image src="/landing-logo.svg" alt="KKIUM" fill priority sizes="244px" />
          </div>
        </div>

        <div className="mt-[clamp(20px,3.2dvh,27px)] flex w-full flex-1 flex-col rounded-t-3xl bg-background-w px-[clamp(16px,4.8vw,24px)] pb-[clamp(20px,5.4dvh,46px)] pt-[clamp(40px,5.9dvh,50px)]">
          <div className="relative flex flex-col items-center text-center">
            <span
              aria-hidden="true"
              className="absolute left-[4%] top-[-18px] text-[clamp(18px,5vw,22px)] text-yellow-500"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="absolute right-[7%] top-[clamp(48px,6.1dvh,52px)] text-[clamp(28px,8vw,34px)] text-yellow-500"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="absolute right-0 top-[clamp(72px,9.2dvh,78px)] text-[clamp(22px,6.8vw,27px)] text-yellow-500"
            >
              ✦
            </span>
            <h1 className="max-w-full break-keep text-[clamp(24px,8.1vw,32px)] leading-[1.28] font-extrabold text-strong">
              {name} X {company}
            </h1>
            <p className="mt-2 text-[clamp(16px,4.6vw,18px)] leading-[1.48] font-bold text-tertiary">
              합격 궁합 분석 결과
            </p>
          </div>

          <div className="flex flex-1 items-center justify-center py-[clamp(24px,5dvh,48px)]">
            <NameCompatibilityAnimation name={name} company={company} score={score} />
          </div>

          <div className="rounded-lg border border-border-bold px-4 py-5">
            <div className="flex flex-col items-center gap-[13px] text-center">
              <p className="body-3-bold text-strong">
                → 희망 공고와 내 경험의{' '}
                <span className="text-mint-700 underline underline-offset-2">실제 적합도가</span>{' '}
                궁금하다면?
              </p>
              <p className="body-3-bold text-strong">
                → 내 경험을{' '}
                <span className="text-mint-700 underline underline-offset-2">
                  어떻게 활용할 수 있을지
                </span>{' '}
                궁금하다면?
              </p>
              <Button
                type="button"
                variant="secondary"
                className="h-[52px] w-full bg-[#FEE500] text-black/85 hover:bg-[#FEE500] hover:brightness-95"
                disabled={!SITE_URL}
                onClick={handleKakaoShare}
              >
                <span className="inline-flex items-center gap-2">
                  <Image
                    src="/oauth/kakao-logo.svg"
                    alt=""
                    width={17}
                    height={18}
                    className="h-[18px] w-[17px]"
                    aria-hidden="true"
                  />
                  <span>카카오톡으로 KKIUM 공유하기</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
