import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BiPlusCircle, BiTrash } from "react-icons/bi";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useMenu } from "../../../../hooks/useMenu";
import axiosInstance from "../../../../utils/AxiosInstance";
import ToastMessage from "../../../common_components/ToastMessage";

const getObjectByName = (array, key, value) => {
  if (!Array.isArray(array)) return undefined;
  return array.find(
    (arr) =>
      String(arr[key] || "")
        .trim()
        .toLowerCase() ===
      String(value || "")
        .trim()
        .toLowerCase(),
  );
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const mealList = [
  {
    label: "Break fast",
    key: "Breakfast",
    img: "https://asset.techjose.com/Hostelos/Kitchen/breakfast.png",
  },
  {
    label: "Lunch",
    key: "Lunch",
    img: "https://asset.techjose.com/Hostelos/Kitchen/lunch.png",
  },
  {
    label: "Dinner",
    key: "Dinner",
    img: "https://asset.techjose.com/Hostelos/Kitchen/dinner.png",
  },
];

const KitchenMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : (user?.role === "Chef" ? user?.branchName : null) ||
        user?.branchName ||
        selectedBranch ||
        null;

  // const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(new Date().getDay());
  const [menuType, setMenuType] = useState("Veg");

  const [toastConfig, setToastConfig] = useState({ show: false, text: "", success: false, failed: false });

  const showToast = (text, type) => {
    setToastConfig({ show: true, text, success: type === "success", failed: type === "error" });
    setTimeout(() => {
      setToastConfig({ show: false, text: "", success: false, failed: false });
    }, 3000);
  };

  const closeToast = () => {
    setToastConfig({ show: false, text: "", success: false, failed: false });
  };

  const { updateMenu, createMenu, data: menuData } = useMenu(branchName, { showToast });
  const kitchenmenu = useSelector((state) => state.kitchenmenu) || {};
  const { menu } = kitchenmenu;

  const todayMenu = useMemo(() => {
    return getObjectByName(menu, "day", fullDays[selectedDayIdx]) || {};
  }, [menu, selectedDayIdx]);

  const [mealStates, setMealStates] = useState(() =>
    mealList.map(() => ({ vegDishes: [], nonVegDishes: [], editing: false })),
  );

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "add",
    mealIdx: null,
    dishIdx: null,
    foodName: "",
    imagePreview: null,
    fileObj: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setMealStates(
      mealList.map((meal) => {
        const found = todayMenu?.[meal.key];
        const normalizeDishes = (dishes) => {
          if (!Array.isArray(dishes)) return [];
          return dishes.map((d) =>
            typeof d === "string" ? { name: d, image: null } : d,
          );
        };
        let veg = [],
          nonVeg = [];
        if (Array.isArray(found)) veg = normalizeDishes(found);
        else if (found && typeof found === "object") {
          veg = normalizeDishes(found.Veg || []);
          nonVeg = normalizeDishes(found.NonVeg || []);
        }
        return { vegDishes: veg, nonVegDishes: nonVeg, editing: false };
      }),
    );
  }, [todayMenu]);

  const openAddModal = (mealIdx) => {
    setModalConfig({
      isOpen: true,
      mode: "add",
      mealIdx,
      dishIdx: null,
      foodName: "",
      imagePreview: null,
      fileObj: null,
    });
  };
  const openEditModal = (mealIdx, dishIdx, dishObj) => {
    setModalConfig({
      isOpen: true,
      mode: "edit",
      mealIdx,
      dishIdx,
      foodName: dishObj.name || "",
      imagePreview: dishObj.image || null,
      fileObj: null,
    });
  };
  const closeModal = () => {
    if (!isUploading) setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalSave = async (addAnother = false) => {
    if (!modalConfig.foodName.trim()) {
      showToast("Please enter a food name", "error");
      return;
    }
    let finalImageUrl = modalConfig.imagePreview;
    if (modalConfig.fileObj) {
      setIsUploading(true);
      setUploadProgress(10);
      try {
        const formData = new FormData();
        formData.append("image", modalConfig.fileObj);
        const res = await axiosInstance.post(
          "/api/kitchen/v1/uploadImage",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            },
          },
        );
        if (res.data.success) finalImageUrl = res.data.imageUrl;
      } catch (err) {
        showToast("Failed to upload image. Saving without image.", "error");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
    const newDish = { name: modalConfig.foodName, image: finalImageUrl };
    setMealStates((prev) =>
      prev.map((m, idx) => {
        if (idx !== modalConfig.mealIdx) return m;
        const isVeg = menuType === "Veg";
        const targetArray = isVeg ? [...m.vegDishes] : [...m.nonVegDishes];
        if (modalConfig.mode === "add") targetArray.push(newDish);
        else if (modalConfig.mode === "edit")
          targetArray[modalConfig.dishIdx] = newDish;
        return {
          ...m,
          [isVeg ? "vegDishes" : "nonVegDishes"]: targetArray,
          editing: true,
        };
      }),
    );
    if (addAnother && modalConfig.mode === "add") {
      setModalConfig({
        ...modalConfig,
        foodName: "",
        imagePreview: null,
        fileObj: null,
      });
    } else {
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  const handleModalDelete = () => {
    setMealStates((prev) =>
      prev.map((m, idx) => {
        if (idx !== modalConfig.mealIdx) return m;
        const isVeg = menuType === "Veg";
        const targetArray = isVeg ? [...m.vegDishes] : [...m.nonVegDishes];
        targetArray.splice(modalConfig.dishIdx, 1);
        return {
          ...m,
          [isVeg ? "vegDishes" : "nonVegDishes"]: targetArray,
          editing: true,
        };
      }),
    );
    closeModal();
    showToast("Dish removed! Click Submit to save changes.", "success");
  };

  const handleDeleteMeal = (mealIdx) => {
    setMealStates((prev) =>
      prev.map((m, i) =>
        i === mealIdx
          ? {
              ...m,
              [menuType === "Veg" ? "vegDishes" : "nonVegDishes"]: [],
              editing: true,
            }
          : m,
      ),
    );
  };

  const handleSubmit = useCallback(async () => {
    const mealsToSubmit = mealList
      .map((meal, idx) => ({
        key: meal.key,
        label: meal.label,
        day: fullDays[selectedDayIdx],
        vegDishes: mealStates[idx].vegDishes.filter(Boolean),
        nonVegDishes: mealStates[idx].nonVegDishes.filter(Boolean),
        edited: mealStates[idx].editing,
      }))
      .filter((m) => m.edited);

    if (mealsToSubmit.length === 0) {
      showToast("No changes to submit!", "error"); // Changed warning to error or standard toast
      return;
    }

    await Promise.all(
      mealsToSubmit.map(async (mealBlock) => {
        const allDaysForMeal = fullDays.map((day) => {
          const existingEntry = menu.find((entry) => entry.day === day)?.[
            mealBlock.key
          ];
          const normalizeDishes = (dishes) => {
            if (!Array.isArray(dishes)) return [];
            return dishes.map((d) =>
              typeof d === "string" ? { name: d, image: null } : d,
            );
          };
          let existingVeg = [],
            existingNonVeg = [];
          if (Array.isArray(existingEntry))
            existingVeg = normalizeDishes(existingEntry);
          else if (existingEntry) {
            existingVeg = normalizeDishes(existingEntry.Veg || []);
            existingNonVeg = normalizeDishes(existingEntry.NonVeg || []);
          }
          return {
            day,
            dish: {
              Veg: day === mealBlock.day ? mealBlock.vegDishes : existingVeg,
              NonVeg:
                day === mealBlock.day ? mealBlock.nonVegDishes : existingNonVeg,
            },
          };
        });
        try {
          const payload = {
            MealTime: mealBlock.key,
            Menu: allDaysForMeal,
            branchName,
          };
          const existingMeal = menuData?.some((entry) => entry[mealBlock.key]);
          await (existingMeal
            ? updateMenu.mutateAsync(payload)
            : createMenu.mutateAsync(payload));
          showToast(`${mealBlock.label} updated!`, "success");
        } catch (err) {
          showToast("Menu update failed", "error");
        }
      }),
    );
    setMealStates((prev) => prev.map((m) => ({ ...m, editing: false })));
  }, [
    selectedDayIdx,
    mealStates,
    updateMenu,
    createMenu,
    menuData,
    menu,
    branchName,
  ]);

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

  const BASE_URL =
    axiosInstance.defaults.baseURL ||
    "https://api-techjose-hostelos.techjose.com";
  const getImageUrl = (path) => {
    if (!path || path === "undefined") return null;
    if (
      path.startsWith("http") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    )
      return path;
    const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

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
            Kitchen Menu
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

      {/* --- MAIN MENU CARD --- */}
      <div
        className="rounded-3xl shadow-sm p-6 md:p-8"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Kitchen Menu
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-6 font-medium">
            {dayLabels.map((lbl, idx) => (
              <button
                key={lbl}
                onClick={() => setSelectedDayIdx(idx)}
                className="px-3 py-1.5 rounded-full transition-colors text-sm md:text-base"
                style={{
                  backgroundColor:
                    selectedDayIdx === idx
                      ? "var(--theme-button-bg)"
                      : "transparent",
                  color:
                    selectedDayIdx === idx
                      ? "var(--theme-button-text)"
                      : "var(--theme-muted-text)",
                  boxShadow:
                    selectedDayIdx === idx
                      ? "0 1px 3px rgba(0,0,0,0.1)"
                      : undefined,
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <button
              onClick={() => setMenuType("Veg")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors"
              style={{
                borderColor: menuType === "Veg" ? "#16a34a" : "#d1d5db",
                color:
                  menuType === "Veg" ? "#15803d" : "var(--theme-muted-text)",
                backgroundColor: menuType === "Veg" ? "#f0fdf4" : "transparent",
              }}
            >
              {menuType === "Veg" ? (
                <FaCheckSquare className="text-green-600" />
              ) : (
                <FaRegSquare />
              )}{" "}
              Veg
            </button>
            <button
              onClick={() => setMenuType("Non-Veg")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors"
              style={{
                borderColor: menuType === "Non-Veg" ? "#dc2626" : "#d1d5db",
                color:
                  menuType === "Non-Veg"
                    ? "#b91c1c"
                    : "var(--theme-muted-text)",
                backgroundColor:
                  menuType === "Non-Veg" ? "#fef2f2" : "transparent",
              }}
            >
              {menuType === "Non-Veg" ? (
                <FaCheckSquare className="text-red-600" />
              ) : (
                <FaRegSquare />
              )}{" "}
              Non-Veg
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          <div className="hidden lg:flex w-1/3 justify-center items-center">
            <img
              src={"https://asset.techjose.com/Hostelos/Kitchen/chef.png"}
              alt="Chef"
              className="w-full max-w-[300px] object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]"
            />
          </div>

          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {mealList.map((meal, idx) => {
              const currentDishes =
                menuType === "Veg"
                  ? mealStates[idx].vegDishes
                  : mealStates[idx].nonVegDishes;
              return (
                <div
                  key={meal.key}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden shrink-0 hidden sm:block">
                    <img
                      src={meal.img}
                      alt={meal.label}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="flex-1 rounded-xl flex items-center shadow-sm w-full min-h-[64px] py-2 pr-4"
                    style={{ backgroundColor: "var(--theme-filter-bg)" }}
                  >
                    <div
                      className="text-white px-4 py-2 rounded-xl font-medium text-center w-32 shadow-sm whitespace-nowrap ml-[-10px] sm:ml-[-15px]"
                      style={{ backgroundColor: "var(--theme-button-bg)" }}
                    >
                      {meal.label}
                    </div>

                    <div className="flex-1 flex flex-wrap gap-3 ml-6 items-center">
                      {currentDishes.length === 0 && (
                        <span
                          className="text-sm italic"
                          style={{ color: "var(--theme-muted-text)" }}
                        >
                          No dishes added
                        </span>
                      )}
                      {currentDishes.map((dishObj, dishIdx) => (
                        <div
                          key={dishIdx}
                          onClick={() => openEditModal(idx, dishIdx, dishObj)}
                          className="pl-2 pr-3 py-1.5 rounded-lg shadow-sm text-sm font-medium cursor-pointer transition-colors flex items-center gap-2"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            border: "1px solid var(--theme-secondary-card-bg)",
                            color: "var(--theme-primary-text)",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--theme-accent)";
                            e.currentTarget.style.color = "var(--theme-accent)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--theme-secondary-card-bg)";
                            e.currentTarget.style.color =
                              "var(--theme-primary-text)";
                          }}
                          title="Click to edit or delete"
                        >
                          {dishObj?.image &&
                          typeof dishObj.image === "string" &&
                          !dishObj.image.includes("undefined") ? (
                            <img
                              src={getImageUrl(dishObj.image)}
                              alt="dish"
                              className="w-6 h-6 rounded-md object-cover bg-gray-100"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                              style={{
                                backgroundColor: "var(--theme-filter-bg)",
                                color: "var(--theme-accent)",
                              }}
                            >
                              {dishIdx + 1}
                            </div>
                          )}
                          <span>{dishObj.name}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="flex gap-2 ml-4 shrink-0 items-center pl-4"
                      style={{
                        borderLeft: "1px solid var(--theme-secondary-card-bg)",
                        color: "var(--theme-accent)",
                      }}
                    >
                      <button
                        onClick={() => openAddModal(idx)}
                        className="transition-colors p-1"
                        title="Add Dish"
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color =
                            "var(--theme-accent-hover)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = "var(--theme-accent)")
                        }
                      >
                        <BiPlusCircle size={24} />
                      </button>
                      <button
                        onClick={() => handleDeleteMeal(idx)}
                        className="transition-colors p-1 text-red-500 hover:text-red-700"
                        title="Clear All"
                      >
                        <BiTrash size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="text-white px-12 py-2.5 rounded-lg font-medium shadow-md transition-colors"
            style={{ backgroundColor: "var(--theme-button-bg)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--theme-accent-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--theme-button-bg)")
            }
          >
            Submit
          </button>
        </div>
      </div>

      {/* --- ADD / EDIT FOOD MENU MODAL --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            className="rounded-[24px] shadow-2xl w-full max-w-md p-6 relative"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            <div className="flex justify-center items-center mb-6 relative">
              <h2
                className="text-2xl font-bold"
                style={{
                  color: "var(--theme-heading-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                {modalConfig.mode === "add"
                  ? "Add Food Menu"
                  : "Edit Food Menu"}
              </h2>
              <button
                disabled={isUploading}
                onClick={closeModal}
                className="absolute right-0 transition p-1"
                style={{
                  color: "var(--theme-primary-text)",
                  opacity: isUploading ? 0.5 : 1,
                  cursor: isUploading ? "not-allowed" : "pointer",
                }}
              >
                <FiX size={26} />
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              className="rounded-[20px] p-6 flex flex-col items-center justify-center text-center mb-4"
              style={{
                border: "2px dashed var(--theme-secondary-card-bg)",
                backgroundColor: "var(--theme-filter-bg)",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (isUploading) return;
                const file = e.dataTransfer.files[0];
                if (file)
                  setModalConfig({
                    ...modalConfig,
                    imagePreview: URL.createObjectURL(file),
                    fileObj: file,
                  });
              }}
            >
              {modalConfig.imagePreview &&
              typeof modalConfig.imagePreview === "string" &&
              !modalConfig.imagePreview.includes("undefined") ? (
                <img
                  src={getImageUrl(modalConfig.imagePreview)}
                  alt="Preview"
                  className="h-32 object-contain rounded-md"
                  onError={(e) => {
                    e.target.src =
                      "https://asset.techjose.com/Hostelos/Kitchen/upload_illustration.png";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={
                      "https://asset.techjose.com/Hostelos/Kitchen/upload_illustration.png"
                    }
                    alt="Upload"
                    className="w-[180px] h-auto mb-2 object-contain"
                  />
                  <p
                    className="font-medium text-sm"
                    style={{ color: "var(--theme-accent)" }}
                  >
                    Drag & Drop your file here
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-6">
              <label
                className="px-8 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                style={{
                  backgroundColor: isUploading
                    ? "#9ca3af"
                    : "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  cursor: isUploading ? "not-allowed" : "pointer",
                }}
              >
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      setModalConfig({
                        ...modalConfig,
                        imagePreview: URL.createObjectURL(file),
                        fileObj: file,
                      });
                  }}
                />
              </label>
            </div>

            <div className="mb-6">
              <label
                className="block text-[15px] font-medium mb-2"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Food Name
              </label>
              <input
                type="text"
                placeholder="Enter Food name"
                value={modalConfig.foodName}
                disabled={isUploading}
                onChange={(e) =>
                  setModalConfig({ ...modalConfig, foodName: e.target.value })
                }
                className="w-full rounded-xl px-4 py-3 transition"
                style={{
                  border: "1px solid var(--theme-secondary-card-bg)",
                  backgroundColor: "var(--theme-filter-bg)",
                  color: "var(--theme-primary-text)",
                  outline: "none",
                  opacity: isUploading ? 0.6 : 1,
                }}
              />
            </div>

            {isUploading && uploadProgress > 0 && (
              <div
                className="w-full rounded-full h-2.5 mb-6 shadow-inner"
                style={{ backgroundColor: "var(--theme-filter-bg)" }}
              >
                <div
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "var(--theme-accent)",
                  }}
                ></div>
                <p
                  className="text-xs mt-1 text-right font-medium"
                  style={{ color: "var(--theme-accent)" }}
                >
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            {modalConfig.mode === "add" ? (
              <div className="flex justify-center gap-4">
                <button
                  disabled={isUploading}
                  onClick={() => handleModalSave(true)}
                  className="border px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2"
                  style={{
                    borderColor: isUploading
                      ? "#d1d5db"
                      : "var(--theme-accent)",
                    color: isUploading
                      ? "var(--theme-muted-text)"
                      : "var(--theme-accent)",
                    backgroundColor: "var(--theme-card-bg)",
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  <BiPlusCircle size={18} />{" "}
                  {isUploading ? "Uploading..." : "Add Items"}
                </button>
                <button
                  disabled={isUploading}
                  onClick={() => handleModalSave(false)}
                  className="px-10 py-2.5 rounded-xl font-medium transition shadow-sm"
                  style={{
                    backgroundColor: isUploading
                      ? "#9ca3af"
                      : "var(--theme-button-bg)",
                    color: "var(--theme-button-text)",
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploading ? "Please wait..." : "Save"}
                </button>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <button
                  disabled={isUploading}
                  onClick={handleModalDelete}
                  className="border px-8 py-2.5 rounded-xl font-medium transition shadow-sm flex items-center gap-2"
                  style={{
                    borderColor: "#d1d5db",
                    color: isUploading
                      ? "var(--theme-muted-text)"
                      : "var(--theme-primary-text)",
                    backgroundColor: isUploading
                      ? "var(--theme-filter-bg)"
                      : "var(--theme-card-bg)",
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  <BiTrash size={18} /> Delete
                </button>
                <button
                  disabled={isUploading}
                  onClick={() => handleModalSave(false)}
                  className="px-10 py-2.5 rounded-xl font-medium transition shadow-sm"
                  style={{
                    backgroundColor: isUploading
                      ? "#9ca3af"
                      : "var(--theme-button-bg)",
                    color: "var(--theme-button-text)",
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploading ? "Uploading..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default KitchenMenu;
