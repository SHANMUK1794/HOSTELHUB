import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const EditItem = ({ selectedExpenses, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    _id: "",
    date: "",
    itemName: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (selectedExpenses) {
      const isoDate = new Date(selectedExpenses.date)
        .toISOString()
        .split("T")[0];

      setFormData({
        _id: selectedExpenses._id,
        date: isoDate,
        itemName: selectedExpenses.itemName,
        quantity: selectedExpenses.quantity,
        price: selectedExpenses.price || "",
      });
    }
  }, [selectedExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedItem = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    onUpdate(updatedItem, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div
      className="rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.08)] w-full max-w-[500px] px-6 py-5 relative flex flex-col font-['Montserrat'] max-h-[calc(100vh-140px)] overflow-y-auto"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
      {/* Modal Header */}
      <h2
        className="font-[700] text-[24px] leading-none text-center mb-4"
        style={{ color: "var(--theme-heading-text)" }}
      >
        Edit Item
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 hover:opacity-70 transition-colors"
        style={{ color: "var(--theme-primary-text)" }}
      >
        <XMarkIcon className="w-6 h-6 stroke-2" />
      </button>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        {/* Date */}
        <div className="flex flex-col mb-1 space-y-1">
          <label
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full h-[38px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px] placeholder:text-[14px] placeholder-[#8A8A8A]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Item Name */}
        <div className="flex flex-col mb-1 space-y-1">
          <label
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Description
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Widget A"
            required
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px] placeholder:text-[14px] placeholder-[#8A8A8A]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col mb-4 space-y-1">
          <label
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="12"
            required
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px] placeholder:text-[14px] placeholder-[#8A8A8A]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col mb-4 space-y-1">
          <label
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="150"
            required
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px] placeholder:text-[14px] placeholder-[#8A8A8A]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-2">
          <button
            type="submit"
            className="w-[180px] h-[44px] font-[500] text-[16px] rounded-[10px] shadow-sm hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
