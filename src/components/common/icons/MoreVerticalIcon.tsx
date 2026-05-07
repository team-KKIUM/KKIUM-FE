import type { SVGProps } from 'react';

export function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="19" r="2" transform="rotate(180 12 19)" fill="currentColor" />
      <circle cx="12" cy="12" r="2" transform="rotate(180 12 12)" fill="currentColor" />
      <circle cx="12" cy="5" r="2" transform="rotate(180 12 5)" fill="currentColor" />
    </svg>
  );
}
