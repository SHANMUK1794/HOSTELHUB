import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

const AddItem = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: "",
    itemName: "",
    quantity: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const activeBranch = useSelector(
    (state) => state.branch.selectedBranch || "",
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      branchName: activeBranch,
    };

    onAdd(newItem, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div
      className="rounded-[24px] shadow-[0_0_15px_rgba(0,0,0,0.12)] w-full max-w-[450px] px-8 pt-8 pb-8 relative flex flex-col font-['Montserrat']"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
      {/* Close Icon */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 hover:opacity-70 transition-opacity"
        style={{ color: "var(--theme-primary-text)" }}
      >
        <XMarkIcon className="w-6 h-6 stroke-2" />
      </button>

      {/* Modal Header */}
      <h2
        className="font-[700] text-[24px] leading-none text-center mb-6"
        style={{ color: "var(--theme-heading-text)" }}
      >
        Add Item
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mb-2">
        {/* Date */}
        <div className="flex flex-col space-y-1">
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
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
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
        <div className="flex flex-col space-y-1">
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
        <div className="flex flex-col space-y-1">
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

export default AddItem;
