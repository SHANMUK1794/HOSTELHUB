import React, { useState } from "react";
import {
  useSmartDeleteAll,
  useDeleteItem,
  useRecoverItem,
} from "../../hooks/useDelete";
import { RiSearchLine, RiDeleteBin6Line } from "react-icons/ri";

function DeletedItemsTable({ data, selectedModule, showToast }) {
  const recoverMutation = useRecoverItem();
  const deleteMutation = useDeleteItem();
  const universalDelete = useSmartDeleteAll();

  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRecoverClick = (item) => {
    setSelectedItem(item);
    setShowRecoverModal(true);
  };
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };
  const handleDeleteAllClick = () => setShowDeleteAllModal(true);

  const confirmRecover = () => {
    if (selectedItem) {
      recoverMutation.mutate({
        id: selectedItem._id,
        module: selectedItem.module,
      }, {
        onSuccess: () => showToast("Item recovered successfully", "success"),
        onError: (err) => showToast(err?.response?.data?.message || "Failed to recover item", "error"),
      });
      setShowRecoverModal(false);
      setSelectedItem(null);
    }
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate({
        id: selectedItem._id,
        module: selectedItem.module,
      }, {
        onSuccess: () => showToast("Item deleted permanently", "success"),
        onError: (err) => showToast(err?.response?.data?.message || "Failed to delete item", "error"),
      });
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const confirmDeleteAll = () => {
    if (selectedModule === "All") {
      universalDelete.mutate(null, {
        onSuccess: () => showToast("All items deleted permanently", "success"),
        onError: (err) => showToast(err?.response?.data?.message || "Failed to delete items", "error"),
      });
    } else {
      universalDelete.mutate(selectedModule, {
        onSuccess: () => showToast(`All items in ${selectedModule} deleted permanently`, "success"),
        onError: (err) => showToast(err?.response?.data?.message || "Failed to delete items", "error"),
      });
    }
    setShowDeleteAllModal(false);
  };

  const cancelAction = () => {
    setShowRecoverModal(false);
    setShowDeleteModal(false);
    setShowDeleteAllModal(false);
    setSelectedItem(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${yyyy}-${mm}-${dd} | ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const searchedData = data?.filter((item) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (item.itemName && item.itemName.toLowerCase().includes(lowerQuery)) ||
      (item.module && item.module.toLowerCase().includes(lowerQuery)) ||
      (item.deletedByName &&
        item.deletedByName.toLowerCase().includes(lowerQuery))
    );
  });

  // Reusable confirm modal
  const ConfirmModal = ({ title, message, onConfirm, confirmLabel }) => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="flex flex-col items-center rounded-2xl shadow-lg max-w-md p-5 w-full text-center"
        style={{ backgroundColor: "var(--theme-filter-bg)" }}
      >
        <img
          className="w-[80px]"
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16'/></svg>"
          alt="Delete"
        />
        <h3
          className="text-[25px] font-bold mb-2"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {title}
        </h3>
        <p className="mb-4" style={{ color: "var(--theme-accent)" }}>
          {message}
        </p>
        <div className="flex justify-center gap-5">
          <button
            onClick={cancelAction}
            className="px-6 py-2 font-bold rounded-xl shadow-lg hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "var(--theme-secondary-button-bg)",
              color: "var(--theme-primary-text)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 font-medium rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 px-2">
        <h2
          className="font-bold text-[22px]"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Recent - Deleted Items
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[350px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name / Module / Deleted By"
              className="w-full h-[44px] pl-5 pr-12 rounded-full outline-none text-sm transition-colors shadow-sm"
              style={{
                border: "1px solid var(--theme-secondary-card-bg)",
                backgroundColor: "var(--theme-card-bg)",
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            />
            <button
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              <RiSearchLine size={16} />
            </button>
          </div>

          {/* Delete All */}
          <button
            onClick={handleDeleteAllClick}
            className="flex items-center justify-center gap-2 h-[44px] px-6 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity shadow-sm"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-muted-text)",
            }}
          >
            <RiDeleteBin6Line
              className="text-lg"
              style={{ color: "#FF4C4C" }}
            />
            Delete All
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-[16px] shadow-sm overflow-hidden"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <div className="overflow-x-auto min-h-[300px]">
          <table className="min-w-full text-left border-collapse text-sm">
            <thead style={{ backgroundColor: "var(--theme-table-header-bg)" }}>
              <tr style={{ color: "var(--theme-white-text)" }}>
                <th className="py-4 px-6 uppercase font-semibold text-[13px] tracking-wider whitespace-nowrap">
                  Item Name / ID
                </th>
                <th className="py-4 px-6 uppercase font-semibold text-[13px] tracking-wider whitespace-nowrap">
                  Deleted On
                </th>
                <th className="py-4 px-6 uppercase font-semibold text-[13px] tracking-wider whitespace-nowrap">
                  Deleted By
                </th>
                <th className="py-4 px-6 uppercase font-semibold text-[13px] tracking-wider whitespace-nowrap">
                  Modules
                </th>
                <th className="py-4 px-6 uppercase font-semibold text-[13px] tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {searchedData?.map((item, i) => (
                <tr
                  key={i}
                  className="transition-colors"
                  style={{
                    backgroundColor: "var(--theme-table-row-bg)",
                    borderBottom: "1px solid var(--theme-secondary-card-bg)",
                    color: "var(--theme-primary-text)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <td className="py-4 px-6 font-medium">{item.itemName}</td>
                  <td
                    className="py-4 px-6 font-medium"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {formatDate(item.deleteddate)}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {item.deletedByName}
                  </td>
                  <td className="py-4 px-6 font-medium">{item.module}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRecoverClick(item)}
                        className="px-5 py-1.5 rounded text-[13px] font-medium transition-opacity shadow-sm hover:opacity-90"
                        style={{
                          backgroundColor: "var(--theme-button-bg)",
                          color: "var(--theme-button-text)",
                        }}
                      >
                        Recover
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="w-[32px] h-[32px] flex items-center justify-center rounded transition-colors shadow-sm hover:opacity-80"
                        style={{
                          border: "1px solid #fecaca",
                          backgroundColor: "#fff5f5",
                        }}
                      >
                        <RiDeleteBin6Line
                          size={16}
                          style={{ color: "#FF4C4C" }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!searchedData || searchedData.length === 0) && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center"
                    style={{
                      backgroundColor: "var(--theme-table-row-bg)",
                      color: "var(--theme-muted-text)",
                    }}
                  >
                    {searchQuery
                      ? "No matching items found."
                      : "No deleted items found for this module."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showRecoverModal && (
        <ConfirmModal
          title="Recover Item"
          message={"Are you sure you want to Recover this item?"}
          onConfirm={confirmRecover}
          confirmLabel="Recover"
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Item"
          message={"Are you sure you want to Delete this item?"}
          onConfirm={confirmDelete}
          confirmLabel="Delete"
        />
      )}
      {showDeleteAllModal && (
        <ConfirmModal
          title="Delete All Items"
          message={"Are you sure you want to Delete all items?"}
          onConfirm={confirmDeleteAll}
          confirmLabel="Delete All"
        />
      )}
    </div>
  );
}

export default DeletedItemsTable;
