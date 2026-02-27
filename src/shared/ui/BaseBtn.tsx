import React from "react";

const BaseBtn: React.FC<BaseBtnProps> = ({
  text = "Continue",
  width = "w-[150px]",
  height = "h-[30px]",
  fontSize = "text-[12px]",
  textTransform = "uppercase",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative ${width} ${height} group cursor-pointer border-none bg-transparent p-0 outline-none`}
    >
      {/* Общий контейнер для SVG и Текста для синхронного нажатия */}
      <div className="relative h-full w-full transition-all duration-[100ms] active:translate-y-[2px] active:scale-[0.98]">
        {/* SVG Фон */}
        <div className="absolute inset-0 z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="30 36 300 52"
            fill="none"
            xmlns="http://www.w3.org"
            preserveAspectRatio="none"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
          >
            <rect x="30" y="36" width="300" height="52" rx="16" fill="url(#mainGradient)" />
            <rect x="36" y="62" width="288" height="18" rx="12" fill="url(#bottomLight)" />

            <rect
              x="30"
              y="36"
              width="300"
              height="52"
              rx="16"
              fill="black"
              fillOpacity="0.08"
              filter="url(#innerShadow)"
            />

            <rect x="30" y="36" width="300" height="20" rx="16" fill="white" fillOpacity="0.06" />

            <defs>
              <linearGradient
                id="mainGradient"
                x1="30"
                y1="36"
                x2="330"
                y2="88"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="35%" stopColor="#67E8F9" />
                <stop offset="70%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>

              <linearGradient id="bottomLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.0" />
                <stop offset="100%" stopColor="white" stopOpacity="0.4" />
              </linearGradient>

              <filter id="innerShadow">
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Текст (двигается вместе с SVG благодаря общему контейнеру), pb-[4px] */}
        <span
          className={`relative z-10 flex h-full w-full items-center justify-center px-[16px] pb-[4px] ${fontSize} font-bold tracking-[0.05em] text-white ${textTransform} select-none [text-shadow:0px_1px_2px_rgba(0,0,0,0.2)]`}
        >
          {text}
        </span>
      </div>
    </button>
  );
};

export default BaseBtn;
