import React from 'react';

interface UserButtonProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  filled?: boolean;
  size?: number;
  height?: number;
  width?: number;
  label?: string;
}

export const UserButton: React.FC<UserButtonProps> = ({
  fill = '#FFFFFF',
  filled,
  size,
  height,
  width,
  label,
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 -5 60.671 60.671"
      fill={filled ? fill : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      xmlSpace="preserve"
      {...props}
    >
      <ellipse cx="30.336" cy="12.097" rx="11.997" ry="12.097" fill={fill} />
      <path
        d="M35.64,30.079H25.031c-7.021,0-12.714,5.739-12.714,12.821v17.771h36.037V42.9 C48.354,35.818,42.661,30.079,35.64,30.079z"
        fill={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};