// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: b7qxVGc4J2aoxUpARxxPVV
// Component: Mt936vgmlbhfCw
import * as React from "react";

import Head from "next/head";
import Link, { LinkProps } from "next/link";

import * as p from "@plasmicapp/react-web";
import * as ph from "@plasmicapp/host";

import {
  hasVariant,
  classNames,
  wrapWithClassName,
  createPlasmicElementProxy,
  makeFragment,
  MultiChoiceArg,
  SingleBooleanChoiceArg,
  SingleChoiceArg,
  pick,
  omit,
  useTrigger,
  StrictProps,
  deriveRenderOpts,
  ensureGlobalVariants
} from "@plasmicapp/react-web";
import Button from "../../Button"; // plasmic-import: BBnBngbU-SWcU/component

import { useScreenVariants as useScreenVariantsbfAeazZolEhus } from "./PlasmicGlobalVariant__Screen"; // plasmic-import: BfAeazZolEHUS/globalVariant

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic_dark_saa_s_landing_page.module.css"; // plasmic-import: b7qxVGc4J2aoxUpARxxPVV/projectcss
import sty from "./PlasmicPriceCard.module.css"; // plasmic-import: Mt936vgmlbhfCw/css

export type PlasmicPriceCard__VariantMembers = {
  primary: "primary";
  borders: "flatLeft" | "flatRight" | "flatCenter";
};

export type PlasmicPriceCard__VariantsArgs = {
  primary?: SingleBooleanChoiceArg<"primary">;
  borders?: MultiChoiceArg<"flatLeft" | "flatRight" | "flatCenter">;
};

type VariantPropType = keyof PlasmicPriceCard__VariantsArgs;
export const PlasmicPriceCard__VariantProps = new Array<VariantPropType>(
  "primary",
  "borders"
);

export type PlasmicPriceCard__ArgsType = {};
type ArgPropType = keyof PlasmicPriceCard__ArgsType;
export const PlasmicPriceCard__ArgProps = new Array<ArgPropType>();

export type PlasmicPriceCard__OverridesType = {
  root?: p.Flex<"div">;
  freeBox?: p.Flex<"div">;
  h4?: p.Flex<"h4">;
  button?: p.Flex<typeof Button>;
};

export interface DefaultPriceCardProps {
  primary?: SingleBooleanChoiceArg<"primary">;
  borders?: MultiChoiceArg<"flatLeft" | "flatRight" | "flatCenter">;
  className?: string;
}

