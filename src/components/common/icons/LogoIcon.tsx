import { useId, type SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  const filterId = `upload-document-icon-shadow-${useId()}`;

  return (
    <svg width="81" height="68" viewBox="0 0 81 68" fill="none" aria-hidden="true" {...props}>
      <g filter={`url(#${filterId})`}>
        <rect
          x="14.864"
          y="12.0596"
          width="60.7851"
          height="39.32"
          transform="rotate(-3.19776 14.864 12.0596)"
          fill="#9E9E9E"
        />
        <path
          d="M14.3792 3.39062L36.336 2.16391L43.3091 10.4714L14.8635 12.0607L14.3792 3.39062Z"
          fill="#9E9E9E"
        />
        <path d="M18.4783 8.32617L34.5472 7.42841" stroke="#616161" strokeWidth="4.38114" />
        <path
          d="M44.6448 40.5903C55.6708 43.1333 56.8309 51.4734 54.1433 63.1264L33.1502 58.2846C34.6593 51.7415 32.1913 47.3657 25.1761 46.2072L22.934 55.9284L2.99992 51.3309L11.6807 13.6924L31.6148 18.2899L29.617 26.9517C35.9327 28.8677 40.5231 26.3168 41.831 20.6461L62.8241 25.4878C60.2371 36.7046 54.952 41.9831 44.8604 39.6556L44.6448 40.5903Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0.164062"
          width="80.7478"
          height="66.9619"
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
