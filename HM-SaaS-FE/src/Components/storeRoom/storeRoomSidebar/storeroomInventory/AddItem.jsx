import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/solid";

const AddItem = ({ onClose, onAdd }) => {
  const tenantBranches = useSelector(
    (state) => state.branch.tenantBranches || [],
  );
  const activeBranch = useSelector(
    (state) => state.branch.selectedBranch || "",
  );

  const [formData, setFormData] = useState({
    date: "",
    itemName: "",
    quantity: "",
    used: "",
    branchName: activeBranch || "",
  });

  useEffect(() => {
    if (activeBranch) {
      setFormData((prev) => ({ ...prev, branchName: activeBranch }));
    }
  }, [activeBranch]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = Number(formData.quantity);
    const used = Number(formData.used);
    const balance = quantity - used;

    const newItem = {
      date: formData.date,
      itemName: formData.itemName,
      quantity,
      used,
      balance,
      branchName: formData.branchName,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-[450px] px-8 pt-8 pb-8 shadow-xl mx-auto rounded-[24px] flex flex-col font-['Montserrat']"
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

      {/* Modal Title */}
      <h2
        className="text-[24px] font-[600] leading-none text-center mb-6"
        style={{ color: "var(--theme-heading-text)" }}
      >
        Used Item
      </h2>

      <div className="flex flex-col space-y-4 mb-6">
        {/* Date */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="date"
            className="text-[14px] font-[500] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Item Name */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="itemName"
            className="text-[14px] font-[500] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Item Name
          </label>
          <input
            id="itemName"
            type="text"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Widget A"
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px] placeholder:text-[14px] placeholder-[#8A8A8A]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Branch Name */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="branchName"
            className="text-[14px] font-[500] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Branch Name
          </label>
          <select
            id="branchName"
            value={formData.branchName}
            onChange={handleChange}
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          >
            <option value="">Select Branch</option>
            {tenantBranches.map((branch, i) => (
              <option key={i} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity (Used) */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="used"
            className="text-[14px] font-[500] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Quantity
          </label>
          <input
            id="used"
            type="number"
            value={formData.used}
            onChange={handleChange}
            placeholder="12"
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px] placeholder:text-[14px] placeholder-[#8A8A8A]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-2">
        <button
          type="submit"
          className="w-[180px] h-[44px] font-[500] text-[16px] rounded-[10px] hover:opacity-90 transition-opacity shadow-sm"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddItem;
