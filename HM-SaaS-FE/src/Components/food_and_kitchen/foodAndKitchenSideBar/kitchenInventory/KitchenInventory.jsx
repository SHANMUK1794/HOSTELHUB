import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEye, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

import { useInventory } from "../../../../hooks/useInventory";
import Delete from "../../../common_components/Delete";
import HistoryOfInventory from "./kitchenInventoryTables/HistoryOfInventory";
import LottieLoader from "../../../common_components/LottieLoader";
import ExportInventory from "../../../common_components/ExportInventory";
import SearchBar from "../../../common_components/SearchBar";
import DatePicker from "../../../common_components/DatePicker";
import ToastMessage from "../../../common_components/ToastMessage";

const KitchenInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedYearMonth, setSelectedYearMonth] = useState("all-all");

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

  const [search, setSearch] = useState("");
  const [openInventory, setopenInventory] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [year, month] = selectedYearMonth.split("-");
  const apiYear = year === "all" ? "" : year;
  const apiMonth = month === "all" ? "" : month;

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

  const { isLoading, deleteInventoryByName } = useInventory(
    selectedYearMonth,
    { showToast }
  );

    const inventories = useSelector((state) => state.inventory) || {};
    const { inventories: kitchenInventory = [] } = inventories;

  // const { isLoading, deleteInventoryByName } = useInventory("", branchName);

  const filteredInventory = useMemo(() => {
    if (!kitchenInventory || kitchenInventory.length === 0) return [];

    let filtered = kitchenInventory.filter((inventory) => {
      if (!search) return true;
      return inventory.itemName?.toLowerCase().includes(search.toLowerCase());
    });

    if (selectedYearMonth !== "all-all") {
      const [yearFilter, monthFilter] = selectedYearMonth.split("-");
      const monthMap = {
        january: "01",
        february: "02",
        march: "03",
        april: "04",
        may: "05",
        june: "06",
        july: "07",
        august: "08",
        september: "09",
        october: "10",
        november: "11",
        december: "12",
      };

      filtered = filtered.filter((inventory) => {
        if (!inventory.date) return false;
        const [itemYear, itemMonth] = inventory.date.split("-");
        const matchYear = yearFilter === "all" || itemYear === yearFilter;
        const matchMonth =
          monthFilter === "all" || itemMonth === monthMap[monthFilter];
        return matchYear && matchMonth;
      });
    }

    return filtered;
  }, [kitchenInventory, search, selectedYearMonth]);

  useEffect(() => {
    queryClient.invalidateQueries(["inventory"]);
    queryClient.invalidateQueries(["kitchenInventory"]);
  }, [branchName, queryClient]);



  // const filteredInventory = useMemo(() => {
  //   if (!kitchenInventory || kitchenInventory.length === 0) return [];
  //   return kitchenInventory.filter((inventory) => {
  //     if (!search) return true;
  //     return inventory.itemName?.toLowerCase().includes(search.toLowerCase());
  //   });
  // }, [kitchenInventory, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedYearMonth]);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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
            Kitchen Inventory
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

      {/* --- MAIN DATA SECTION --- */}
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
          Kitchen Inventory
        </h2>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mb-8">
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-center md:justify-start">
            <DatePicker
              selectedYearMonth={selectedYearMonth}
              onChange={(value) => setSelectedYearMonth(value)}
            />
          </div>

          <div className="flex-1 w-full min-w-[250px] max-w-lg mx-auto">
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Search items name"
              containerClass="flex items-center border rounded-full px-4 py-2 w-full shadow-sm transition-colors"
              inputClass="w-full outline-none text-[15px] bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-center lg:justify-end">
            <button
              className="text-white px-5 py-2.5 rounded-lg text-[15px] font-medium flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap min-w-[130px]"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--theme-accent-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--theme-button-bg)")
              }
              onClick={() => setopenInventory(true)}
            >
              <FaEye className="text-[18px]" /> Used Items
            </button>
            <div className="h-[40px]">
              <ExportInventory
                branchName={branchName}
                year={year}
                month={month}
                showToast={showToast}
              />
            </div>
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
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
                <th className="px-6 py-4 rounded-tl-xl text-center">S.NO</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-center">Material In</th>
                <th className="px-6 py-4 text-center">Material Out</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 rounded-tr-xl text-center">Action</th>
              </tr>
            </thead>
            <tbody
              className="text-[15px]"
              style={{ color: "var(--theme-primary-text)" }}
            >
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <LottieLoader />
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center font-medium"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No stock available matching this search.
                  </td>
                </tr>
              ) : (
                currentItems.map((inventory, index) => (
                  <tr
                    key={index}
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
                    <td className="px-6 py-4 font-medium text-center">
                      {String(indexOfFirstItem + index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4 text-left font-medium">
                      {inventory.itemName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {inventory.makeIn}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {inventory.makeOut}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {inventory.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => {
                            setSelectedItemId(inventory.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition"
                          style={{
                            border: "1px solid #FF0000",
                            backgroundColor: "#FFF0F0",
                          }}
                          title="Delete"
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

        {/* PAGINATION CONTROLS */}
        {!isLoading && filteredInventory.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 px-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredInventory.length)} of{" "}
              {filteredInventory.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: "1px solid var(--theme-secondary-card-bg)",
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-accent)",
                }}
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <div
                className="px-4 py-1.5 rounded-md font-semibold text-sm"
                style={{
                  backgroundColor: "var(--theme-filter-bg)",
                  color: "var(--theme-heading-text)",
                  border: "1px solid var(--theme-secondary-card-bg)",
                }}
              >
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: "1px solid var(--theme-secondary-card-bg)",
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-accent)",
                }}
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {openInventory && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
          <HistoryOfInventory setopenInventory={setopenInventory} showToast={showToast} />
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
          <Delete
            setIsOpenDelete={setIsDeleteModalOpen}
            deleteData={deleteInventoryByName.mutateAsync}
            selectedId={selectedItemId}
            refetch={() => {}}
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

export default KitchenInventory;
