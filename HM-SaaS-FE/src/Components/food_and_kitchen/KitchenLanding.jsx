import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/ThemeContext";

const KitchenLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {theme} = useTheme()

  const cards = [
    {
      img: "https://asset.techjose.com/Hostelos/Kitchen/FoodandKitchen.jpg",
      text: "Food and Kitchen",
      path: "/FoodAndKitchen",
    },
    {
      img: "https://asset.techjose.com/Hostelos/Kitchen/KitchenMenu.jpg",
      text: "Kitchen Menu",
      path: "/KitchenMenu",
    },
    {
      img: "https://asset.techjose.com/Hostelos/Kitchen/KitchenExpance.png",
      text: "Kitchen Expense",
      path: "/KitchenExpenses",
    },
    {
      img: "https://asset.techjose.com/Hostelos/Kitchen/kitcheninventory.jpg",
      text: "Kitchen Inventory",
      path: "/KitchenInventory",
    },
    {
      img: "https://asset.techjose.com/Hostelos/Kitchen/GasandCylinder.jpg",
      text: "Gas Cylinder",
      path: "/LpgCylinderMain",
    },
  ];

  return (
    <div
      className="p-4 min-h-screen md:p-6"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {/* Top Banner */}
      <div
        className="rounded-2xl shadow-sm p-4 md:p-6 md:flex-row relative overflow-hidden mb-8"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <div className="z-10 relative w-full md:w-3/4">
          <h1
            className="text-3xl md:text-4xl font-bold mb-5"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Kitchen Dashboard
          </h1>

          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {cards.map(({ img, text, path }, idx) => {
              const isActive = location.pathname === path;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(path)}
                  className="w-[130px] shrink-0 md:w-[145px] cursor-pointer flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-md"
                  style={{
                    border: isActive
                      ? "1px solid var(--theme-accent)"
                      : "1px solid #e5e7eb",
                    boxShadow: isActive
                      ? "0 1px 3px rgba(0,0,0,0.1)"
                      : undefined,
                  }}
                >
                  <div
                    className="h-[92px] md:h-[96px] flex items-center justify-center p-2"
                    style={{ backgroundColor: "var(--theme-filter-bg)" }}
                  >
                    <img
                      src={img}
                      alt={text}
                      className="max-h-full w-full object-contain mix-blend-multiply rounded-md"
                    />
                  </div>
                  <div
                    className="flex items-center justify-center py-2 px-2 text-center text-xs md:text-sm font-semibold leading-tight transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? "var(--theme-button-bg)"
                        : "var(--theme-card-bg)",
                      color: isActive
                        ? "var(--theme-button-text)"
                        : "var(--theme-heading-text)",
                    }}
                  >
                    {text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block absolute right-0 bottom-0 top-0 w-1/4 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, color-mix(in srgb, var(--theme-accent) 10%, transparent), transparent)",
            }}
          ></div>
          <img
            src={"https://asset.techjose.com/Hostelos/Kitchen/chef.png"}
            alt="Chef"
            className="absolute bottom-0 right-4 h-[85%] object-contain origin-bottom"
          />
        </div>
      </div>

      {/* What You Can Manage */}
      <div className="flex flex-col items-center justify-center mt-12">
        <h2
          className="text-center text-2xl md:text-3xl font-bold mb-8"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          What You Can Manage
        </h2>
        <div className="mb-6 w-36 sm:w-40 md:w-44">
          <img
            src={theme?.images?.kitchenLanding}
            alt="Manage Features"
            className="w-full object-contain"
          />
        </div>
        <p
          className="font-medium text-center max-w-2xl text-[15px] md:text-[16px] leading-relaxed px-4"
          style={{ color: "var(--theme-primary-text)" }}
        >
          Food preparation & serving management, Daily / Weekly menu planning
          Kitchen expense tracking, Inventory stock monitoring, Gas cylinder
          usage tracking.
        </p>
      </div>
    </div>
  );
};

export default KitchenLanding;
