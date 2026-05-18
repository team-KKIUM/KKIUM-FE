import type { SVGProps } from 'react';

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M11 11L4 4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 11L4 4L11 4" stroke="currentColor" strokeWidth="2" />
      <path d="M13 13L20 20" stroke="currentColor" strokeWidth="2" />
      <path d="M20 13L20 20L13 20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
