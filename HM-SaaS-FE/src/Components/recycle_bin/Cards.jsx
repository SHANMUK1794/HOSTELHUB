import React from "react";

const iconMap = {
  All: "https://asset.techjose.com/Hostelos/recyclebinImg/allicon.png",
  Register: "https://asset.techjose.com/Hostelos/recyclebinImg/register.png",
  "Finance & Utilities":
    "https://asset.techjose.com/Hostelos/recyclebinImg/financeAndutilites.png",
  "Users & Roles":
    "https://asset.techjose.com/Hostelos/recyclebinImg/userAndroles.png",
  Kitchen: "https://asset.techjose.com/Hostelos/recyclebinImg/kitchen.png",
  "Store Room":
    "https://asset.techjose.com/Hostelos/recyclebinImg/storeRoom.png",
  Complaints: "https://asset.techjose.com/Hostelos/recyclebinImg/complaint.png",
  Others: "https://asset.techjose.com/Hostelos/recyclebinImg/others.png",
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
