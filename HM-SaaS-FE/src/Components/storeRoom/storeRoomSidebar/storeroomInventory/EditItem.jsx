import { useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/solid";

const EditItem = ({ onClose, formData, setFormData, handleUpdate }) => {
  const tenantBranches = useSelector(
    (state) => state.branch.tenantBranches || [],
  );

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
        Edit Item
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
          onClose();
        }}
        className="flex flex-col gap-y-4 mb-2"
      >
        {/* Date */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="date"
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={
              formData.date
                ? new Date(formData.date).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Item Name
          </label>
          <input
            id="itemName"
            type="text"
            value={formData.itemName || ""}
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
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
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Branch Name
          </label>
          <select
            id="branchName"
            value={formData.branchName || ""}
            onChange={(e) =>
              setFormData({ ...formData, branchName: e.target.value })
            }
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          >
            <option value="">Select Branch</option>
            {tenantBranches.length > 0 ? (
              tenantBranches.map((branch, i) => (
                <option key={i} value={branch}>
                  {branch}
                </option>
              ))
            ) : (
              // Fallback static options if tenantBranches not populated
              <>
                <option value="IOB Mens Hostel">IOB Mens Hostel</option>
                <option value="Rameswaram Mens Hostel">
                  Rameswaram Mens Hostel
                </option>
                <option value="New Mens Hostel">New Mens Hostel</option>
                <option value="Womens Hostel">Womens Hostel</option>
                <option value="Kitchen branch">Kitchen branch</option>
                <option value="Common">Common</option>
              </>
            )}
          </select>
        </div>

        {/* Used Quantity */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="used"
            className="font-[500] text-[14px] leading-normal"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Quantity
          </label>
          <input
            id="used"
            type="text"
            value={formData.used || ""}
            onChange={(e) => setFormData({ ...formData, used: e.target.value })}
            className="w-full h-[44px] rounded-[8px] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)] focus:outline-none px-4 text-[14px]"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-primary-text)",
            }}
          />
        </div>

        {/* Submit Button */}
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
