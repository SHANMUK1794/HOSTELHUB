import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEBData } from "../../../hooks/useEBData";
import axiosInstance from "../../../utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";

const EBFormAdd = ({ setIsOpen, showToast }) => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    floorNo: "F1",
    roomNo: "",
    month: "January",
    year: new Date().getFullYear().toString(),
    prevMonth: "",
    currentMonth: "",
  });

  const { saveEBData, isSaving } = useEBData("");
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const branchName = user?.role === "Admin" ? selectedBranch : user?.branchName;

  const { data: prevMonthData } = useQuery({
    queryKey: [
      "prevMonthUnits",
      branchName,
      formData.roomNo,
      formData.year,
      formData.month,
    ],
    queryFn: async () => {
      if (!formData.roomNo || !formData.month) return null;
      const res = await axiosInstance.get(`api/electricity/v1/getdata`, {
        params: {
          branchName,
          RoomNo: formData.roomNo,
          Year: formData.year,
          Month: formData.month,
        },
      });
      return res.data.previousMonth;
    },
    enabled: !!formData.roomNo && !!formData.month,
  });

  useEffect(() => {
    if (prevMonthData !== undefined)
      setFormData((p) => ({ ...p, prevMonth: prevMonthData }));
  }, [prevMonthData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      RoomNo: formData.roomNo,
      Month: formData.month,
      Year: Number(formData.year),
      PrevMonth: Number(formData.prevMonth),
      CurrentMonth: Number(formData.currentMonth),
      branchName,
    };
    try {
      await saveEBData(payload);
      showToast("EB record saved successfully", "success");
      setIsOpen(false);
    } catch {
      showToast("Error saving EB record", "error");
    }
  };

  const inputStyle = {
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    borderColor: "var(--theme-accent)40",
    color: "var(--theme-primary-text)",
  };

  const labelStyle = { color: "var(--theme-muted-text)" };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-2xl font-bold"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ×
        </button>
        <h2
          className="font-bold text-2xl mb-8 text-center"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Add EB Payment
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-10">
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Floor no
            </label>
            <input
              name="floorNo"
              value={formData.floorNo}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="F1"
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Year
            </label>
            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="2026"
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Room No
            </label>
            <input
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="A101"
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Previous Units
            </label>
            <input
              name="prevMonth"
              value={formData.prevMonth}
              readOnly
              className="w-full border rounded-xl px-4 py-2 cursor-not-allowed"
              style={{ ...inputStyle, opacity: 0.7 }}
              placeholder="113"
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Month
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Current Unit
            </label>
            <input
              name="currentMonth"
              value={formData.currentMonth}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="123"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white font-bold px-16 py-3 rounded-2xl shadow-xl hover:opacity-80 transition-all active:scale-95"
            style={{ backgroundColor: "var(--theme-button-bg)" }}
          >
            {isSaving ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EBFormAdd;
