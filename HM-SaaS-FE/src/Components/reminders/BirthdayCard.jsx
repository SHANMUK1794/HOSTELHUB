import React from "react";

const BirthdayCard = ({
  name,
  room,
  year,
  days,
  dateLabel,
  role,
  index = 0,
}) => {
  const isToday = days?.toLowerCase()?.trim() === "today";

  // Today cards keep their vibrant celebratory gradients — these are intentional
  // semantic decorations tied to the birthday-today state, not UI chrome.
  const todayGradients = [
    "linear-gradient(135deg,#FF8A3D 0%, #C86500 100%)",
    "linear-gradient(135deg,#7B61FF 0%, #5B3DF5 100%)",
    "linear-gradient(135deg,#00B894 0%, #008C72 100%)",
    "linear-gradient(135deg,#FF5FA2 0%, #D63384 100%)",
    "linear-gradient(135deg,#FFD83D 0%, #B28A00 100%)",
    "linear-gradient(135deg,#00C6FF 0%, #0072FF 100%)",
    "linear-gradient(135deg,#F857A6 0%, #FF5858 100%)",
  ];

  const todayBg = todayGradients[index % todayGradients.length];

  return (
    <div
      className="relative overflow-visible w-[190px] h-[175px] rounded-[18px] flex flex-col items-center
        transition-all duration-300
        max-[769px]:w-[175px] max-[769px]:h-[165px]
        max-[426px]:w-[160px] max-[426px]:h-[150px]"
      style={{
        background: isToday ? todayBg : "var(--theme-card-bg)",
        border: isToday ? "none" : "1px solid var(--theme-secondary-card-bg)",
        boxShadow: isToday
          ? "0px 2px 10px rgba(255,140,64,0.25)"
          : "0px 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* FLAGS */}
      {isToday && (
        <div className="absolute top-0 left-0 w-full z-20">
          <img
            src="https://asset.techjose.com/Hostelos/remindersimages/flags.png"
            alt="flags"
            className="w-full h-[38px] object-cover"
          />
        </div>
      )}

      {/* BALLOONS */}
      {isToday && (
        <img
          src="https://asset.techjose.com/Hostelos/remindersimages/baloon.png"
          alt="balloons"
          className="absolute top-[-44px] right-[-12px] w-[105px] object-contain z-20 pointer-events-none"
        />
      )}

      {/* PROFILE CIRCLE */}
      <div className="mt-3 z-20">
        <div
          className="w-[52px] h-[52px] rounded-full border-[3px] flex items-center justify-center text-[26px] font-medium"
          style={{
            borderColor: "var(--theme-accent)",
            backgroundColor: "var(--theme-card-bg)",
            color: "var(--theme-accent)",
          }}
        >
          {name?.charAt(0)?.toUpperCase()}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center mt-3 px-3 text-center z-20">
        {/* NAME */}
        <h2
          className="text-[15px] font-semibold leading-[18px]"
          style={{
            color: isToday ? "#ffffff" : "var(--theme-primary-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          {name}
        </h2>

        {/* ROOM */}
        <p
          className="text-[11px] mt-1"
          style={{
            color: isToday ? "#ffffff" : "var(--theme-muted-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          {role === "employee"
            ? `Employee | ${year}`
            : `Room ${room} | ${year}`}
        </p>

        {/* DATE */}
        <p
          className="text-[11px] mt-[2px]"
          style={{
            color: isToday ? "#ffffff" : "var(--theme-muted-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          {dateLabel}
        </p>
      </div>

      {/* BADGE */}
      <div className="absolute bottom-3 z-20">
        <span
          className="px-3 py-[2px] rounded-full text-[11px] font-semibold"
          style={
            isToday
              ? {
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-primary-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }
              : {
                  backgroundColor: "var(--theme-filter-bg)",
                  color: "var(--theme-accent)",
                  fontFamily: "var(--theme-font-family-primary)",
                }
          }
        >
          {isToday ? "Today!" : days}
        </span>
      </div>
    </div>
  );
};

export default BirthdayCard;
