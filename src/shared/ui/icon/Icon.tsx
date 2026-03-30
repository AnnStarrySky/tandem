"use client";

import React from "react";

import AntdIcon, {
  CheckOutlined,
  CrownOutlined,
  FormOutlined,
  HomeOutlined,
  LeftOutlined,
  ReadOutlined,
  RightOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { cn } from "../../lib";

export type IconType =
  | "settings"
  | "home"
  | "practice"
  | "glossary"
  | "rating"
  | "check"
  | "profile"
  | "leftArrow"
  | "rightArrow";

type Props = {
  name: IconType;
  size?: number;
  color?: string;
  className?: string;
};

export const iconMap = {
  settings: SettingOutlined,
  home: HomeOutlined,
  practice: FormOutlined,
  glossary: ReadOutlined,
  rating: CrownOutlined,
  check: CheckOutlined,
  profile: UserOutlined,
  leftArrow: LeftOutlined,
  rightArrow: RightOutlined,
} satisfies Record<IconType, React.ComponentType>;

export const Icon = ({ name, size = 16, color, className }: Props) => {
  const Svg = iconMap[name];

  return (
    <AntdIcon
      component={Svg}
      className={cn("inline-flex leading-none", className)}
      style={{
        fontSize: `${size}px`,
        color,
      }}
    />
  );
};
