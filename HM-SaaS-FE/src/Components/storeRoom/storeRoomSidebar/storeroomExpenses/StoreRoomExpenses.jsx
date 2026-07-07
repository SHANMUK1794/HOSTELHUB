import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Delete from "../../../common_components/Delete";
import SearchBar from "../../../common_components/SearchBar";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import LottieLoader from "../../../common_components/LottieLoader";
import DatePicker from "../../../common_components/DatePicker";
import ToastMessage from "../../../common_components/ToastMessage";

import {
  useAddItem,
  useDeleteItem,
  useGetStoreRoom,
  useUpdateItem,
} from "../../../../hooks/useStoreRoom";
import StoreExpenceExport from "./StoreExpenceExport";
import Pagination from "../../../common_components/Pagination";

const StoreRoomExpenses = () => {
  const navigate = useNavigate();

  const [selectedYearMonth, setSelectedYearMonth] = useState("all-all");
  const [selectedYear, selectedMonth] = selectedYearMonth.split("-");

  const activeBranch = useSelector(
    (state) => state.branch.selectedBranch || "",
  );

  const { data, isLoading, refetch } = useGetStoreRoom(
    selectedYearMonth,
    activeBranch,
  );

  const expenses = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [addItemModal, setAddItemModal] = useState(false);
  const [editItemModal, SetEditItemModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState(null);

  const [search, setSearch] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    let filtered = expenses.filter((item) =>
      item.itemName?.toLowerCase().includes(keyword),
    );

    if (selectedYearMonth !== "all-all") {
      const [yearFilter, monthFilter] = selectedYearMonth.split("-");

      filtered = filtered.filter((item) => {
        if (!item.date) return true;

        const dateObj = new Date(item.date);
        const itemYear = dateObj.getFullYear().toString();
        const itemMonthName = dateObj
          .toLocaleString("en-US", { month: "long" })
          .toLowerCase();

        const matchYear = yearFilter === "all" || itemYear === yearFilter;
        const matchMonth =
          monthFilter === "all" || itemMonthName === monthFilter;

        return matchYear && matchMonth;
      });
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  }, [expenses, search, selectedYearMonth]);

  const handleSearch = () => {};

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedExpenses = filteredExpenses.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

  if (isLoading) return <LottieLoader />;

  return (
    <div className="p-8 w-full">
      {/* MAIN CONTAINER */}
      <div
        className="w-full border border-[#CDCDCD] rounded-[20px] shadow-sm p-6 lg:p-8 font-['Montserrat']"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        {/* HEADING + TOGGLES ROW */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-16">
          <h1
            className="text-[32px] font-bold leading-none tracking-tight font-['Montserrat'] m-0"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Store Room Purchase
          </h1>

          <div className="flex items-center gap-4">
            {/* Inactive toggle — Inventory */}
            <label
              className="flex items-center justify-center cursor-pointer rounded-[6px] h-[36px] px-3 font-['Montserrat'] font-[500] text-[16px] border"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-primary-text)",
                color: "var(--theme-primary-text)",
              }}
              onClick={() => navigate("/StoreRoomInventory")}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px] rounded-sm"
                  style={{ accentColor: "var(--theme-primary-text)" }}
                />
                Inventory
              </span>
            </label>

            {/* Active toggle — Expenses */}
            <label
              className="flex items-center justify-center cursor-pointer rounded-[6px] h-[36px] px-3 font-['Montserrat'] font-[500] text-[16px] border"
              style={{
                backgroundColor: "var(--theme-filter-bg)",
                borderColor: "var(--theme-accent)",
                color: "var(--theme-primary-text)",
              }}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="w-[16px] h-[16px] rounded-sm"
                  style={{ accentColor: "var(--theme-accent)" }}
                />
                Expenses
              </span>
            </label>
          </div>
        </div>

        {/* FILTER + SEARCH + ACTION BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-center w-full mb-6 gap-4">
          {/* Left: DatePicker */}
          <div className="flex items-center w-full lg:w-auto">
            <DatePicker
              selectedYearMonth={selectedYearMonth}
              onChange={(value) => setSelectedYearMonth(value)}
              containerClass="flex items-center gap-3"
              selectClass="outline-none appearance-none border border-[#CDCDCD] text-center rounded-[6px] h-[36px] pl-3 pr-8 font-['Montserrat'] font-[500] text-[14px] transition-all duration-200 cursor-pointer shadow-sm w-auto"
              selectStyle={{
                backgroundColor: "var(--theme-filter-bg)",
                color: "var(--theme-primary-text)",
              }}
            />
          </div>

          {/* Center: SearchBar */}
          <div className="flex items-center justify-center flex-1 w-full lg:w-auto">
            <SearchBar
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              placeholder="Search Item Name"
              containerClass="flex items-center justify-between gap-2 rounded-full px-4 border border-[#CDCDCD] bg-[#FFFFFF] w-full max-w-[500px] h-[40px] shadow-sm"
              inputClass="font-['Montserrat'] font-[400] text-[14px] outline-none w-full bg-transparent placeholder:text-[#8A8A8A]"
              btnStyle={{ backgroundColor: "var(--theme-button-bg)" }}
            />
            
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
            <button
              className="h-[36px] px-4 rounded-[6px] shadow-sm font-['Montserrat'] font-[500] text-[14px] flex items-center justify-center hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
              onClick={() => setAddItemModal(true)}
            >
              <span className="flex items-center gap-2">
                <span className="text-[18px] leading-none mb-[2px]">+</span> Add
                Items
              </span>
            </button>

            <StoreExpenceExport
              year={selectedYear}
              month={selectedMonth}
              btnClass="h-[36px] px-4 rounded-[6px] shadow-sm font-['Montserrat'] font-[500] text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap flex-row-reverse"
              btnStyle={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            />
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div
          className="w-full border border-[#CDCDCD] rounded-[20px] overflow-hidden shadow-sm"
          style={{ backgroundColor: "var(--theme-card-bg)" }}
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              {/* TABLE HEADER */}
              <thead
                className="text-white h-[55px]"
                style={{ backgroundColor: "var(--theme-table-header-bg)" }}
              >
                <tr>
                  <th className="font-['Poppins'] font-[600] text-[16px] leading-[20px] tracking-[0.5px] uppercase px-4 text-center w-[10%]">
                    S.NO
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[16px] leading-[20px] tracking-[0.5px] uppercase px-4 text-left w-[20%]">
                    DATE
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[16px] leading-[20px] tracking-[0.5px] uppercase px-4 text-left w-[30%]">
                    DESCRIPTION
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[16px] leading-[20px] tracking-[0.5px] uppercase px-4 text-center w-[20%]">
                    QUANTITY
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[16px] leading-[20px] tracking-[0.5px] uppercase px-4 text-center w-[20%]">
                    PRICE
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[16px] leading-[20px] tracking-[0.5px] uppercase px-4 text-center w-[20%]">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody
                style={{
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-primary-text)",
                }}
              >
                {paginatedExpenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center font-['Montserrat'] font-[500] text-[16px] text-gray-500"
                    >
                      No records available.
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map((expense, i) => (
                    <tr
                      key={expense._id || i}
                      className="border-b border-[#D9D9D9] hover:bg-gray-50 transition-colors"
                      style={{ height: "60px" }}
                    >
                      <td className="font-['Montserrat'] font-[500] text-[16px] px-4 text-center w-[10%]">
                        {indexOfFirstRow + i + 1 < 10
                          ? `0${indexOfFirstRow + i + 1}`
                          : indexOfFirstRow + i + 1}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[16px] px-4 text-left w-[20%]">
                        {formatDate(expense.date)}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[16px] px-4 text-left w-[30%]">
                        {expense.itemName}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[16px] px-4 text-center w-[20%]">
                        {expense.quantity}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[16px] px-4 text-center w-[20%] text-[#0A9A20]">
                        ₹{" "}
                        {expense.price
                          ? Number(expense.price).toLocaleString()
                          : "0"}
                      </td>
                      <td className="px-4 text-center w-[20%]">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedExpenses(expense);
                              SetEditItemModal(true);
                            }}
                            className="w-[36px] h-[36px] bg-white border border-[#EAEAEA] rounded-[6px] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                            title="Edit"
                          >
                            <img
                              src="https://asset.techjose.com/Hostelos/basileditoutline.png"
                              alt="Edit"
                              className="h-[18px] w-[18px]"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExpenses(expense._id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-[36px] h-[36px] bg-white border border-[#EAEAEA] rounded-[6px] shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-colors"
                            title="Delete"
                          >
                            <img
                              src="https://asset.techjose.com/Hostelos/materialsymbolsdeleteoutline.png"
                              alt="Delete"
                              className="h-[18px] w-[18px]"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredExpenses.length > 0 && (
            <div className="flex justify-end mt-4 mb-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* -------------------- MODALS -------------------- */}
      {addItemModal && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] bg-black/30 backdrop-blur-md flex justify-center items-center p-4">
          <AddItem
            onClose={() => setAddItemModal(false)}
            onAdd={(newItem, callbacks) =>
              addItem.mutate(newItem, {
                ...callbacks,
                onSuccess: (data, variables, context) => {
                  showToast("Item added successfully", "success");
                  if (callbacks?.onSuccess) callbacks.onSuccess(data, variables, context);
                },
                onError: (error, variables, context) => {
                  showToast(error?.response?.data?.message || "Failed to add item", "error");
                  if (callbacks?.onError) callbacks.onError(error, variables, context);
                }
              })
            }
          />
        </div>
      )}

      {editItemModal && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] bg-black/30 backdrop-blur-md flex justify-center items-center p-4">
          <EditItem
            selectedExpenses={selectedExpenses}
            onUpdate={(updated, callbacks) =>
              updateItem.mutate(updated, {
                ...callbacks,
                onSuccess: (data, variables, context) => {
                  showToast("Item updated successfully", "success");
                  if (callbacks?.onSuccess) callbacks.onSuccess(data, variables, context);
                },
                onError: (error, variables, context) => {
                  showToast(error?.response?.data?.message || "Failed to update item", "error");
                  if (callbacks?.onError) callbacks.onError(error, variables, context);
                }
              })
            }
            onClose={() => SetEditItemModal(false)}
          />
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] bg-black/30 backdrop-blur-md flex justify-center items-center p-4">
          <Delete
            setIsOpenDelete={setIsDeleteModalOpen}
            deleteData={(id) => deleteItem.mutateAsync(id).then(() => showToast("Item deleted successfully", "success")).catch(err => { showToast(err?.response?.data?.message || "Failed to delete item", "error"); throw err; })}
            selectedId={selectedExpenses}
            refetch={refetch}
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

export default StoreRoomExpenses;
