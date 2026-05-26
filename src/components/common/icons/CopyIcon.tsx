import type { SVGProps } from 'react';

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="8" y="8" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 16H5C4.44772 16 4 15.5523 4 15V5C4 4.44772 4.44772 4 5 4H15C15.5523 4 16 4.44772 16 5V6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
