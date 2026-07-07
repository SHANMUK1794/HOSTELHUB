import { useState } from "react";
import { useSelector } from "react-redux";
import { useRoomsResidents } from "../../hooks/useRoomsResident";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddRoomForm = ({ onClose, category, showToast }) => {
  const selectedBranchName = useSelector(
    (state) => state.branch.selectedBranch,
  );
  const user = useSelector((state) => state.auth.user);
  const branchName =
    user?.role === "Warden" ? user?.branchName : selectedBranchName;

  const [formData, setFormData] = useState({
    Floor: "",
    RoomNo: "",
    RoomType: "",
    Capacity: "",
    Rate: "",
  });

  const { addRoomMutation } = useRoomsResidents({ showToast });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category: category,
      Capacity: Number(formData.Capacity),
      Rate: Number(formData.Rate),
      branchName: String(branchName),
    };

    try {
      await addRoomMutation.mutateAsync(payload);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-[30px] shadow-2xl w-full max-h-[calc(100vh-140px)] p-6 md:px-8 md:py-6 relative">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 hover:scale-110 transition-transform z-10"
        style={{ color: "var(--theme-primary-text)" }}
      >
        <XMarkIcon className="h-6 w-6 stroke-2" />
      </button>

      <h2
        className="text-xl md:text-2xl font-bold text-center mb-4"
        style={{
          color: "var(--theme-heading-text)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        Add Room Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
        <InputField
          label="Floor No"
          value={formData.Floor}
          onChange={(val) => setFormData({ ...formData, Floor: val })}
        />

        <InputField
          label="Room No"
          value={formData.RoomNo}
          onChange={(val) => setFormData({ ...formData, RoomNo: val })}
        />

        <div className="flex flex-col space-y-1">
          <label
            className="text-sm font-medium ml-1"
            style={{
              color: "var(--theme-muted-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Room Type
          </label>
          <select
            value={formData.RoomType}
            onChange={(e) =>
              setFormData({ ...formData, RoomType: e.target.value })
            }
            className="w-full rounded-xl py-2 px-4 outline-none text-sm appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
              border: "1px solid var(--theme-secondary-card-bg)",
              color: "var(--theme-muted-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
            required
          >
            <option value="">Select Room Type</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </div>

        <InputField
          label="Capacity"
          type="number"
          value={formData.Capacity}
          onChange={(val) => setFormData({ ...formData, Capacity: val })}
          placeholder="0"
        />

        <InputField
          label="Rent"
          type="number"
          value={formData.Rate}
          onChange={(val) => setFormData({ ...formData, Rate: val })}
          placeholder="0"
        />

        <div className="pt-2">
          <button
            type="submit"
            className="flex font-bold py-2 rounded-xl text-md shadow-md transition-opacity px-20 justify-center align-middle text-center ml-20 hover:opacity-90"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col space-y-1">
    <label
      className="text-sm font-medium ml-1"
      style={{
        color: "var(--theme-muted-text)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full rounded-xl py-2 px-4 outline-none text-sm transition-colors"
      style={{
        background:
          "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
        border: "1px solid var(--theme-secondary-card-bg)",
        color: "var(--theme-primary-text)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--theme-accent)")}
      onBlur={(e) =>
        (e.target.style.borderColor = "var(--theme-secondary-card-bg)")
      }
    />
  </div>
);

export default AddRoomForm;
