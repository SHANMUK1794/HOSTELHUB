import axiosInstance from "../../../utils/AxiosInstance";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEBData } from "../../../hooks/useEBData";

function EBForm({ setIsOpen, editingIndex, setEditingIndex, paymentData, showToast }) {
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [formData, setFormData] = useState({
    roomNo: "",
    month: "",
    prevMonth: "",
    currentMonth: "",
    costPerUnit: 15,
    status: "Unpaid",
  });

  const { saveEBData, isPending } = useEBData(selectedYearMonth);
  const formRef = useRef();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const [isFirstEntry, setIsFirstEntry] = useState(true);
  const months = [
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
  ];

  useEffect(() => {
    if (!formData.roomNo || editingIndex !== null) return;
    const fetchPrevMonth = async () => {
      try {
        const res = await axiosInstance.get(
          `api/electricity/v1/getdata?branchName=${branchName}&RoomNo=${formData.roomNo}`,
        );
        const { previousMonth } = res.data;
        if (previousMonth !== undefined && previousMonth !== 0) {
          setFormData((prev) => ({ ...prev, prevMonth: previousMonth }));
          setIsFirstEntry(false);
        } else {
          setFormData((prev) => ({ ...prev, prevMonth: "" }));
          setIsFirstEntry(true);
        }
      } catch (error) {
        if (!isFirstEntry) showToast("Failed to fetch previous month", "error");
      }
    };
    fetchPrevMonth();
  }, [formData.roomNo, editingIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "prevMonth" && !isFirstEntry && editingIndex === null) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prev = parseFloat(formData.prevMonth) || 0;
    const curr = parseFloat(formData.currentMonth) || 0;
    const totalUnits = curr - prev;
    const payload = {
      RoomNo: formData.roomNo,
      ResidentName: formData.residentName,
      Month: formData.month,
      PrevMonth: prev,
      CurrentMonth: curr,
      TotalUnits: totalUnits,
      CostPerUnit: Number(formData.costPerUnit),
      Status: formData.status,
      branchName,
    };
    if (editingIndex !== null && paymentData?.[editingIndex]?._id) {
      payload.id = paymentData[editingIndex]._id;
    }
    try {
      await saveEBData(payload);
      setIsOpen(false);
      setEditingIndex(null);
    } catch (err) {
      showToast("Failed to add payment", "error");
    }
  };

  useEffect(() => {
    if (editingIndex !== null && paymentData?.[editingIndex]) {
      const {
        RoomNo,
        ResidentName,
        Month,
        PrevMonth,
        CurrentMonth,
        Status,
        CostPerUnit,
      } = paymentData[editingIndex];
      setFormData({
        roomNo: RoomNo,
        residentName: ResidentName || paymentData[editingIndex].UserName || "",
        month: Month,
        prevMonth: PrevMonth || 0,
        currentMonth: CurrentMonth || "",
        status: Status || "Unpaid",
        costPerUnit: CostPerUnit || 15,
      });
    }
  }, [editingIndex, paymentData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setIsOpen(false);
        setEditingIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalUnits =
    parseFloat(formData.currentMonth || 0) -
    parseFloat(formData.prevMonth || 0);
  const totalCost = totalUnits * parseFloat(formData.costPerUnit || 0);

  const inputClass =
    "w-full px-3 py-1 mb-3 rounded-xl border shadow outline-none";
  const inputStyle = {
    borderColor: "var(--theme-secondary-card-bg)",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const labelStyle = {
    fontSize: "var(--theme-font-small)",
    color: "var(--theme-primary-text)",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 ml-10 md:ml-1"
      style={{ backgroundColor: "transparent" }}
      onClick={() => setIsOpen(false)}
    >
      <form
        ref={formRef}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="px-8 py-8 rounded-2xl w-80 shadow-lg"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          fontFamily: "var(--theme-font-family-primary)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {editingIndex !== null ? "Edit EB Payment" : "Add EB Payment"}
        </h2>

        <label className="text-sm" style={labelStyle}>
          Room No.
        </label>
        <input
          type="text"
          name="roomNo"
          required
          value={formData.roomNo}
          onChange={handleChange}
          readOnly={editingIndex !== null}
          className={inputClass}
          style={inputStyle}
        />

        {editingIndex !== null && (
          <>
            <label className="text-sm" style={labelStyle}>
              Resident Name
            </label>
            <input
              type="text"
              name="residentName"
              required
              value={formData.residentName}
              onChange={handleChange}
              readOnly={editingIndex !== null}
              className={inputClass}
              style={inputStyle}
            />
          </>
        )}

        <label className="text-sm" style={labelStyle}>
          Month
        </label>
        {editingIndex !== null ? (
          <input
            type="text"
            name="month"
            value={formData.month}
            readOnly
            className={inputClass}
            style={{ ...inputStyle, opacity: 0.7 }}
          />
        ) : (
          <select
            name="month"
            required
            value={formData.month}
            onChange={handleChange}
            className={inputClass}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-5">
          <div>
            <label className="text-sm" style={labelStyle}>
              Previous Units
            </label>
            <input
              type="number"
              name="prevMonth"
              value={formData.prevMonth}
              onChange={handleChange}
              required
              placeholder={isFirstEntry ? "Enter previous unit" : ""}
              className={inputClass}
              style={{
                ...inputStyle,
                opacity: !isFirstEntry && editingIndex === null ? 0.7 : 1,
              }}
            />
          </div>
          <div>
            <label className="text-sm" style={labelStyle}>
              Current Units
            </label>
            <input
              type="number"
              name="currentMonth"
              required
              value={formData.currentMonth}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {editingIndex !== null && (
          <div className="mb-3">
            <label className="text-sm" style={labelStyle}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        )}

        {Number(formData.currentMonth) > 0 &&
          Number(formData.prevMonth) > 0 &&
          !isNaN(totalUnits) && (
            <p
              className="text-sm mb-2"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Total Units: {totalUnits} | Total Cost: ₹{totalCost.toFixed(2)}
            </p>
          )}

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1 rounded-xl shadow hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EBForm;
