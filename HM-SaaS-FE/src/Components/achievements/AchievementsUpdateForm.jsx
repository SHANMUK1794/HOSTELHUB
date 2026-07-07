import { X } from "lucide-react";
import React, { useState } from "react";
import useAchievements from "../../hooks/useAchievements";

const AchievementsUpdateForm = ({ setIsOpenFormUpdate, selectedRowData, showToast }) => {
  const { updateAchieveData, refetch } = useAchievements();

  const [achievementEditFormData, setAchievementEditFormData] = useState({
    ...selectedRowData,
  });

  const handleChange = (e) => {
    setAchievementEditFormData({
      ...achievementEditFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { name, date, floorno, roomno, branchName, position } =
      achievementEditFormData;

    if (!name || !date || !roomno || !floorno || !branchName || !position) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      const { _id, ...dataWithoutId } = achievementEditFormData;
      await updateAchieveData({ id: _id, data: dataWithoutId });
      showToast("Achievement updated successfully!", "success");
      refetch();
      setIsOpenFormUpdate(false);
    } catch (error) {
      console.error("Update failed:", error);
      showToast(error?.response?.data?.message || "Failed to update achievement.", "error");
    }
  };

  const inputClass = "w-full rounded-[12px] px-4 py-2.5 border outline-none";

  return (
    <div
      className="w-full max-w-[450px] rounded-[24px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] p-8 relative"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
        <div className="flex justify-center items-center mb-8">
          <h1
            className="font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
              fontSize: "var(--theme-font-subheading)",
            }}
          >
            Edit Details
          </h1>
          <button
            onClick={() => setIsOpenFormUpdate(false)}
            className="absolute top-6 right-6 hover:opacity-70 rounded-full p-1 transition"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {[
          { label: "Name", name: "name", placeholder: "Vasavi Sama" },
          { label: "Floor NO.", name: "floorno", placeholder: "1" },
          { label: "Room NO.", name: "roomno", placeholder: "G1" },
          {
            label: "Position",
            name: "position",
            placeholder: "mern developer",
          },
        ].map(({ label, name, placeholder }, i, arr) => (
          <div key={name} className={i === arr.length - 1 ? "mb-8" : "mb-4"}>
            <label
              className="text-[14px] block mb-2 font-medium"
              style={{
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              {label}
            </label>
            <input
              type="text"
              name={name}
              value={achievementEditFormData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={inputClass}
              style={{
                background:
                  "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                borderColor: "var(--theme-secondary-card-bg)",
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            />
          </div>
        ))}

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setIsOpenFormUpdate(false)}
            className="w-[165px] h-[50px] rounded-[12px] font-[500] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] hover:opacity-80 transition"
            style={{
              backgroundColor: "var(--theme-secondary-button-bg)",
              color: "var(--theme-secondary-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-10 py-2.5 rounded-[12px] font-[500] shadow-sm hover:opacity-90 transition"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Submit
          </button>
        </div>
      </div>
  );
};

export default AchievementsUpdateForm;
