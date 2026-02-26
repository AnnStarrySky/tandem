import React from "react";
import { BaseButtonProps } from "../types/BaseButton_types";

const BaseButton = function ({ text = "Continue", width = "w-50", onClick = () => {} }) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`relative px-4 py-2 text-right ${width} group cursor-pointer`}
      >
        <div className="absolute inset-0 z-6 translate-x-[2px] translate-y-[2px] rounded-lg bg-gradient-to-r from-[#1d4f67] to-[#67bc78] [box-shadow:1px_1px_4px_#0b435b] transition-all duration-300 group-hover:[box-shadow:2px_2px_10px_#0b435b] group-active:[box-shadow:none]"></div>
        <div className="absolute inset-0 z-8 rounded-lg bg-gradient-to-r from-[#13b2f6] to-[#84f59b]"></div>
        <span className="relative z-10 ml-auto block tracking-wider text-white [text-shadow:2px_0px_2px_#17437d]">
          {text}
        </span>
      </button>
    </div>
  );
};

export default BaseButton;
