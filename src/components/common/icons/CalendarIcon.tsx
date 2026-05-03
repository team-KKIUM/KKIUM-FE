import type { SVGProps } from 'react';

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 4.125L20.875 5V20L20 20.875H4L3.125 20V5L4 4.125H20ZM4.875 19.125H19.125V5.875H4.875V19.125Z"
        fill="currentColor"
      />
      <rect x="7" y="3" width="2.5" height="4" fill="currentColor" />
      <rect x="14.5" y="3" width="2.5" height="4" fill="currentColor" />
      <path
        d="M20 20H4V5H20V20ZM6 16V18H8V16H6ZM11 16V18H13V16H11ZM16 16V18H18V16H16ZM6 12V14H8V12H6ZM11 12V14H13V12H11ZM16 12V14H18V12H16ZM5.4375 6L5 6.5V8.5L5.4375 9H18.5625L19 8.5V6.5L18.5625 6H5.4375Z"
        fill="currentColor"
      />
    </svg>
  );
}
