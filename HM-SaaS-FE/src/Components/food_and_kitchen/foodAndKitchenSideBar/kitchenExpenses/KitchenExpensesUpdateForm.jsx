import React, { useState } from "react";
import { X } from "lucide-react";

const KitchenExpensesUpdateForm = ({ setIsOpenEdit, selectedEditData, updateExpenseMutation }) => {

  const [editFormData, setEditFormData] = useState({
    itemName: selectedEditData?.itemName || "",
    Unit: selectedEditData?.unit || "",
    quantity: selectedEditData?.quantity || "",
    price: selectedEditData?.price || "",
    date: selectedEditData?.date ? selectedEditData.date.slice(0, 10) : "",
    _id: selectedEditData?._id || "",
  });

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const payload = {
      _id: editFormData._id,
      itemName: editFormData.itemName,
      unit: editFormData.Unit,
      quantity: Number(editFormData.quantity),
      price: Number(editFormData.price),
      date: editFormData.date,
    };

    updateExpenseMutation.mutate(payload, {
      onSuccess: () => {
        setIsOpenEdit(false);
      },
      onError: (err) => {
        console.error("Error updating expense:", err);
      },
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

  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontSize: "14px",
    fontWeight: "500",
    display: "block",
    marginBottom: "6px",
  };

  return (
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8 relative max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={() => setIsOpenEdit(false)}
          className="absolute right-5 top-5 transition-colors hover:text-red-500"
          style={{ color: "var(--theme-muted-text)" }}
        >
          <X size={26} strokeWidth={2.5} />
        </button>

        <h1
          className="text-center text-2xl mb-6 font-bold"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Edit Item
        </h1>

        <div className="mb-4">
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            name="date"
            value={editFormData.date}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div className="mb-4">
          <label style={labelStyle}>Item Name</label>
          <input
            type="text"
            name="itemName"
            placeholder="Enter Item Name"
            value={editFormData.itemName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div className="mb-4">
          <label style={labelStyle}>Unit</label>
          <input
            type="text"
            name="Unit"
            placeholder="Kg, L, etc."
            value={editFormData.Unit}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div className="mb-4">
          <label style={labelStyle}>Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="0"
            value={editFormData.quantity}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div className="mb-6">
          <label style={labelStyle}>Price</label>
          <input
            type="number"
            name="price"
            placeholder="0"
            value={editFormData.price}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setIsOpenEdit(false)}
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
            onClick={handleUpdate}
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

export default KitchenExpensesUpdateForm;
