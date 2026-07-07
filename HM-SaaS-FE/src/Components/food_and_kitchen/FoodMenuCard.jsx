import React, { useState } from "react";

const FoodMenuCard = ({ menuData }) => {
  const [activeTab, setActiveTab] = useState("Veg");

  const isArray = Array.isArray(menuData);
  let currentDishes = [];

  if (isArray) {
    currentDishes = activeTab === "Veg" ? menuData : [];
  } else {
    currentDishes = menuData?.[activeTab] || [];
  }

  const getDishName = (dish) => {
    if (typeof dish === "string") return dish;
    if (dish?.name) return dish.name;
    return "Unnamed Dish";
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl p-6 shadow-sm transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-filter-bg)" }}
    >
      {/* ================= TOGGLE BUTTONS ================= */}
      <div
        className="flex justify-center rounded-full p-1 mb-6"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={() => setActiveTab("Veg")}
          className="w-1/2 flex items-center justify-center gap-2 py-2 rounded-full font-semibold transition-all duration-300"
          style={{
            backgroundColor: activeTab === "Veg" ? "#008000" : "transparent",
            color: activeTab === "Veg" ? "#ffffff" : "var(--theme-muted-text)",
            boxShadow:
              activeTab === "Veg" ? "0 2px 6px rgba(0,0,0,0.15)" : undefined,
          }}
        >
          <span className="text-lg">🥬</span>
          <span>Veg</span>
        </button>

        <button
          onClick={() => setActiveTab("NonVeg")}
          className="w-1/2 flex items-center justify-center gap-2 py-2 rounded-full font-semibold transition-all duration-300"
          style={{
            backgroundColor: activeTab === "NonVeg" ? "#FF0000" : "transparent",
            color:
              activeTab === "NonVeg" ? "#ffffff" : "var(--theme-muted-text)",
            boxShadow:
              activeTab === "NonVeg" ? "0 2px 6px rgba(0,0,0,0.15)" : undefined,
          }}
        >
          <span className="text-lg">🍗</span>
          <span>Non-Veg</span>
        </button>
      </div>

      {/* ================= FOOD LIST DISPLAY ================= */}
      <div className="flex flex-wrap gap-3">
        {currentDishes.length > 0 ? (
          currentDishes.map((dish, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                border: "1px solid var(--theme-secondary-card-bg)",
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: activeTab === "Veg" ? "#008000" : "#FF0000" }}
              >
                {index + 1}
              </span>
              <span
                className="font-medium capitalize"
                style={{ color: "var(--theme-primary-text)" }}
              >
                {getDishName(dish)}
              </span>
            </div>
          ))
        ) : (
          <div
            className="w-full text-center py-8 italic"
            style={{ color: "var(--theme-muted-text)" }}
          >
            No {activeTab} items set for today.
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodMenuCard;
