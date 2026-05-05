import type { SVGProps } from 'react';

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="5.5" width="16" height="2" fill="currentColor" />
      <path
        d="M16 3L16.75 3.75V6.75L16 7.5L8 7.5L7.25 6.75L7.25 3.75L8 3L16 3ZM8.75 6L15.25 6V4.5L8.75 4.5V6Z"
        fill="currentColor"
      />
      <path
        d="M19 19L17 21H7L5 19L5 6L19 6V19ZM8.75 9.5L8.75 16.5H10.25V9.5H8.75ZM13.75 9.5L13.75 16.5H15.25L15.25 9.5L13.75 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
