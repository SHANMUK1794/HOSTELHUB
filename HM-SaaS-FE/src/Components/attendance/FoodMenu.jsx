import React, { useState, useMemo } from "react";
import { useTodayMenu } from "../../hooks/useTodayMenu";
import { FaArrowLeft } from "react-icons/fa";
import axiosInstance from "../../utils/AxiosInstance"; // 🚨 Import this

const FoodMenu = ({ onClose, branchName }) => {
  const [step, setStep] = useState(1);
  const [menuType, setMenuType] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState("breakfast");

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const formattedMealTime =
    selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1);

  const {
    data: menuData,
    isLoading,
    error,
  } = useTodayMenu({
    date: todayDate,
    mealTime: formattedMealTime,
    branchName: branchName,
  });

  // 🚨 UTILITY: Smart Image Resolver for Local/Cloud/Blob paths
  const getImageUrl = (path) => {
    if (!path || path === "undefined") return null;
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
    
    const BASE_URL = axiosInstance.defaults.baseURL || "http://localhost:5000";
    const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return `${cleanBase}${cleanPath}`;
  };

  if (isLoading) {
    return (
      <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
        <div
          className="rounded-2xl shadow-xl p-10"
          style={{ backgroundColor: "var(--theme-card-bg)" }}
        >
          <p
            className="text-xl font-semibold"
            style={{
              color: "var(--theme-primary-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Loading today's menu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
        <div
          className="rounded-2xl shadow-xl p-10 relative"
          style={{ backgroundColor: "var(--theme-card-bg)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl font-bold hover:text-red-500 transition-colors"
            style={{ color: "var(--theme-muted-text)" }}
          >
            ×
          </button>
          <p className="text-xl font-semibold text-red-600 mt-4">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const targetKey = menuType === "Non-Veg" ? "NonVeg" : "Veg";
  const rawItems = menuData?.[targetKey] || menuData?.[targetKey.toLowerCase()] || menuData?.["non_veg"] || [];

  const currentMealItems = rawItems.map((item) =>
    typeof item === "string" ? item : item?.name || "Unnamed",
  );

  const displayImage =
    rawItems.length > 0 && rawItems[0]?.image
      ? rawItems[0].image
      : "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=400&fit=crop";

  const handleSelection = (type) => {
    setMenuType(type);
    setStep(2);
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
      {/* STEP 1: SELECTION */}
      {step === 1 && (
        <div
          className="rounded-[20px] shadow-2xl w-full max-w-[550px] p-10 relative text-center"
          style={{ backgroundColor: "var(--theme-card-bg)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-2xl font-bold hover:text-red-500 transition-colors"
            style={{ color: "var(--theme-muted-text)" }}
          >
            ×
          </button>

          <div
            className="flex justify-center items-center gap-2 mb-6"
            style={{ color: "var(--theme-accent)" }}
          >
            <span className="text-3xl">🍽️</span>
            <h2
              className="text-[28px] font-bold"
              style={{ fontFamily: "var(--theme-font-family-primary)" }}
            >
              Food Menu
            </h2>
          </div>

          <h3
            className="text-[24px] font-semibold mb-8"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Select Veg or Non-veg ?
          </h3>

          <div className="flex justify-center gap-6">
            {/* Veg / Non-Veg use semantic food-category colors — kept fixed */}
            <button
              onClick={() => handleSelection("Veg")}
              className="text-white text-xl font-semibold py-3 px-10 rounded-[15px] hover:scale-105 transition-transform"
              style={{
                backgroundColor: "#008000",
                boxShadow: "0 4px 15px rgba(0,128,0,0.4)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Veg
            </button>
            <button
              onClick={() => handleSelection("Non-Veg")}
              className="text-white text-xl font-semibold py-3 px-8 rounded-[15px] hover:scale-105 transition-transform"
              style={{
                backgroundColor: "#FF0000",
                boxShadow: "0 4px 15px rgba(255,0,0,0.4)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Non-Veg
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div
          className="rounded-[20px] shadow-2xl w-full max-w-[650px] p-8 relative"
          style={{ backgroundColor: "var(--theme-card-bg)" }}
        >
          <div className="flex justify-between items-center mb-8 relative">
            <button
              onClick={() => setStep(1)}
              className="text-2xl transition-colors"
              style={{ color: "var(--theme-primary-text)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--theme-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--theme-primary-text)")
              }
            >
              <FaArrowLeft />
            </button>

            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
              style={{ color: "var(--theme-accent)" }}
            >
              <span className="text-3xl">🍽️</span>
              <h2
                className="text-[28px] font-bold"
                style={{ fontFamily: "var(--theme-font-family-primary)" }}
              >
                Food Menu
              </h2>
            </div>

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                backgroundColor: menuType === "Veg" ? "#008000" : "#FF0000",
              }}
            >
              {menuType === "Veg" ? "V" : "NV"}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left Box */}
            <div
              className="flex-1 rounded-[20px] p-6 flex gap-6 shadow-sm min-h-[250px]"
              style={{ backgroundColor: "var(--theme-filter-bg)" }}
            >
              <div
                className="w-[140px] h-[140px] rounded-xl overflow-hidden shadow-md flex-shrink-0"
                style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}
              >
                <img
                  src={getImageUrl(displayImage) || "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=400&fit=crop"}
                  alt="Food"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=400&fit=crop"; }}
                />
              </div>
              <div className="flex flex-col gap-3 justify-center">
                {currentMealItems.length > 0 ? (
                  currentMealItems.map((item, i) => (
                    <p
                      key={i}
                      className="font-semibold text-[18px] capitalize"
                      style={{
                        color: "var(--theme-heading-text)",
                        fontFamily: "var(--theme-font-family-primary)",
                      }}
                    >
                      {item}
                    </p>
                  ))
                ) : (
                  <p
                    className="italic"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No items available
                  </p>
                )}
              </div>
            </div>

            {/* Right Box: Meal Tabs */}
            <div className="w-[160px] flex flex-col gap-4 justify-center">
              {["breakfast", "lunch", "dinner"].map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className="w-full py-2.5 rounded-full text-[17px] font-medium transition-all"
                  style={
                    selectedMeal === meal
                      ? {
                          backgroundColor: "var(--theme-button-bg)",
                          color: "var(--theme-button-text)",
                          border: "1px solid var(--theme-button-bg)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "var(--theme-accent)",
                          border: "1px solid var(--theme-accent)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (selectedMeal !== meal)
                      e.currentTarget.style.backgroundColor =
                        "var(--theme-filter-bg)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMeal !== meal)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodMenu;