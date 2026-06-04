import { cn } from '@/lib/utils';

/** Vector-only background (no embedded raster) to avoid a ~99KB LCP image fetch. */
export function EmptyTypeBackground({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 375 349"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={cn('h-full w-full', className)}
    >
      <g clipPath="url(#empty-type-clip)">
        <rect width="375" height="349" fill="#def7f4" rx="12" />
        <g opacity="0.3">
          <path fill="#aeece1" d="m242.377 48.203 44.126 12.26-7.93 28.544-44.127-12.26z" />
          <path fill="#aeece1" d="m244.125 41.903 15.964 4.435 2.966 7.615-20.682-5.747z" />
          <path stroke="#fff" strokeWidth="1.035" d="m245.857 46.417 11.683 3.246" />
        </g>
        <g opacity="0.3">
          <path fill="#aeece1" d="m333.445 118.736 38.565 24.703-15.98 24.946-38.564-24.703z" />
          <path fill="#aeece1" d="m336.97 113.229 13.952 8.937.594 8.15-18.075-11.578z" />
          <path stroke="#fff" strokeWidth="1.035" d="m337.296 118.052 10.211 6.541" />
        </g>
        <g opacity="0.3">
          <path fill="#aeece1" d="m-10.665 124.222 44.623-10.307 6.667 28.865-44.623 10.307z" />
          <path fill="#aeece1" d="m-12.139 117.852 16.144-3.729 6.243 5.273-20.914 4.831z" />
          <path stroke="#fff" strokeWidth="1.035" d="m-8.461 120.99 11.814-2.729" />
        </g>
        <g opacity="0.3">
          <path fill="#aeece1" d="m38.231 193.394 42.426 17.248L69.5 238.086l-42.426-17.248z" />
          <path fill="#aeece1" d="m40.69 187.336 15.35 6.24 2.072 7.904-19.885-8.084z" />
          <path stroke="#fff" strokeWidth="1.035" d="m41.894 192.019 11.233 4.567" />
        </g>
        <g opacity="0.3">
          <path fill="#aeece1" d="m263.61 341.864 42.612-16.783 10.856 27.564-42.612 16.783z" />
          <path fill="#aeece1" d="m261.211 335.782 15.416-6.072 6.954 4.293-19.972 7.866z" />
          <path stroke="#fff" strokeWidth="1.035" d="m265.312 338.343 11.282-4.444" />
        </g>
        <g opacity="0.3">
          <path fill="#aeece1" d="m79.556 335.92 45.691 3.127-2.022 29.555-45.691-3.126z" />
          <path fill="#aeece1" d="m80 329.397 16.53 1.131 4.439 6.862-21.416-1.466z" />
          <path stroke="#fff" strokeWidth="1.035" d="m82.605 333.47 12.097.828" />
        </g>
        <g opacity="0.3">
          <path fill="#aeece1" d="m274.895 212.516 45.7-3.003 1.942 29.561-45.7 3.003z" />
          <path fill="#aeece1" d="m274.463 205.992 16.534-1.086 5.315 6.207-21.42 1.407z" />
          <path stroke="#fff" strokeWidth="1.035" d="m277.589 209.681 12.1-.795" />
        </g>
      </g>
      <defs>
        <clipPath id="empty-type-clip">
          <rect width="375" height="349" fill="#fff" rx="12" />
        </clipPath>
      </defs>
    </svg>
  );
}
