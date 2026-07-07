import React from "react";

const iconMap = {
  All: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  Register: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  "Finance & Utilities":
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  "Users & Roles":
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  Kitchen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  "Store Room":
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  Complaints: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
  Others: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
};

function Card({ name, gradient, glowColor, isSelected }) {
  const currentIcon = iconMap[name] || iconMap.Others;

  return (
    <div className="flex flex-col items-center justify-center gap-3 min-w-[84px]">
      <div
        className={`
          w-14 h-14 
          lg:w-16 lg:h-16 
          rounded-full 
          flex items-center justify-center 
          shrink-0
          cursor-pointer
          transition-all duration-300 ease-out
          ${isSelected ? "scale-105" : "hover:scale-105"}
        `}
        style={{
          background: gradient,
          boxShadow: isSelected
            ? `
              0 0 10px ${glowColor},
              0 0 20px ${glowColor},
              0 0 35px ${glowColor},
              0 8px 20px rgba(0,0,0,0.18)
            `
            : "0 4px 12px rgba(0,0,0,0.18)",
          willChange: "transform, box-shadow",
        }}
      >
        <div className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center">
          <img
            src={currentIcon}
            alt={name}
            className="w-full h-full object-contain block select-none"
            draggable="false"
          />
        </div>
      </div>

      <p
        className={`text-[12.5px] text-center transition-all duration-300 ${
          isSelected ? "font-bold" : "font-medium"
        }`}
        style={{ color: "var(--theme-accent)" }}
      >
        {name}
      </p>
    </div>
  );
}

export default Card;
