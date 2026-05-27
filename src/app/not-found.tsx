import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100dvh-30px)] w-full items-center justify-center">
      <div className="flex w-full max-w-[386px] flex-col items-center text-center">
        <div className="flex h-[207px] w-full items-center justify-center">
          <Image
            src="/not-found.svg"
            alt=""
            width={356}
            height={207}
            priority
            unoptimized
            aria-hidden="true"
            className="h-auto w-full max-w-[356px] object-contain"
          />
        </div>

        <div className="mt-3 flex flex-col items-center gap-3">
          <h1 className="text-[32px] leading-[51px] font-bold text-strong">Page Not Found</h1>
          <p className="body-1-regular break-keep text-strong">
            죄송합니다. 페이지를 찾을 수 없습니다.
            <br />
            존재하지 않는 주소를 입력하셨거나,
            <br />
            요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
          </p>
        </div>

        <Button asChild className="mt-12 w-60">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </section>
  );
}
