import { useEffect, useRef, useState } from "react";
import { useEBData } from "../../../hooks/useEBData";

function EBFormEdit({ setIsOpen, editingId, setEditingId, paymentData, showToast }) {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    floorNo: "F1",
    roomNo: "",
    month: "",
    paymentDate: "",
    prevUnits: "",
    currentUnits: "",
    status: "Paid",
    payMode: "Cash",
    discount: "",
    additionalCharges: "",
  });

  const { saveEBData, isSaving } = useEBData("");

  useEffect(() => {
    if (editingId && paymentData) {
      const data = paymentData.find((item) => item._id === editingId);
      if (data) {
        setFormData({
          floorNo: data.FloorNo || "F1",
          roomNo: data.RoomNo,
          month: data.Month,
          paymentDate: data.paymentdate
            ? new Date(data.paymentdate).toISOString().split("T")[0]
            : "",
          prevUnits: data.PrevMonth || 0,
          currentUnits: data.CurrentMonth || 0,
          status: data.Status || "Paid",
          payMode: data.paymethod || "Cash",
          discount: data.DisAmt || 0,
          additionalCharges: data.Extras || 0,
        });
      }
    }
  }, [editingId, paymentData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId,
      RoomNo: formData.roomNo,
      FloorNo: formData.floorNo,
      CurrentMonth: Number(formData.currentUnits),
      Status: formData.status,
      DisAmt: Number(formData.discount),
      Extras: Number(formData.additionalCharges),
      paymethod: formData.payMode,
      paymentdate: formData.paymentDate,
    };
    try {
      await saveEBData(payload);
      showToast("Record updated successfully", "success");
      setIsOpen(false);
      setEditingId(null);
    } catch {
      showToast("Error updating record", "error");
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
          onClick={() => {
            setIsOpen(false);
            setEditingId(null);
          }}
          className="absolute top-6 right-6 text-2xl font-bold"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ×
        </button>
        <h2
          className="font-bold text-2xl mb-8 text-center"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Edit EB Payment
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
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
              Current Unit
            </label>
            <input
              name="currentUnits"
              value={formData.currentUnits}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="123"
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
              readOnly
              className="w-full border rounded-xl px-4 py-2 cursor-not-allowed"
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Month
            </label>
            <input
              name="month"
              value={formData.month}
              readOnly
              className="w-full border rounded-xl px-4 py-2 cursor-not-allowed"
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Payment Mode
            </label>
            <select
              name="payMode"
              value={formData.payMode}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Payment Date
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Discount
            </label>
            <input
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="0"
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
              name="prevUnits"
              value={formData.prevUnits}
              readOnly
              className="w-full border rounded-xl px-4 py-2 cursor-not-allowed"
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </div>
          <div>
            <label
              className="text-sm mb-1 block font-semibold"
              style={labelStyle}
            >
              Additional Charges
            </label>
            <input
              name="additionalCharges"
              value={formData.additionalCharges}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white font-bold px-16 py-3 rounded-2xl shadow-xl hover:opacity-80 transition-colors"
            style={{ backgroundColor: "var(--theme-button-bg)" }}
          >
            {isSaving ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EBFormEdit;
