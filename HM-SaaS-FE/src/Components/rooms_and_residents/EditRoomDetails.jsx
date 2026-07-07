import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";

const EditRoomDetails = ({ selectedRoom, onUpdate, onClose, showToast }) => {
  const selectedBranchName = useSelector(
    (state) => state.branch.selectedBranch,
  );
  const user = useSelector((state) => state.auth.user);
  const branchName =
    user?.role === "Warden" ? user?.branchName : selectedBranchName;

  const [formData, setFormData] = useState({
    _id: "",
    Floor: "",
    RoomNo: "",
    RoomType: "",
    Capacity: "",
    Occupied: "",
    Rate: "",
    status: "",
  });

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        _id: selectedRoom._id || "",
        Floor: selectedRoom.Floor || "",
        RoomNo: selectedRoom.RoomNo || "",
        RoomType: selectedRoom.RoomType || "",
        Capacity: selectedRoom.Capacity?.toString() || "0",
        Occupied: selectedRoom.Occupied?.toString() || "0",
        Rate: selectedRoom.Rate?.toString() || "0",
        status: selectedRoom.status || "",
      });
    }
  }, [selectedRoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capacity = parseInt(formData.Capacity);
    const occupied = parseInt(formData.Occupied);

    if (occupied > capacity) {
      showToast("Occupied cannot be more than Capacity.", "error");
      return;
    }

    const updatedRoom = {
      ...formData,
      Capacity: capacity,
      Occupied: occupied,
      Rate: parseFloat(formData.Rate),
      branchName: branchName,
    };

    try {
      await onUpdate(updatedRoom);
      onClose();
    } catch (error) {
      showToast("Failed to update room details.", "error");
      console.error(error);
    }
  };

  const selectStyle = {
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    border: "1px solid var(--theme-secondary-card-bg)",
    color: "var(--theme-muted-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };

  return (
    <div
      className="rounded-[30px] shadow-2xl w-full max-h-[calc(100vh-140px)] overflow-y-auto p-6 md:px-8 md:py-6 relative custom-scrollbar"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
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
        Edit Details
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
            style={selectStyle}
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
        />

        <InputField
          label="Occupied"
          type="number"
          value={formData.Occupied}
          onChange={(val) => setFormData({ ...formData, Occupied: val })}
        />

        <div className="flex flex-col space-y-1">
          <label
            className="text-sm font-medium ml-1"
            style={{
              color: "var(--theme-muted-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full rounded-xl py-2 px-4 outline-none text-sm appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
            style={selectStyle}
            required
          >
            <option value="">Select Status</option>
            <option value="Vacant">Vacant</option>
            <option value="Partial">Partial</option>
            <option value="Full">Full</option>
          </select>
        </div>

        <InputField
          label="Rent"
          type="number"
          value={formData.Rate}
          onChange={(val) => setFormData({ ...formData, Rate: val })}
        />

        <div className="pt-2 pl-24">
          <button
            type="submit"
            className="px-16 font-bold py-2 rounded-xl text-md shadow-md transition-opacity hover:opacity-90"
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--theme-secondary-card-bg);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

const InputField = ({ label, type = "text", value, onChange }) => (
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

export default EditRoomDetails;
