// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Telegram2019LogosvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Telegram2019LogosvgIcon(props: Telegram2019LogosvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      x={"0"}
      y={"0"}
      viewBox={"0 0 240.1 240.1"}
      xmlSpace={"preserve"}
      height={"1em"}
      width={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <linearGradient
        id={"qT2yeYJuga"}
        gradientUnits={"userSpaceOnUse"}
        x1={"-838.041"}
        y1={"660.581"}
        x2={"-838.041"}
        y2={"660.343"}
        gradientTransform={"matrix(1000 0 0 -1000 838161 660581)"}
      >
        <stop offset={"0"} stopColor={"#2aabee"}></stop>

        <stop offset={"1"} stopColor={"#229ed9"}></stop>
      </linearGradient>

      <circle
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        fill={"url(#qT2yeYJuga)"}
        cx={"120.1"}
        cy={"120.1"}
        r={"120.1"}
      ></circle>

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        fill={"#FFF"}
        d={
          "M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3s.4 3.1.2 4.7c-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.7-4.4-7.5-2.4-13.5-3.7-13-7.9.3-2.2 3.3-4.4 8.9-6.7z"
        }
      ></path>
    </svg>
  );
}

export default Telegram2019LogosvgIcon;
/* prettier-ignore-end */
