import type { SVGProps } from 'react';

export function InformationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="8.17" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="7.33" r="1" fill="currentColor" />
      <rect x="9.17" y="10" width="1.67" height="6.5" rx="0.83" fill="currentColor" />
    </svg>
  );
}
