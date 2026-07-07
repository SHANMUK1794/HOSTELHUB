import { useCallback, useState, useMemo } from "react";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useInventory } from "../../../../../hooks/useInventory";
import DatePicker from "../../../../common_components/DatePicker";
import Delete from "../../../../common_components/Delete";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import LottieLoader from "../../../../common_components/LottieLoader";

const HistoryOfInventory = ({
  setopenInventory,
  selectedYearMonth: propSelectedYearMonth,
  onSelectedYearMonthChange,
  showToast,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [openAddItem, setopenAddItem] = useState(false);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [localSelectedYearMonth, setLocalSelectedYearMonth] = useState("");

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

  const effectiveSelectedYearMonth =
    propSelectedYearMonth !== undefined
      ? propSelectedYearMonth
      : localSelectedYearMonth;
  const setEffectiveSelectedYearMonth = (val) => {
    if (onSelectedYearMonthChange) onSelectedYearMonthChange(val);
    else setLocalSelectedYearMonth(val);
  };

  const rawYear =
    effectiveSelectedYearMonth && effectiveSelectedYearMonth !== "all-all"
      ? effectiveSelectedYearMonth.split("-")[0]
      : "all";
  const rawMonth =
    effectiveSelectedYearMonth && effectiveSelectedYearMonth !== "all-all"
      ? effectiveSelectedYearMonth.split("-")[1]
      : "all";
  const apiParam =
    effectiveSelectedYearMonth === "all-all" ? "" : effectiveSelectedYearMonth;

  const {
    addInventory,
    updateInventory,
    deleteInventories,
    isLoading,
    refetch,
  } = useInventory(apiParam, { showToast });

  const inventory = useSelector((state) => state.inventory) || {};
  const inventoryStore = inventory.inventoryStore || [];

  const filteredInventoryStore = useMemo(() => {
    if (!inventoryStore || inventoryStore.length === 0) return [];
    if (
      effectiveSelectedYearMonth === "all" ||
      effectiveSelectedYearMonth === "all-all" ||
      !effectiveSelectedYearMonth
    )
      return inventoryStore;

    return inventoryStore.filter((item) => {
      const targetDate = item.date || item.createdAt;
      if (!targetDate) return false;
      const d = new Date(targetDate);
      const itemYear = d.getFullYear().toString();
      const itemMonthLong = d
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const itemMonthNum = String(d.getMonth() + 1).padStart(2, "0");
      const itemMonthShort = d
        .toLocaleString("default", { month: "short" })
        .toLowerCase();
      const yearMatch = rawYear === "all" || itemYear === rawYear.toLowerCase();
      const monthMatch =
        rawMonth === "all" ||
        itemMonthLong === rawMonth.toLowerCase() ||
        itemMonthNum === rawMonth.toLowerCase() ||
        itemMonthShort === rawMonth.toLowerCase();
      return yearMatch && monthMatch;
    });
  }, [inventoryStore, effectiveSelectedYearMonth, rawYear, rawMonth]);

  const itemTitle = isEdit ? "Edit Item" : "Add Item";

  const handleClickAdd = useCallback(() => {
    setSelectedData(null);
    setopenAddItem(true);
    setIsEdit(false);
  }, []);
  const handleClickEdit = useCallback((item) => {
    setOpenEditItem(true);
    setIsEdit(true);
    setSelectedData(item);
    setId(item._id);
  }, []);
  const handleDelete = (id) => {
    deleteInventories.mutate(id, {
      onSuccess: () => {
        setShowDeleteConfirmation(false);
        refetch();
      },
    });
  };
  const handleCancelItem = () => setopenAddItem(false);
  const handleCancelEdit = () => setOpenEditItem(false);

  const handleSaveItem = useCallback(
    (data) => {
      const qty = Number(data.quantity);
      const usd = Number(data.used);
      const finalData = {
        ...data,
        quantity: qty,
        balance: qty - usd,
        branchName,
      };
      if (isEdit) {
        updateInventory.mutate(
          { data: finalData, id },
          {
            onSuccess: () => {
              refetch();
              setOpenEditItem(false);
            },
          },
        );
      } else {
        addInventory.mutate(finalData, {
          onSuccess: () => {
            refetch();
            setopenAddItem(false);
          },
        });
      }
    },
    [addInventory, updateInventory, refetch, id, isEdit, branchName],
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className="w-full max-w-[900px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-[24px] shadow-2xl p-8 relative flex flex-col"
      style={{
        backgroundColor: "var(--theme-card-bg)",
        border: "1px solid var(--theme-secondary-card-bg)",
      }}
    >
      <button
        onClick={() => setopenInventory(false)}
        className="absolute right-6 top-6 transition-colors hover:text-red-500"
        style={{ color: "var(--theme-primary-text)" }}
      >
        <X size={28} strokeWidth={2.5} />
      </button>

      <h2
        className="text-2xl font-bold mb-6"
        style={{
          color: "var(--theme-heading-text)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        Used Items History
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <DatePicker
            selectedYearMonth={effectiveSelectedYearMonth}
            onChange={(value) => setEffectiveSelectedYearMonth(value)}
          />
        </div>
        <button
          className="text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          style={{ backgroundColor: "var(--theme-button-bg)" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--theme-accent-hover)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--theme-button-bg)")
          }
          onClick={handleClickAdd}
        >
          <FaPlus /> Add Items
        </button>
      </div>

      <div
        className="overflow-x-auto rounded-xl shadow-sm max-h-[500px]"
        style={{
          border: "1px solid var(--theme-secondary-card-bg)",
          backgroundColor: "var(--theme-card-bg)",
        }}
      >
        <table className="w-full text-center whitespace-nowrap border-collapse">
          <thead
            className="text-white text-[15px] font-semibold sticky top-0 z-10"
            style={{ backgroundColor: "var(--theme-table-header-bg)" }}
          >
            <tr>
              <th className="px-6 py-4 text-center">Date</th>
              <th className="px-6 py-4 text-left">Item Name</th>
              <th className="px-6 py-4 text-center">Quantity</th>
              <th className="px-6 py-4 text-center">Used</th>
              <th className="px-6 py-4 text-center">Balance</th>
              <th className="px-6 py-4 text-center">Actions</th>
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
            ) : filteredInventoryStore?.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center font-medium"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  No records available.
                </td>
              </tr>
            ) : (
              filteredInventoryStore.map((item) => (
                <tr
                  key={item._id}
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
                  <td className="px-6 py-4">{formatDate(item.date)}</td>
                  <td className="px-6 py-4 text-left font-medium">
                    {item.itemName}
                  </td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.used}</td>
                  <td className="px-6 py-4 font-medium">{item.balance}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleClickEdit(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition"
                        style={{
                          border: "1px solid var(--theme-secondary-card-bg)",
                          backgroundColor: "var(--theme-filter-bg)",
                        }}
                      >
                        <MdEdit
                          className="w-4 h-4"
                          style={{ color: "var(--theme-accent)" }}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirmation(true);
                          setSelectedId(item._id);
                          setSelectedData(item);
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

      {openAddItem && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9995] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
          <AddItem
            title={itemTitle}
            onClick={handleSaveItem}
            onCancel={handleCancelItem}
            itemData={null}
          />
        </div>
      )}
      {openEditItem && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9995] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
          <EditItem
            title={itemTitle}
            onClick={handleSaveItem}
            onCancel={handleCancelEdit}
            itemData={selectedData}
          />
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9995] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
          <Delete
            setIsOpenDelete={setShowDeleteConfirmation}
            deleteData={async (id) => {
              await deleteInventories.mutateAsync(id);
            }}
            selectedId={selectedId}
            refetch={() => deleteInventories.reset()}
          />
        </div>
      )}
    </div>
  );
};

export default HistoryOfInventory;
