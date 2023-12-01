// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type MediasvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function MediasvgIcon(props: MediasvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      xmlSpace={"preserve"}
      viewBox={"0 0 512 512"}
      height={"1em"}
      width={"1em"}
      style={{
        fill: "currentcolor",

        ...(style || {}),
      }}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g fill={"currentColor"}>
        <path
          d={
            "M295.5 221l-69.8 42c-1.2.7-1.7 2.1-1.3 3.4l9.1 32.6c.3.9 1.6.8 1.7-.2l2-22.5c.1-1.7.9-3.3 2.2-4.4l57-49.7c.6-.6-.2-1.7-.9-1.2z"
          }
        ></path>

        <path
          d={
            "M322.3 154.8H189.8c-19.3 0-35 15.7-35 35v132.5c0 19.3 15.7 35 35 35h132.5c19.3 0 35-15.7 35-35V189.8c0-19.3-15.8-35-35-35zm5.8 44.2l-25.6 116.3c-.9 3.9-5.5 5.5-8.6 3l-30-23.8c-2.2-1.8-5.5-1.5-7.4.7L241.1 313c-2.7 3.2-7.9 2.1-9.1-1.8l-13.6-41.9c-.6-1.7-2-3.1-3.7-3.5l-26.9-7.1c-4.9-1.3-5.4-8.1-.7-10.1l133.7-55.7c4-1.6 8.2 1.9 7.3 6.1z"
          }
        ></path>
      </g>
    </svg>
  );
}

export default MediasvgIcon;
/* prettier-ignore-end */
