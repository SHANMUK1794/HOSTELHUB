import { useState } from "react";
import useAchievements from "../../hooks/useAchievements";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

const AchievementsForm = ({ setIsOpenForm, showToast }) => {
  const { addData, refetch } = useAchievements();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const [addDataInForm, setAddDataInForm] = useState({
    branchName: branchName,
    date: new Date().toISOString().split("T")[0],
    name: "",
    floorno: "",
    roomno: "",
    position: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setAddDataInForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { branchName, date, name, roomno, floorno, position } = addDataInForm;

    if (!branchName || !date || !name || !roomno || !floorno || !position) {
      showToast("Please fill all the fields before submitting.", "error");
      return;
    }

    try {
      const response = await addData(addDataInForm);

      if (response?.error) {
        showToast(response.error.message || "Failed to add achievement.", "error");
        return;
      }

      await refetch();
      setIsOpenForm(false);
      showToast("Achievement added successfully!", "success");
    } catch (error) {
      console.error("Add data error:", error);
      showToast(error?.response?.data?.message || "Something went wrong while adding data.", "error");
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
            className="font-bold text-[24px]"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
              fontSize: "var(--theme-font-subheading)",
            }}
          >
            Add Details
          </h1>
          <button
            onClick={() => setIsOpenForm(false)}
            className="absolute top-6 right-6 hover:opacity-70 rounded-full p-1 transition"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {[
          { label: "Name", name: "name", placeholder: "Sourav" },
          { label: "Floor NO.", name: "floorno", placeholder: "F-4" },
          { label: "Room NO.", name: "roomno", placeholder: "A101" },
          { label: "Position", name: "position", placeholder: "IFS" },
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
              value={addDataInForm[name]}
              onChange={handleInput}
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
            onClick={() => setIsOpenForm(false)}
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

export default AchievementsForm;
