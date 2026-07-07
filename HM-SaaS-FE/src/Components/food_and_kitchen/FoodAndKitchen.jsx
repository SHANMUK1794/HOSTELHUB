import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import LottieLoader from "../../Components/common_components/LottieLoader";
import { useFoodDash } from "../../hooks/useFoodDash";
import { useTodayMenu } from "../../hooks/useTodayMenu";
import FoodMenuCard from "./FoodMenuCard";

const FoodAndKitchen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Chef"
        ? user?.branchName
        : null ||
          localStorage.getItem("branchName") ||
          user?.branchName ||
          selectedBranch ||
          null;

  const { apiDate, displayDate, mealTime } = useMemo(() => {
    const currDate = new Date();
    const displayDate = currDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const apiDate = currDate.toISOString().split("T")[0];

    const hours = currDate.getHours();
    let mealTime = "No Meal";
    if (hours >= 5 && hours < 11) mealTime = "Breakfast";
    else if (hours >= 11 && hours < 16) mealTime = "Lunch";
    else if (hours >= 16 || hours < 5) mealTime = "Dinner";

    return { apiDate, displayDate, mealTime };
  }, []);

  const { data: summaryData } = useFoodDash({
    date: apiDate,
    mealTime,
    branchName,
  });
  const { data: todayMenuData, isLoading: isTodayMenuLoading } = useTodayMenu({
    date: apiDate,
    mealTime,
    branchName,
  });

  const responseData =
    summaryData?.data?.data || summaryData?.data || summaryData || {};
  const rawMenu =
    todayMenuData?.data?.data || todayMenuData?.data || responseData?.dish;
  const menuObject = rawMenu || { Veg: [], NonVeg: [] };

  const totalPresent =
    responseData?.totals?.totalPresent ?? responseData?.totalPresent ?? 0;
  const totalVeg =
    responseData?.totals?.totalVeg ??
    responseData?.totalVeg ??
    responseData?.vegCount ??
    0;
  const totalNonVeg =
    responseData?.totals?.totalNonVeg ??
    responseData?.totalNonVeg ??
    responseData?.nonVegCount ??
    0;

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
      className="p-4 md:p-6 min-h-screen"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {/* --- TOP BANNER --- */}
      <div
        className="rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center relative overflow-hidden mb-8"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <div className="z-10 w-full md:w-3/4">
          <h1
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Food and Kitchen
          </h1>

          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {cards.map(({ img, text, path }, idx) => {
              const isActive = location.pathname === path;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(path)}
                  className="shrink-0 w-[130px] md:w-[145px] cursor-pointer flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-md"
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
                    className="h-[85px] flex items-center justify-center p-2"
                    style={{ backgroundColor: "var(--theme-filter-bg)" }}
                  >
                    <img
                      src={img}
                      alt={text}
                      className="max-h-full object-contain mix-blend-multiply rounded-md"
                    />
                  </div>
                  <div
                    className="py-2 text-center text-xs md:text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? "var(--theme-button-bg)"
                        : "var(--theme-app-bg)",
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

      {/* --- MAIN CONTENT ROW --- */}
      <div className="flex flex-col lg:flex-row gap-6 w-full mx-auto">
        {/* Left Column: Today's Meal */}
        <div
          className="rounded-3xl shadow-sm p-6 w-full lg:w-[35%] flex flex-col"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            border: "1px solid var(--theme-secondary-card-bg)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-xl md:text-2xl font-bold"
              style={{
                color: "var(--theme-heading-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Today's {mealTime}
            </h3>
            <div
              className="flex items-center gap-2 font-semibold text-sm md:text-base"
              style={{ color: "var(--theme-primary-text)" }}
            >
              <FaCalendarAlt style={{ color: "var(--theme-primary-text)" }} />
              <span>{displayDate}</span>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto bg-gray-100 rounded-2xl overflow-hidden mb-6 min-h-[160px] h-[180px]">
            <img
              src={"https://asset.techjose.com/Hostelos/Kitchen/breakfast.png"}
              className="w-full h-full object-cover"
              alt="Meal"
            />
          </div>

          <div className="flex-1 flex flex-col items-center w-full">
            {isTodayMenuLoading ? (
              <div className="flex justify-center mt-4">
                <LottieLoader />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <FoodMenuCard menuData={menuObject} />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Meal Preference */}
        <div
          className="rounded-3xl shadow-sm p-6 w-full lg:w-[65%]"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            border: "1px solid var(--theme-secondary-card-bg)",
          }}
        >
          <div className="mb-8">
            <h3
              className="text-xl md:text-2xl font-bold"
              style={{
                color: "var(--theme-heading-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Meal Preference : {totalPresent}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 h-auto sm:h-[75%]">
            {/* Veg Card */}
            <div
              className="flex-1 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-start min-h-[220px]"
              style={{ backgroundColor: "var(--theme-filter-bg)" }}
            >
              <div className="z-10 mt-2 w-max relative">
                <div
                  className="px-5 py-4 rounded-xl flex flex-col items-start shadow-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    border: "1px solid var(--theme-secondary-card-bg)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    No. Of Vegetarian
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-bold"
                    style={{ color: "var(--theme-heading-text)" }}
                  >
                    {totalVeg}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 bg-[#008000] text-white px-4 py-1.5 rounded-full w-max text-sm font-medium z-10 shadow-sm">
                <img
                  src={
                    "https://asset.techjose.com/Hostelos/Kitchen/vegicon.svg"
                  }
                  alt="veg"
                  className="w-4 h-4"
                />{" "}
                Veg
              </div>
              <img
                src={"https://asset.techjose.com/Hostelos/Kitchen/chef.png"}
                alt="Chef"
                className="absolute bottom-0 -right-2 h-[75%] object-contain drop-shadow-[0_0_20px_rgba(34,197,94,0.3)] pointer-events-none"
              />
            </div>

            {/* Non-Veg Card */}
            <div
              className="flex-1 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-start min-h-[220px]"
              style={{ backgroundColor: "var(--theme-filter-bg)" }}
            >
              <div className="z-10 mt-2 w-max relative">
                <div
                  className="px-5 py-4 rounded-xl flex flex-col items-start shadow-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    border: "1px solid var(--theme-secondary-card-bg)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    No. Of Non-Vegetarian
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-bold"
                    style={{ color: "var(--theme-heading-text)" }}
                  >
                    {totalNonVeg}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 bg-[#FF0000] text-white px-4 py-1.5 rounded-full w-max text-sm font-medium z-10 shadow-sm">
                <img
                  src={
                    "https://asset.techjose.com/Hostelos/Kitchen/nonvegicon.svg"
                  }
                  alt="nonveg"
                  className="w-4 h-4"
                />{" "}
                Non-Veg
              </div>
              <img
                src={"https://asset.techjose.com/Hostelos/Kitchen/chef.png"}
                alt="Chef"
                className="absolute bottom-0 -right-2 h-[75%] object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.3)] pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodAndKitchen;
