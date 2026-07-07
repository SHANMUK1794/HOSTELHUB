import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import NewBookingPopup from "./NewBookingPopup";
import EditBookingPopup from "./EditBookingPopup";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useCylinders } from "../../../../hooks/useCylinder";
import LottieLoader from "../../../../Components/common_components/LottieLoader";
import DatePicker from "../../../../Components/common_components/DatePicker";
import { useQueryClient } from "@tanstack/react-query";
import Export from "./CylinderExport";
import ToastMessage from "../../../../Components/common_components/ToastMessage";
import { FaPlus } from "react-icons/fa6";
import Delete from "../../../../Components/common_components/Delete";

const LpgCylinderMain = () => {
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

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

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

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

  const year =
    selectedYearMonth && selectedYearMonth !== "all-all"
      ? selectedYearMonth.split("-")[0]
      : "all";
  const month =
    selectedYearMonth && selectedYearMonth !== "all-all"
      ? selectedYearMonth.split("-")[1]
      : "all";
  const apiYear = year === "all" ? "" : year;
  const apiMonth = month === "all" ? "" : month;

  const { cylinders, isLoading, isError, deleteCylinder } = useCylinders(
    apiYear,
    apiMonth,
    branchName,
    { showToast }
  );

  useEffect(() => {
    queryClient.invalidateQueries(["cylinders"]);
  }, [branchName, queryClient]);

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

  const filteredCylinders = useMemo(() => {
    if (!cylinders || cylinders.length === 0) return [];
    if (
      !selectedYearMonth ||
      selectedYearMonth === "all" ||
      selectedYearMonth === "all-all"
    )
      return cylinders;
    return cylinders.filter((cyl) => {
      if (!cyl.date) return false;
      const d = new Date(cyl.date);
      const cylYear = d.getFullYear().toString();
      const cylMonth = d
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      return (
        (year === "all" || cylYear === year) &&
        (month === "all" || cylMonth === month)
      );
    });
  }, [cylinders, selectedYearMonth, year, month]);

  const totalAmount = filteredCylinders.reduce(
    (sum, cyl) => sum + (Number(cyl.amount) || 0),
    0,
  );

  if (isLoading) return <LottieLoader />;
  if (isError)
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        Failed to load cylinders.
      </div>
    );

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

      {/* --- MAIN CONTENT --- */}
      <div
        className="rounded-3xl shadow-sm p-6 md:p-8"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Gas Cylinder
        </h2>

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
          <div className="flex flex-wrap gap-4">
            <div
              className="text-white rounded-xl px-6 py-4 w-56 shadow-sm flex flex-col justify-center items-center"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
            >
              <span className="text-sm font-medium opacity-90 italic text-center leading-tight">
                Total Amount
                <br />
                Spent this month
              </span>
              <span className="text-xl font-bold mt-2">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div
              className="text-white rounded-xl px-6 py-4 w-56 shadow-sm flex flex-col justify-center items-center"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
            >
              <span className="text-sm font-medium opacity-90 italic text-center leading-tight">
                Cylinder type &<br />
                Vendor
              </span>
              <span className="text-base font-semibold mt-2 text-center">
                Commercial | Indane
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 w-full xl:w-auto">
            <div className="flex flex-wrap gap-3 justify-end w-full">
              <button
                onClick={() => setShowBookingPopup(true)}
                className="text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--theme-accent-hover)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--theme-button-bg)")
                }
              >
                <FaPlus /> Add New Bookings
              </button>
              <div className="h-[40px]">
                <Export branchName={branchName} year={year} month={month} showToast={showToast} />
              </div>
            </div>
            <div className="flex gap-3 justify-end w-full">
              <DatePicker
                selectedYearMonth={selectedYearMonth}
                onChange={(value) => setSelectedYearMonth(value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto rounded-xl shadow-sm"
          style={{
            border: "1px solid var(--theme-secondary-card-bg)",
            backgroundColor: "var(--theme-card-bg)",
          }}
        >
          <table className="w-full text-center whitespace-nowrap border-collapse">
            <thead
              className="text-white text-[15px] font-semibold"
              style={{ backgroundColor: "var(--theme-table-header-bg)" }}
            >
              <tr>
                <th className="px-4 py-4 rounded-tl-xl">Booking Date</th>
                <th className="px-4 py-4">Received Date</th>
                <th className="px-4 py-4">Install Date</th>
                <th className="px-4 py-4">Empty Date</th>
                <th className="px-4 py-4">Capacity</th>
                <th className="px-4 py-4">Qty</th>
                <th className="px-4 py-4">Amt</th>
                <th className="px-4 py-4">Usage</th>
                <th className="px-4 py-4 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody
              className="text-[15px]"
              style={{ color: "var(--theme-primary-text)" }}
            >
              {filteredCylinders.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="py-10 text-center font-medium"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No cylinder data available.
                  </td>
                </tr>
              ) : (
                filteredCylinders.map((cyl, i) => (
                  <tr
                    key={cyl._id || i}
                    className="border-b transition-colors"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "var(--theme-table-row-bg)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--theme-filter-bg)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--theme-table-row-bg)")
                    }
                  >
                    <td className="px-4 py-4">
                      {new Date(cyl.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-4">
                      {cyl.deliverydate
                        ? new Date(cyl.deliverydate).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      {cyl.installeddate
                        ? new Date(cyl.installeddate).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      {cyl.emptydate
                        ? new Date(cyl.emptydate).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {cyl.capacity || "-"}
                    </td>
                    <td className="px-4 py-4">{cyl.quantity || 0}</td>
                    <td className="px-4 py-4 font-medium">{cyl.amount || 0}</td>
                    <td className="px-4 py-4">
                      {cyl.usage ? `${cyl.usage} days` : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(cyl);
                            setShowEditPopup(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition"
                          style={{
                            border: "1px solid var(--theme-secondary-card-bg)",
                            backgroundColor: "var(--theme-filter-bg)",
                          }}
                        >
                          <MdEdit
                            className="w-4 h-4"
                            style={{ color: "var(--theme-primary-text)" }}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDeleteId(cyl._id);
                            setIsOpenDelete(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition"
                          style={{
                            border: "1px solid #FF0000",
                            backgroundColor: "#FFF0F0",
                          }}
                        >
                          <RiDeleteBin6Fill className="text-[#FF0000] w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBookingPopup && (
        <NewBookingPopup onClose={() => setShowBookingPopup(false)} showToast={showToast} />
      )}
      {showEditPopup && selectedBooking && (
        <EditBookingPopup
          bookingData={selectedBooking}
          onClose={() => setShowEditPopup(false)}
          showToast={showToast}
        />
      )}
      {isOpenDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            deleteData={async (id) => {
              await deleteCylinder.mutateAsync(id);
              showToast("Cylinder deleted successfully!", "success");
            }}
            selectedId={selectedDeleteId}
            refetch={() => queryClient.invalidateQueries(["cylinders"])}
          />
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

export default LpgCylinderMain;
