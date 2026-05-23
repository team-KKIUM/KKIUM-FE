import type { SVGProps } from 'react';

export function GraphIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <rect x="2" y="18" width="20" height="2" fill="currentColor" />
      <path d="M9.5 9L10.4 8L13.1 8L14 9L14 20L9.5 20L9.5 9Z" fill="currentColor" />
      <path d="M16 5.26593L16.9998 4L20 4L21 5.26593L21 19.9364L16 20L16 5.26593Z" fill="currentColor" />
      <path d="M3 13L3.9 12L6.6 12L7.5 13L7.5 20L3 20L3 13Z" fill="currentColor" />
    </svg>
  );
}
