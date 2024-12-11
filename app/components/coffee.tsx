import * as React from 'react';

// By: tabler
// See: https://v0.app/icon/tabler/coffee
// Example: <IconTablerCoffee width="24px" height="24px" style={{color: "#000000"}} />

export const Coffee = ({
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
      <path d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1c.83-.642 2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" />
      <path d="M16.746 16.726a3 3 0 1 0 .252-5.555" />
    </g>
  </svg>
);
