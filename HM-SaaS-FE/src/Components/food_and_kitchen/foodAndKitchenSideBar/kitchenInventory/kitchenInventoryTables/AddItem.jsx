// AddItem.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const AddItem = ({ title, onClick, onCancel, itemData }) => {
  const [date, setDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [used, setUsed] = useState("");

  useEffect(() => {
    if (itemData) {
      setDate(itemData.date ? itemData.date.slice(0, 10) : "");
      setItemName(itemData.itemName || "");
      setUsed(itemData.used !== undefined ? itemData.used : "");
    } else {
      setDate("");
      setItemName("");
      setUsed("");
    }
  }, [itemData]);

  const handleAddItem = () => {
    if (!date || !itemName || used === "") {
      alert("Please fill all required fields");
      return;
    }
    const qty = Number(used);
    const data = { date, itemName, used: qty, quantity: qty };
    onClick(data);
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "8px",
    padding: "10px 16px",
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
      className="w-full max-w-[420px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl shadow-xl p-8 relative"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
      <button
        onClick={onCancel}
        className="absolute right-5 top-5 transition-colors hover:text-red-500"
        style={{ color: "var(--theme-muted-text)" }}
      >
        <X size={26} strokeWidth={2.5} />
      </button>
      <h2
        className="text-center text-2xl font-bold mb-6"
        style={{
          color: "var(--theme-heading-text)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        Add Item
      </h2>
      <div className="mb-4">
        <label style={labelStyle}>Date</label>
        <input
          type="date"
          style={inputStyle}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label style={labelStyle}>Description</label>
        <input
          type="text"
          placeholder="Enter Description"
          style={inputStyle}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label style={labelStyle}>Quantity</label>
        <input
          type="number"
          placeholder="0"
          style={inputStyle}
          value={used}
          onChange={(e) => setUsed(e.target.value)}
        />
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={onCancel}
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
          onClick={handleAddItem}
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

export default AddItem;
