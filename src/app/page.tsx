import { HomeDashboardClient } from '@/app/_components/HomeDashboardClient';
import { NullType } from '@/app/_components/NullType';
import { HOME_DASHBOARD_SIDE_CARD_CLASS } from '@/app/_constants/homeLayoutConstants';

/** Home LCP candidates (see JobTypeCard / NullType). */
export const HOME_LCP_IMAGE_PATHS = ['/job-type-background-opt.jpg', '/empty-type.svg'] as const;

export default function Home() {
  return (
    <HomeDashboardClient>
      <NullType className={HOME_DASHBOARD_SIDE_CARD_CLASS} />
    </HomeDashboardClient>
  );
}
