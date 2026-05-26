import type { SVGProps } from 'react';

export function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path
        d="M5 19V8H12V6H4.5L3 7.5V19.5L4.5 21H16.5L18 19.5V12H16V19H5Z"
        fill="currentColor"
      />
      <path
        d="M21 10.5332H19V6.41406L13.707 11.707L12.293 10.293L17.5859 5H13.4668V3H21V10.5332Z"
        fill="currentColor"
      />
    </svg>
  );
}
