"use client";
import React from "react";
import AntdIcon from "@ant-design/icons";
import {
  SettingOutlined,
  HomeOutlined,
  FormOutlined,
  ReadOutlined,
  CrownOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { cn } from "../../lib";

type IconType = "settings" | "home" | "practice" | "glossary" | "rating" | "check";

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
} satisfies Record<string, React.ComponentType>;

export const Icon = ({ name, size = 16, color, className }: Props) => {
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
};
