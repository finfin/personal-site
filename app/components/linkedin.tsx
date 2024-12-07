import * as React from 'react';

// By: lucide
// See: https://v0.app/icon/lucide/linkedin
// Example: <BrandLinkedin size="24px" style={{color: "#000000"}} />

export const BrandLinkedin = ({
  size = '1em',
  strokeWidth = '1.5',
  fill = 'none',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'> & {
  size?: string | number;
}) => (
  <svg
    focusable={focusable}
    height={size}
    role="img"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </g>
  </svg>
);
