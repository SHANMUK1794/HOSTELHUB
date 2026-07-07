import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useStoreRoomInventory } from "../../../../hooks/useStoreRoomInventory";
import DatePicker from "../../../common_components/DatePicker";
import Delete from "../../../common_components/Delete";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import LottieLoader from "../../../common_components/LottieLoader";
import { useSelector } from "react-redux";

const AddHistory = ({ onClose, showToast }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editItemModal, SetEditItemModal] = useState(false);
  const [addItemModal, setAddItemModal] = useState(false);
  const [selectedYearMonth, setSelectedYearMonth] = useState("");

  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  const { historyQuery, addItem, deleteItem, editItem, isLoading } =
    useStoreRoomInventory(selectedYearMonth, branchName);

  const tableData = Array.isArray(historyQuery.data) ? historyQuery.data : [];

  const deleteData = (id) => {
    deleteItem.mutate(id, {
      onSuccess: () => showToast("Item deleted successfully", "success"),
      onError: (error) => showToast(error?.response?.data?.message || "Failed to delete item", "error"),
    });
  };

  const handleEdit = (item, index) => {
    setEditIndex(index);
    setFormData({ ...item, id: item._id });
    SetEditItemModal(true);
  };

  const handleUpdate = () => {
    editItem.mutate(formData, {
      onSuccess: () => {
        showToast("Item updated successfully", "success");
        SetEditItemModal(false);
      },
      onError: (error) => showToast(error?.response?.data?.message || "Failed to update item", "error"),
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex flex-col w-full relative mt-2">
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute -top-6 -right-2 hover:opacity-70 transition-opacity"
        style={{ color: "var(--theme-primary-text)" }}
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-6 mt-6 gap-4">
        {/* Used Items Button */}
        <button
          className="h-[36px] px-[16px] rounded-[8px] shadow-sm font-['Montserrat'] font-[500] text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
          }}
          onClick={() => setAddItemModal(true)}
        >
          <span className="text-[18px] leading-none mb-[2px] font-light">
            +
          </span>{" "}
          Used Items
        </button>

        {/* Dropdowns */}
        <DatePicker
          selectedYearMonth={selectedYearMonth}
          onChange={(value) => setSelectedYearMonth(value)}
          containerClass="flex items-center gap-3"
          selectClass="outline-none appearance-none border border-[#D9C2AE] text-center rounded-[6px] h-[36px] px-[12px] font-['Montserrat'] font-[500] text-[14px] transition-all duration-200 cursor-pointer shadow-sm min-w-[100px] leading-tight"
          selectStyle={{
            backgroundColor: "var(--theme-filter-bg)",
            color: "var(--theme-primary-text)",
          }}
        />
      </div>

      {/* TABLE CONTAINER */}
      <div
        className="w-full border border-[#D0D0D0] rounded-[12px] overflow-hidden shadow-sm"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            {/* TABLE HEADER */}
            <thead
              className="text-white h-[45px]"
              style={{ backgroundColor: "var(--theme-table-header-bg)" }}
            >
              <tr>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-center w-[15%]">
                  Date
                </th>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-left w-[25%]">
                  Description
                </th>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-center w-[12%]">
                  Quantity
                </th>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-center w-[12%]">
                  Used
                </th>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-center w-[12%]">
                  Balance
                </th>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-left w-[14%]">
                  Branch Name
                </th>
                <th className="font-['Poppins'] font-[500] text-[14px] tracking-[0.5px] px-3 text-center w-[10%]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody style={{ color: "var(--theme-primary-text)" }}>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-8 border-b border-[#D0D0D0]">
                    <LottieLoader />
                  </td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center font-['Montserrat'] font-[500] text-[18px] text-gray-500 border-b border-[#D0D0D0]"
                  >
                    No records available.
                  </td>
                </tr>
              ) : (
                tableData.map((item, i) => (
                  <tr
                    key={item.id || i}
                    className="border-b border-[#D0D0D0] hover:bg-gray-50 transition-colors"
                    style={{
                      height: "45px",
                      backgroundColor:
                        i % 2 !== 0
                          ? "var(--theme-filter-bg)"
                          : "var(--theme-card-bg)",
                    }}
                  >
                    <td className="font-['Montserrat'] font-[500] text-[14px] px-3 text-center w-[15%]">
                      {formatDate(item.date)}
                    </td>
                    <td className="font-['Montserrat'] font-[500] text-[14px] px-3 text-left w-[25%]">
                      {item.itemName}
                    </td>
                    <td className="font-['Montserrat'] font-[500] text-[14px] px-3 text-center w-[12%]">
                      {item.quantity}
                    </td>
                    <td className="font-['Montserrat'] font-[500] text-[14px] px-3 text-center w-[12%]">
                      {item.used}
                    </td>
                    <td className="font-['Montserrat'] font-[500] text-[14px] px-3 text-center w-[12%]">
                      {item.balance}
                    </td>
                    <td className="font-['Montserrat'] font-[500] text-[14px] px-3 text-left w-[14%]">
                      {item.branchName}
                    </td>
                    <td className="px-3 text-center w-[10%]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item, i)}
                          className="w-[28px] h-[28px] bg-white border border-[#EAEAEA] rounded-[4px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Edit"
                        >
                          <img
                            src="https://asset.techjose.com/Hostelos/basileditoutline.png"
                            alt="Edit"
                            className="h-[16px] w-[16px]"
                          />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItemToDelete(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-[28px] h-[28px] bg-white border border-[#FFE0E0] rounded-[4px] shadow-[0_2px_4px_rgba(255,0,0,0.08)] flex items-center justify-center hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <img
                            src="https://asset.techjose.com/Hostelos/materialsymbolsdeleteoutline.png"
                            alt="Delete"
                            className="h-[16px] w-[16px]"
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
      </div>

      {/* MODALS */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-40 p-4 md:pl-[240px]">
          <Delete
            setIsOpenDelete={setIsDeleteModalOpen}
            selectedId={selectedItemToDelete?._id}
            refetch={historyQuery.refetch}
            deleteData={deleteData}
          />
        </div>
      )}

      {addItemModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 p-4 md:pl-[240px]">
          <div className="relative w-full max-w-[700px] flex justify-center">
            <AddItem
              onClose={() => setAddItemModal(false)}
              onAdd={(newItem) => {
                addItem.mutate(newItem, {
                  onSuccess: () => {
                    historyQuery.refetch();
                    setAddItemModal(false);
                    showToast("Item added successfully", "success");
                  },
                  onError: (error) => showToast(error?.response?.data?.message || "Failed to add item", "error"),
                });
              }}
            />
          </div>
        </div>
      )}

      {editItemModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 p-4 md:pl-[240px]">
          <div className="relative w-full max-w-md">
            <EditItem
              onClose={() => SetEditItemModal(false)}
              formData={formData}
              setFormData={setFormData}
              handleUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHistory;
