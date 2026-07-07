import React, { useState } from "react";
import { useExpenses } from "../../../../hooks/useExpenses";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { HiOutlinePlusCircle } from "react-icons/hi";

const KitchenExpensesAddForm = ({ setIsOpenAdd, showToast }) => {
  const branchName = useSelector((state) => state.branch.selectedBranch);

  const [rows, setRows] = useState([
    { itemName: "", unit: "", quantity: "", price: "" },
    { itemName: "", unit: "", quantity: "", price: "" },
  ]);

  const [date, setDate] = useState("");
  const { addExpenseMutation } = useExpenses(undefined, undefined, { showToast });

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const totalPrice = rows.reduce((sum, r) => {
    const amount = Number(r.price || 0);
    return sum + amount;
  }, 0);

  const addRow = () => {
    setRows([...rows, { itemName: "", unit: "", quantity: "", price: "" }]);
  };

  const handleSave = () => {
    const formattedData = {
      date,
      branchName: String(branchName),
      list: rows
        .filter((r) => r.itemName && r.unit && r.quantity && r.price)
        .map((r) => ({
          itemName: r.itemName,
          unit: r.unit,
          quantity: Number(r.quantity),
          pricePerUnit: Number(r.price),
          price: Number(r.price),
        })),
    };

    addExpenseMutation.mutate(formattedData, {
      onSuccess: () => setIsOpenAdd(false),
      onError: (err) => console.error("Error:", err),
    });
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "8px",
    padding: "8px 16px",
    border: "1px solid var(--theme-secondary-card-bg)",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    color: "var(--theme-primary-text)",
    outline: "none",
  };

  return (
      <div
        className="w-full max-w-4xl rounded-2xl shadow-xl p-8 relative max-h-[calc(100vh-140px)] overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Add Item
          </h1>
          <button
            type="button"
            onClick={() => setIsOpenAdd(false)}
            className="transition-colors hover:text-red-500"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* Date Row */}
        <div className="mb-6 w-full flex items-end justify-between">
          <div className="w-[220px]">
            <label
              className="text-sm font-medium block mb-1.5"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="button"
            onClick={addRow}
            className="transition-colors pb-1"
            style={{ color: "var(--theme-accent)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.color = "var(--theme-accent-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.color = "var(--theme-accent)")
            }
            title="Add Row"
          >
            <HiOutlinePlusCircle size={32} />
          </button>
        </div>

        {/* Table Headers */}
        <div
          className="grid grid-cols-[60px_2fr_1fr_1fr_1fr] gap-4 text-[15px] font-medium mb-3 px-1"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <div>S no.</div>
          <div>Item Name</div>
          <div>Unit</div>
          <div>Quantity</div>
          <div>Price</div>
        </div>

        {/* Scrollable Rows Container */}
        <div className="max-h-[350px] overflow-y-auto scrollbar-hide mb-4 px-1 pb-2">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[60px_2fr_1fr_1fr_1fr] gap-4 mb-4 items-center"
            >
              <div
                className="font-medium pl-2"
                style={{ color: "var(--theme-primary-text)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <input
                placeholder="Enter Item Name"
                value={row.itemName}
                onChange={(e) =>
                  handleChange(index, "itemName", e.target.value)
                }
                style={inputStyle}
              />
              <input
                placeholder="Unit"
                value={row.unit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(value))
                    handleChange(index, "unit", value);
                }}
                style={inputStyle}
              />
              <input
                placeholder="0"
                type="number"
                value={row.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", e.target.value)
                }
                style={inputStyle}
              />
              <input
                placeholder="100"
                type="number"
                value={row.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div className="flex justify-end items-center gap-4 mt-6">
          <p
            className="font-medium"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Total Price
          </p>
          <input
            value={totalPrice}
            readOnly
            style={{ ...inputStyle, width: "180px", cursor: "not-allowed" }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setIsOpenAdd(false)}
            className="px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            style={{
              backgroundColor: "var(--theme-secondary-button-bg)",
              border: "1px solid #d1d5db",
              color: "var(--theme-primary-text)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--theme-accent-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--theme-button-bg)")
            }
          >
            Save
          </button>
        </div>
      </div>
  );
};

export default KitchenExpensesAddForm;
