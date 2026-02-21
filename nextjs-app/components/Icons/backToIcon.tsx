import React from 'react';

interface BackToButtonProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  filled?: boolean;
  size?: number;
  height?: number;
  width?: number;
  label?: string;
}

export const BackToButton: React.FC<BackToButtonProps> = ({
  fill = 'currentColor',
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
      viewBox="0 -960 960 960"
      fill={filled ? fill : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      {...props}
    >
      <path
        d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
        fill='currentColor'
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};