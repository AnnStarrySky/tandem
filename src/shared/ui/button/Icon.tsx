"use client";
import React from "react";

import AntdIcon, {
  SettingOutlined,
  HomeOutlined,
  FormOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import { cn } from "../../lib";

type IconType = "settings" | "home" | "practice" | "profile" | "leftArrow" | "rightArrow";

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
  profile: UserOutlined,
  leftArrow: LeftOutlined,
  rightArrow: RightOutlined,
} satisfies Record<string, React.ComponentType>;

export function Icon({ name, size = 16, color, className }: Props) {
  const Svg = iconMap[name];

  return (
    <AntdIcon
      component={Svg}
      className={cn("inline-flex leading-none", color, className)}
      style={{
        fontSize: `${size}px`,
        color: color,
      }}
    />
  );
}
