export interface EmptyStateIllustrationProps {
  label: string;
}

export function EmptyStateIllustration({ label }: EmptyStateIllustrationProps) {
  return (
    <svg width="174" height="138" viewBox="0 0 174 138" fill="none" role="img" aria-label={label}>
      <g filter="url(#empty-state-illustration-shadow)">
        <rect
          x="23.3805"
          y="64.1454"
          width="86.5087"
          height="55.9599"
          transform="rotate(-24.2607 23.3805 64.1454)"
          fill="#9E9E9E"
        />
        <path
          d="M18.3035 52.8823L46.8369 40.0225L60.3471 47.489L23.3814 64.1492L18.3035 52.8823Z"
          fill="#9E9E9E"
        />
        <path d="M26.271 57.3378L47.153 47.9265" stroke="#616161" strokeWidth="4.38114" />
        <path
          d="M74.209 82.5353C90.1534 80.273 95.9599 90.7561 98.3509 107.607L67.9934 111.914C66.6509 102.453 61.135 97.9035 51.2255 99.9531L53.2201 114.011L24.3941 118.101L16.6714 63.6728L45.4974 59.5827L47.2747 72.1083C56.6426 71.4226 61.4343 65.6868 60.2708 57.4866L90.6282 53.1792C92.9297 69.3994 88.6104 79.113 74.0172 81.1836L74.209 82.5353Z"
          fill="white"
        />
        <circle cx="138.056" cy="85.6923" r="7.6211" fill="#9E9E9E" />
        <circle cx="153.039" cy="64.0204" r="9.9667" fill="#9E9E9E" />
        <circle cx="131.661" cy="69.85" r="3.9248" fill="#9E9E9E" />
      </g>
      <defs>
        <filter
          id="empty-state-illustration-shadow"
          x="13.6714"
          y="26.6"
          width="153.599"
          height="95.5005"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_dropShadow" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
