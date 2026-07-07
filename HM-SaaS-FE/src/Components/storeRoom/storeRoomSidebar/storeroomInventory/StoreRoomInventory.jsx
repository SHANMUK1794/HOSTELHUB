import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreRoomInventory } from "../../../../hooks/useStoreRoomInventory";
import { useSelector } from "react-redux";
import SearchBar from "../../../common_components/SearchBar";
import AddHistory from "./AddHistory";
import LottieLoader from "../../../common_components/LottieLoader";
import Delete from "../../../common_components/Delete";
import DatePicker from "../../../common_components/DatePicker";
import Export from "../../../common_components/Export";
import Pagination from "../../../common_components/Pagination";
import { EyeIcon } from "@heroicons/react/24/solid";
import ToastMessage from "../../../common_components/ToastMessage";

const StoreRoomInventory = () => {
  const navigate = useNavigate();

  const [addHistoryModal, setAddHistoryModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedYearMonth, setSelectedYearMonth] = useState("all-all");
  const [selectedYear, selectedMonth] = selectedYearMonth.split("-");
  const [search, setSearch] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

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

  const activeBranch = useSelector(
    (state) => state.branch.selectedBranch || "",
  );

  const { inventoryQuery, deleteItemByName } = useStoreRoomInventory(
    selectedYearMonth,
    activeBranch,
  );

  const { data, isLoading, error } = inventoryQuery;

  const tableData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    let filtered = tableData.filter((item) =>
      item.itemName?.toLowerCase().includes(keyword),
    );

    setFilteredInventory(filtered);
    setCurrentPage(1);
  }, [tableData, search, selectedYearMonth]);

  const totalPages = Math.ceil(filteredInventory.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedInventory = filteredInventory.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

  if (isLoading) return <LottieLoader />;

  if (error) {
    return (
      <p className="text-red-500 p-5">
        Error loading inventory: {error.message}
      </p>
    );
  }

  return (
    <div className="p-8 w-full">
      {/* MAIN CONTAINER */}
      <div
        className="w-full border border-[#CDCDCD] rounded-[20px] shadow-sm p-6 lg:p-8 font-['Montserrat']"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-16">
          <h1
            className="text-[32px] font-bold leading-none tracking-tight font-['Montserrat'] m-0"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Store Room Inventory
          </h1>

          <div className="flex items-center gap-4">
            {/* Active toggle — Inventory */}
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
                Inventory
              </span>
            </label>

            {/* Inactive toggle — Expenses */}
            <label
              className="flex items-center justify-center cursor-pointer rounded-[6px] h-[36px] px-3 font-['Montserrat'] font-[500] text-[16px] border"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-primary-text)",
                color: "var(--theme-primary-text)",
              }}
              onClick={() => navigate("/StoreRoom")}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px] rounded-sm"
                  style={{ accentColor: "var(--theme-primary-text)" }}
                />
                Expenses
              </span>
            </label>
          </div>
        </div>

        {/* FILTER + SEARCH + ACTIONS */}
        <div className="flex flex-col lg:flex-row justify-between items-center w-full mb-6 gap-4">
          {/* DATE PICKER */}
          <div className="flex items-center w-full lg:w-auto">
            <DatePicker
              selectedYearMonth={selectedYearMonth}
              onChange={setSelectedYearMonth}
              containerClass="flex items-center gap-3"
              selectClass="outline-none appearance-none border border-[#CDCDCD] text-center rounded-[6px] h-[36px] pl-3 pr-8 font-['Montserrat'] font-[500] text-[14px] transition-all duration-200 cursor-pointer shadow-sm w-auto"
              selectStyle={{
                backgroundColor: "var(--theme-filter-bg)",
                color: "var(--theme-primary-text)",
              }}
            />
          </div>

          {/* SEARCH */}
          <div className="flex items-center justify-center flex-1 w-full lg:w-auto">
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Search Item Name"
              containerClass="flex items-center justify-between gap-2 rounded-full px-4 border border-[#CDCDCD] bg-[#FFFFFF] w-full max-w-[400px] h-[40px] shadow-sm"
              inputClass="font-['Montserrat'] font-[400] text-[14px] outline-none w-full bg-transparent placeholder:text-[#8A8A8A]"
              btnStyle={{ backgroundColor: "var(--theme-button-bg)" }}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
            {/* USED ITEMS */}
            <button
              className="h-[36px] px-4 rounded-[6px] shadow-sm font-['Montserrat'] font-[500] text-[14px] flex items-center justify-center hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
              onClick={() => {
                setSelectedData(tableData);
                setAddHistoryModal(true);
              }}
            >
              <span className="flex items-center gap-2">
                <EyeIcon className="w-[16px] h-[16px]" />
                Used Items
              </span>
            </button>

            {/* EXPORT */}
            <Export
              year={selectedYear}
              month={selectedMonth}
              btnClass="h-[36px] px-4 rounded-[6px] shadow-sm font-['Montserrat'] font-[500] text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
              btnStyle={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            />
          </div>
        </div>

        {/* TABLE */}
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
                  <th className="font-['Poppins'] font-[600] text-[14px] px-4 text-center w-[10%]">
                    S.NO
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[14px] px-4 text-left w-[25%]">
                    DESCRIPTION
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[14px] px-4 text-center w-[15%]">
                    MATERIAL IN
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[14px] px-4 text-center w-[15%]">
                    MATERIAL OUT
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[14px] px-4 text-center w-[10%]">
                    STOCK
                  </th>
                  <th className="font-['Poppins'] font-[600] text-[14px] px-4 text-center w-[10%]">
                    ACTION
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
                {paginatedInventory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center font-['Montserrat'] font-[500] text-[14px] text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedInventory.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-[#D9D9D9] hover:bg-gray-50 transition-colors"
                      style={{ height: "55px" }}
                    >
                      <td className="font-['Montserrat'] font-[500] text-[14px] px-4 text-center w-[10%]">
                        {indexOfFirstRow + index + 1 < 10
                          ? `0${indexOfFirstRow + index + 1}`
                          : indexOfFirstRow + index + 1}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[14px] px-4 text-left w-[25%]">
                        {item.itemName}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[14px] px-4 text-center w-[15%]">
                        {item.makeIn}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[14px] px-4 text-center w-[15%]">
                        {item.makeOut}
                      </td>
                      <td className="font-['Montserrat'] font-[500] text-[14px] px-4 text-center w-[10%]">
                        {item.quantity}
                      </td>
                      <td className="px-4 text-center w-[10%]">
                        <button
                          onClick={() => {
                            setSelectedItemName(item.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-[32px] h-[32px] bg-white border border-[#FBE2CF] rounded-[6px] shadow-sm flex items-center justify-center mx-auto hover:bg-red-50 hover:border-red-100 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition-all duration-200">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredInventory.length > 0 && (
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

      {/* ADD HISTORY MODAL */}
      {addHistoryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 md:pl-[240px]">
          <div
            className="rounded-[24px] border border-[#D9D9D9] shadow-[0_0_15px_rgba(0,0,0,0.12)] w-full max-w-[1100px] p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: "var(--theme-app-bg)" }}
          >
            <AddHistory
              onClose={() => setAddHistoryModal(false)}
              selectedData={selectedData}
              tableData={tableData}
              showToast={showToast}
            />
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <Delete
          setIsOpenDelete={setIsDeleteModalOpen}
          deleteData={(id) => deleteItemByName.mutateAsync(id).then(() => showToast("Item deleted successfully", "success")).catch((err) => { showToast(err?.response?.data?.message || "Failed to delete item", "error"); throw err; })}
          selectedId={selectedItemName}
          refetch={inventoryQuery.refetch}
        />
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

export default StoreRoomInventory;