function PlasmicPriceCard__RenderFunc(props: {
  variants: PlasmicPriceCard__VariantsArgs;
  args: PlasmicPriceCard__ArgsType;
  overrides: PlasmicPriceCard__OverridesType;

  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const $ctx = ph.useDataEnv?.() || {};
  const args = React.useMemo(
    () =>
      Object.assign(
        {},

        props.args
      ),
    [props.args]
  );

  const $props = {
    ...args,
    ...variants
  };

  const globalVariants = ensureGlobalVariants({
    screen: useScreenVariantsbfAeazZolEhus()
  });

  return (
    <div
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      className={classNames(
        projectcss.all,
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        sty.root,
        {
          [sty.rootborders_flatCenter]: hasVariant(
            variants,
            "borders",
            "flatCenter"
          ),
          [sty.rootborders_flatLeft]: hasVariant(
            variants,
            "borders",
            "flatLeft"
          ),
          [sty.rootborders_flatRight]: hasVariant(
            variants,
            "borders",
            "flatRight"
          ),
          [sty.rootprimary]: hasVariant(variants, "primary", "primary")
        }
      )}
    >
      <div
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        className={classNames(projectcss.all, sty.freeBox, {
          [sty.freeBoxborders_flatCenter]: hasVariant(
            variants,
            "borders",
            "flatCenter"
          ),
          [sty.freeBoxborders_flatLeft]: hasVariant(
            variants,
            "borders",
            "flatLeft"
          ),
          [sty.freeBoxborders_flatRight]: hasVariant(
            variants,
            "borders",
            "flatRight"
          ),
          [sty.freeBoxprimary]: hasVariant(variants, "primary", "primary")
        })}
      >
        <h4
          data-plasmic-name={"h4"}
          data-plasmic-override={overrides.h4}
          className={classNames(
            projectcss.all,
            projectcss.h4,
            projectcss.__wab_text,
            sty.h4,
            {
              [sty.h4borders_flatCenter]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.h4borders_flatLeft]: hasVariant(
                variants,
                "borders",
                "flatLeft"
              ),
              [sty.h4borders_flatRight]: hasVariant(
                variants,
                "borders",
                "flatRight"
              )
            }
          )}
        >
          {hasVariant(variants, "borders", "flatRight")
            ? "Базовый тариф"
            : hasVariant(variants, "borders", "flatLeft")
            ? "Free"
            : "Pro"}
        </h4>

        {(hasVariant(variants, "borders", "flatRight") ? true : true) ? (
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text___2QbhR,
              {
                [sty.textborders_flatCenter___2QbhRw7Zz7]: hasVariant(
                  variants,
                  "borders",
                  "flatCenter"
                ),
                [sty.textborders_flatLeft___2QbhRkbqDp]: hasVariant(
                  variants,
                  "borders",
                  "flatLeft"
                ),
                [sty.textborders_flatRight___2QbhRhwarV]: hasVariant(
                  variants,
                  "borders",
                  "flatRight"
                ),
                [sty.textprimary___2QbhRRlHKv]: hasVariant(
                  variants,
                  "primary",
                  "primary"
                )
              }
            )}
          >
            {hasVariant(variants, "borders", "flatRight")
              ? "Flexible power and security"
              : hasVariant(variants, "borders", "flatLeft")
              ? "A complete analytics platform."
              : "A complete analytics platform."}
          </div>
        ) : null}

        <p.PlasmicImg
          alt={""}
          className={classNames(sty.img__ftnXl, {
            [sty.imgborders_flatRight__ftnXlhwarV]: hasVariant(
              variants,
              "borders",
              "flatRight"
            )
          })}
          displayHeight={"auto" as const}
          displayMaxHeight={"none" as const}
          displayMaxWidth={"100%" as const}
          displayMinHeight={"0" as const}
          displayMinWidth={"0" as const}
          displayWidth={"auto" as const}
          loading={"lazy" as const}
          src={{
            src: "/plasmic/dark_saa_s_landing_page/images/linePricingpng.png",
            fullWidth: 300,
            fullHeight: 2,
            aspectRatio: undefined
          }}
        />

        {(hasVariant(globalVariants, "screen", "mobileOnly") ? true : true) ? (
          <div
            className={classNames(projectcss.all, sty.columns___4RoVa, {
              [sty.columnsprimary___4RoVaRlHKv]: hasVariant(
                variants,
                "primary",
                "primary"
              )
            })}
          >
            <div
              className={classNames(projectcss.all, sty.column__o8N8G, {
                [sty.columnborders_flatRight__o8N8GhwarV]: hasVariant(
                  variants,
                  "borders",
                  "flatRight"
                )
              })}
            >
              <p.PlasmicImg
                alt={""}
                className={classNames(sty.img__cbTlm, {
                  [sty.imgborders_flatLeft__cbTlmkbqDp]: hasVariant(
                    variants,
                    "borders",
                    "flatLeft"
                  ),
                  [sty.imgborders_flatRight__cbTlmhwarV]: hasVariant(
                    variants,
                    "borders",
                    "flatRight"
                  )
                })}
                displayHeight={"24px" as const}
                displayMaxHeight={"none" as const}
                displayMaxWidth={"100%" as const}
                displayMinHeight={"0" as const}
                displayMinWidth={"0" as const}
                displayWidth={"24px" as const}
                loading={"lazy" as const}
                src={
                  hasVariant(variants, "borders", "flatRight")
                    ? {
                        src: "/plasmic/dark_saa_s_landing_page/images/successpng.png",
                        fullWidth: 64,
                        fullHeight: 64,
                        aspectRatio: undefined
                      }
                    : hasVariant(variants, "borders", "flatLeft")
                    ? {
                        src: "/plasmic/dark_saa_s_landing_page/images/checklistPricingWhitepng.png",
                        fullWidth: 38,
                        fullHeight: 39,
                        aspectRatio: undefined
                      }
                    : {
                        src: "/plasmic/dark_saa_s_landing_page/images/checklistpng.png",
                        fullWidth: 48,
                        fullHeight: 48,
                        aspectRatio: undefined
                      }
                }
              />
            </div>

            <div
              className={classNames(projectcss.all, sty.column___69LUi, {
                [sty.columnborders_flatRight___69LUihwarV]: hasVariant(
                  variants,
                  "borders",
                  "flatRight"
                )
              })}
            >
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__eelKy,
                  {
                    [sty.textborders_flatLeft__eelKYkbqDp]: hasVariant(
                      variants,
                      "borders",
                      "flatLeft"
                    ),
                    [sty.textborders_flatRight__eelKYhwarV]: hasVariant(
                      variants,
                      "borders",
                      "flatRight"
                    ),
                    [sty.textprimary__eelKyRlHKv]: hasVariant(
                      variants,
                      "primary",
                      "primary"
                    )
                  }
                )}
              >
                {hasVariant(variants, "borders", "flatRight")
                  ? "Тариф охватывает все преимущества описанные выше и возможности платформы на данный момент. У нас есть план по внедрению новых инструментов премиум уровня. Новые тарифы появятся после их внедрения."
                  : hasVariant(variants, "borders", "flatLeft")
                  ? "1 Product"
                  : "Up to 10 projects"}
              </div>
            </div>
          </div>
        ) : null}
        {(
          hasVariant(variants, "borders", "flatCenter")
            ? true
            : hasVariant(variants, "borders", "flatLeft")
            ? true
            : hasVariant(variants, "primary", "primary")
            ? true
            : hasVariant(globalVariants, "screen", "mobileOnly")
            ? true
            : false
        ) ? (
          <div
            className={classNames(projectcss.all, sty.columns__dRCek, {
              [sty.columnsborders_flatCenter__dRCekw7Zz7]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.columnsborders_flatLeft__dRCekkbqDp]: hasVariant(
                variants,
                "borders",
                "flatLeft"
              ),
              [sty.columnsprimary__dRCekRlHKv]: hasVariant(
                variants,
                "primary",
                "primary"
              )
            })}
          >
            <div className={classNames(projectcss.all, sty.column__g7LU8)}>
              <p.PlasmicImg
                alt={""}
                className={classNames(sty.img__plmbh, {
                  [sty.imgborders_flatLeft__plmbHkbqDp]: hasVariant(
                    variants,
                    "borders",
                    "flatLeft"
                  )
                })}
                displayHeight={"24px" as const}
                displayMaxHeight={"none" as const}
                displayMaxWidth={"100%" as const}
                displayMinHeight={"0" as const}
                displayMinWidth={"0" as const}
                displayWidth={"24px" as const}
                loading={"lazy" as const}
                src={
                  hasVariant(variants, "borders", "flatLeft")
                    ? {
                        src: "/plasmic/dark_saa_s_landing_page/images/checklistPricingWhitepng.png",
                        fullWidth: 38,
                        fullHeight: 39,
                        aspectRatio: undefined
                      }
                    : {
                        src: "/plasmic/dark_saa_s_landing_page/images/checklistpng.png",
                        fullWidth: 48,
                        fullHeight: 48,
                        aspectRatio: undefined
                      }
                }
              />
            </div>

            <div className={classNames(projectcss.all, sty.column__excVe)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__isCnF,
                  {
                    [sty.textborders_flatLeft__isCnFkbqDp]: hasVariant(
                      variants,
                      "borders",
                      "flatLeft"
                    ),
                    [sty.textprimary__isCnFRlHKv]: hasVariant(
                      variants,
                      "primary",
                      "primary"
                    )
                  }
                )}
              >
                {hasVariant(variants, "borders", "flatLeft")
                  ? "CLI access"
                  : hasVariant(variants, "primary", "primary")
                  ? "Analytics board"
                  : "Up to 10 projects"}
              </div>
            </div>
          </div>
        ) : null}
        {(
          hasVariant(variants, "borders", "flatCenter")
            ? true
            : hasVariant(variants, "primary", "primary")
            ? true
            : false
        ) ? (
          <div
            className={classNames(projectcss.all, sty.columns__hjGuy, {
              [sty.columnsborders_flatCenter__hjGuYw7Zz7]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.columnsprimary__hjGuyRlHKv]: hasVariant(
                variants,
                "primary",
                "primary"
              )
            })}
          >
            <div className={classNames(projectcss.all, sty.column__kWqn)}>
              <p.PlasmicImg
                alt={""}
                className={classNames(sty.img__hfSnz)}
                displayHeight={"24px" as const}
                displayMaxHeight={"none" as const}
                displayMaxWidth={"100%" as const}
                displayMinHeight={"0" as const}
                displayMinWidth={"0" as const}
                displayWidth={"24px" as const}
                loading={"lazy" as const}
                src={{
                  src: "/plasmic/dark_saa_s_landing_page/images/checklistpng.png",
                  fullWidth: 48,
                  fullHeight: 48,
                  aspectRatio: undefined
                }}
              />
            </div>

            <div className={classNames(projectcss.all, sty.column__wHav)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__w3Icg,
                  {
                    [sty.textborders_flatCenter__w3IcGw7Zz7]: hasVariant(
                      variants,
                      "borders",
                      "flatCenter"
                    ),
                    [sty.textprimary__w3IcgRlHKv]: hasVariant(
                      variants,
                      "primary",
                      "primary"
                    )
                  }
                )}
              >
                {"Insights panel"}
              </div>
            </div>
          </div>
        ) : null}
        {(
          hasVariant(variants, "borders", "flatCenter")
            ? true
            : hasVariant(variants, "primary", "primary")
            ? true
            : false
        ) ? (
          <div
            className={classNames(projectcss.all, sty.columns__o0Xr2, {
              [sty.columnsborders_flatCenter__o0Xr2W7Zz7]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.columnsprimary__o0Xr2RlHKv]: hasVariant(
                variants,
                "primary",
                "primary"
              )
            })}
          >
            <div className={classNames(projectcss.all, sty.column__jdjF)}>
              <p.PlasmicImg
                alt={""}
                className={classNames(sty.img__ie4E6)}
                displayHeight={"24px" as const}
                displayMaxHeight={"none" as const}
                displayMaxWidth={"100%" as const}
                displayMinHeight={"0" as const}
                displayMinWidth={"0" as const}
                displayWidth={
                  hasVariant(globalVariants, "screen", "mobileOnly")
                    ? ("16px" as const)
                    : ("24px" as const)
                }
                loading={"lazy" as const}
                src={{
                  src: "/plasmic/dark_saa_s_landing_page/images/checklistpng.png",
                  fullWidth: 48,
                  fullHeight: 48,
                  aspectRatio: undefined
                }}
              />
            </div>

            <div className={classNames(projectcss.all, sty.column__fTaQl)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__dzNZu,
                  {
                    [sty.textprimary__dzNZuRlHKv]: hasVariant(
                      variants,
                      "primary",
                      "primary"
                    )
                  }
                )}
              >
                {"CLI access"}
              </div>
            </div>
          </div>
        ) : null}
        {(
          hasVariant(variants, "borders", "flatCenter")
            ? true
            : hasVariant(variants, "primary", "primary")
            ? true
            : false
        ) ? (
          <div
            className={classNames(projectcss.all, sty.columns__dtBe3, {
              [sty.columnsborders_flatCenter__dtBe3W7Zz7]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.columnsprimary__dtBe3RlHKv]: hasVariant(
                variants,
                "primary",
                "primary"
              )
            })}
          >
            <div className={classNames(projectcss.all, sty.column__ydNWx)}>
              <p.PlasmicImg
                alt={""}
                className={classNames(sty.img___1YX1)}
                displayHeight={"24px" as const}
                displayMaxHeight={"none" as const}
                displayMaxWidth={"100%" as const}
                displayMinHeight={"0" as const}
                displayMinWidth={"0" as const}
                displayWidth={"24px" as const}
                loading={"lazy" as const}
                src={{
                  src: "/plasmic/dark_saa_s_landing_page/images/checklistpng.png",
                  fullWidth: 48,
                  fullHeight: 48,
                  aspectRatio: undefined
                }}
              />
            </div>

            <div className={classNames(projectcss.all, sty.column__f2PpH)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__nyRc,
                  {
                    [sty.textprimary__nyRcRlHKv]: hasVariant(
                      variants,
                      "primary",
                      "primary"
                    )
                  }
                )}
              >
                {"Automation features"}
              </div>
            </div>
          </div>
        ) : null}
        {(
          hasVariant(variants, "borders", "flatCenter")
            ? true
            : hasVariant(variants, "primary", "primary")
            ? true
            : false
        ) ? (
          <div
            className={classNames(projectcss.all, sty.columns__kqgXn, {
              [sty.columnsborders_flatCenter__kqgXnw7Zz7]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.columnsprimary__kqgXnRlHKv]: hasVariant(
                variants,
                "primary",
                "primary"
              )
            })}
          >
            <div className={classNames(projectcss.all, sty.column__ur50)}>
              <p.PlasmicImg
                alt={""}
                className={classNames(sty.img__t2G3)}
                displayHeight={"24px" as const}
                displayMaxHeight={"none" as const}
                displayMaxWidth={"100%" as const}
                displayMinHeight={"0" as const}
                displayMinWidth={"0" as const}
                displayWidth={"24px" as const}
                loading={"lazy" as const}
                src={{
                  src: "/plasmic/dark_saa_s_landing_page/images/checklistpng.png",
                  fullWidth: 48,
                  fullHeight: 48,
                  aspectRatio: undefined
                }}
              />
            </div>

            <div className={classNames(projectcss.all, sty.column__suGRz)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__q8GRr,
                  {
                    [sty.textprimary__q8GRrRlHKv]: hasVariant(
                      variants,
                      "primary",
                      "primary"
                    )
                  }
                )}
              >
                {"Team features"}
              </div>
            </div>
          </div>
        ) : null}

        <p.PlasmicImg
          alt={""}
          className={classNames(sty.img__p94Cm)}
          displayHeight={"auto" as const}
          displayMaxHeight={"none" as const}
          displayMaxWidth={"100%" as const}
          displayMinHeight={"0" as const}
          displayMinWidth={"0" as const}
          displayWidth={"auto" as const}
          loading={"lazy" as const}
          src={{
            src: "/plasmic/dark_saa_s_landing_page/images/linePricingpng.png",
            fullWidth: 300,
            fullHeight: 2,
            aspectRatio: undefined
          }}
        />

        {(
          hasVariant(variants, "borders", "flatCenter")
            ? true
            : hasVariant(variants, "borders", "flatRight")
            ? true
            : hasVariant(variants, "borders", "flatLeft")
            ? true
            : false
        ) ? (
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text___0XsxK,
              {
                [sty.textborders_flatCenter___0XsxKw7Zz7]: hasVariant(
                  variants,
                  "borders",
                  "flatCenter"
                ),
                [sty.textborders_flatLeft___0XsxKkbqDp]: hasVariant(
                  variants,
                  "borders",
                  "flatLeft"
                ),
                [sty.textborders_flatRight___0XsxKhwarV]: hasVariant(
                  variants,
                  "borders",
                  "flatRight"
                )
              }
            )}
          >
            {hasVariant(variants, "borders", "flatCenter")
              ? "$ 50"
              : hasVariant(variants, "borders", "flatRight")
              ? "990 ₽/мес."
              : "$ 0"}
          </div>
        ) : null}
        {(hasVariant(variants, "borders", "flatRight") ? true : true) ? (
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__qlxZo,
              {
                [sty.textborders_flatCenter__qlxZow7Zz7]: hasVariant(
                  variants,
                  "borders",
                  "flatCenter"
                ),
                [sty.textborders_flatLeft__qlxZokbqDp]: hasVariant(
                  variants,
                  "borders",
                  "flatLeft"
                ),
                [sty.textborders_flatRight__qlxZohwarV]: hasVariant(
                  variants,
                  "borders",
                  "flatRight"
                )
              }
            )}
          >
            {hasVariant(variants, "borders", "flatRight")
              ? "Starting price, customizable"
              : hasVariant(variants, "borders", "flatLeft")
              ? "Free Forever"
              : "per project/month"}
          </div>
        ) : null}
        {(
          hasVariant(variants, "borders", "flatRight")
            ? true
            : hasVariant(variants, "borders", "flatLeft")
            ? true
            : true
        ) ? (
          <Button
            data-plasmic-name={"button"}
            data-plasmic-override={overrides.button}
            className={classNames("__wab_instance", sty.button, {
              [sty.buttonborders_flatCenter]: hasVariant(
                variants,
                "borders",
                "flatCenter"
              ),
              [sty.buttonborders_flatLeft]: hasVariant(
                variants,
                "borders",
                "flatLeft"
              ),
              [sty.buttonborders_flatRight]: hasVariant(
                variants,
                "borders",
                "flatRight"
              ),
              [sty.buttonprimary]: hasVariant(variants, "primary", "primary")
            })}
            color={
              hasVariant(variants, "borders", "flatRight")
                ? ("navLinkOrange" as const)
                : hasVariant(variants, "borders", "flatLeft")
                ? ("white" as const)
                : ("blue" as const)
            }
            endIcon={
              <svg
                className={classNames(projectcss.all, sty.svg__u9YLe)}
                role={"img"}
              />
            }
            link={
              hasVariant(variants, "borders", "flatRight")
                ? ("login" as const)
                : ("#" as const)
            }
            startIcon={
              <svg
                className={classNames(projectcss.all, sty.svg__oOJe)}
                role={"img"}
              />
            }
          >
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__cdrQs,
                {
                  [sty.textborders_flatCenter__cdrQsw7Zz7]: hasVariant(
                    variants,
                    "borders",
                    "flatCenter"
                  ),
                  [sty.textborders_flatLeft__cdrQskbqDp]: hasVariant(
                    variants,
                    "borders",
                    "flatLeft"
                  ),
                  [sty.textborders_flatRight__cdrQshwarV]: hasVariant(
                    variants,
                    "borders",
                    "flatRight"
                  )
                }
              )}
            >
              {hasVariant(variants, "borders", "flatCenter")
                ? "Go Become pro"
                : hasVariant(variants, "borders", "flatRight")
                ? "Приобрести"
                : hasVariant(variants, "borders", "flatLeft")
                ? "Claim Free"
                : "Go Become pro"}
            </div>
          </Button>
        ) : null}
      </div>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "h4", "button"],
  freeBox: ["freeBox", "h4", "button"],
  h4: ["h4"],
  button: ["button"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  typeof PlasmicDescendants[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  h4: "h4";
  button: typeof Button;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicPriceCard__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicPriceCard__VariantsArgs;
    args?: PlasmicPriceCard__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicPriceCard__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<PlasmicPriceCard__ArgsType, ReservedPropsType> &
    // Specify overrides for each element directly as props
    Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    // Specify props for the root element
    Omit<
      Partial<React.ComponentProps<NodeDefaultElementType[T]>>,
      ReservedPropsType | VariantPropType | ArgPropType | DescendantsType<T>
    >;

function makeNodeComponent<NodeName extends NodeNameType>(nodeName: NodeName) {
  type PropsType = NodeComponentProps<NodeName> & { key?: React.Key };
  const func = function <T extends PropsType>(
    props: T & StrictProps<T, PropsType>
  ) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: [...PlasmicDescendants[nodeName]],
          internalArgPropNames: PlasmicPriceCard__ArgProps,
          internalVariantPropNames: PlasmicPriceCard__VariantProps
        }),
      [props, nodeName]
    );

    return PlasmicPriceCard__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicPriceCard";
  } else {
    func.displayName = `PlasmicPriceCard.${nodeName}`;
  }
  return func;
}

export const PlasmicPriceCard = Object.assign(
  // Top-level PlasmicPriceCard renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    h4: makeNodeComponent("h4"),
    button: makeNodeComponent("button"),

    // Metadata about props expected for PlasmicPriceCard
    internalVariantProps: PlasmicPriceCard__VariantProps,
    internalArgProps: PlasmicPriceCard__ArgProps
  }
);

export default PlasmicPriceCard;
/* prettier-ignore-end */