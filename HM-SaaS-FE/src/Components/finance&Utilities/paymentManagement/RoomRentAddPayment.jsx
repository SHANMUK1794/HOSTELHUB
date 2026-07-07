import { useEffect, useState, useRef } from "react";
import { useSaveRoomRent } from "../../../hooks/useRoomRent";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/AxiosInstance";
import ApiRoutes from "../../../utils/ApiRoutes";

const RoomRentAddPayment = ({ setIsOpen, selectedRoomRent, showToast }) => {
  const formRef = useRef(null);
  const saveRoomRent = useSaveRoomRent();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const branchName = user?.role === "Admin" ? selectedBranch : user?.branchName;

  const [formData, setFormData] = useState({
    residentName: "",
    roomNo: "",
    floorNo: "",
    advance: "",
    status: "Select Status",
    paymentMethod: "Cash",
    totalAmount: "",
    billNumber: "",
    mobileNumber: "",
    discount: "",
  });

  useEffect(() => {
    if (selectedRoomRent) {
      setFormData({
        residentName: selectedRoomRent.ResidentName || "",
        roomNo: selectedRoomRent.RoomNo || "",
        floorNo: selectedRoomRent.FloorNo || "F1",
        advance: selectedRoomRent.Advance || "",
        status: selectedRoomRent.Status || "Paid",
        paymentMethod: selectedRoomRent.PaymentMethod || "Cash",
        totalAmount: selectedRoomRent.Total || "",
        billNumber: selectedRoomRent.BillNo || "",
        mobileNumber: selectedRoomRent.MobileNo || "",
        discount: selectedRoomRent.DisAmt || "",
      });
    }
  }, [selectedRoomRent]);

  useEffect(() => {
    const fetchUserByMobile = async () => {
      try {
        const response = await axiosInstance.get(
          ApiRoutes.REGISTER.GET_BY_MOBILE(formData.mobileNumber)
        );
        if (response.data?.success && response.data?.data) {
          const user = response.data.data;
          setFormData((prev) => ({
            ...prev,
            residentName: user.Name || prev.residentName,
            roomNo: user.RoomNo || prev.roomNo,
            floorNo: user.FloorNo || prev.floorNo,
            billNumber: user.BillNo || prev.billNumber,
            discount: user.Discount !== undefined ? user.Discount : prev.discount,
            advance: user.Advance !== undefined ? user.Advance : prev.advance,
          }));
          showToast("Data auto-filled from Register", "success");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Only show error if it's explicitly not found, so it doesn't spam on generic errors
          showToast("No registered user found with this mobile number", "error");
        }
      }
    };

    if (!selectedRoomRent && formData.mobileNumber.length === 10) {
      fetchUserByMobile();
    }
  }, [formData.mobileNumber, selectedRoomRent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ResidentName: formData.residentName,
      RoomNo: formData.roomNo,
      FloorNo: formData.floorNo,
      MobileNo: formData.mobileNumber,
      Advance: Number(formData.advance),
      BillNo: formData.billNumber,
      DisAmt: Number(formData.discount),
      PaymentMethod: formData.paymentMethod,
      Status: formData.status,
      branchName,
    };
    if (selectedRoomRent?._id) payload._id = selectedRoomRent._id;

    saveRoomRent.mutate(
      { payload, isEdit: !!payload._id },
      {
        onSuccess: () => setIsOpen(false),
        onError: () => showToast("Failed to save payment.", "error"),
      },
    );
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
        className="p-8 rounded-3xl w-full max-w-2xl relative shadow-2xl max-h-[calc(100vh-140px)] overflow-y-auto"
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
          {selectedRoomRent ? "Edit Payment" : "Add Payment"}
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Name
            </label>
            <input
              name="residentName"
              value={formData.residentName}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="Balaji"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Mobile no
            </label>
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="9876554234"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Floor No
            </label>
            <input
              name="floorNo"
              value={formData.floorNo}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="2"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Bill No
            </label>
            <input
              name="billNumber"
              value={formData.billNumber}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="532"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
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
            <label className="text-sm mb-1 block" style={labelStyle}>
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
            <label className="text-sm mb-1 block" style={labelStyle}>
              Total Amount
            </label>
            <input
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full border rounded-xl px-4 py-2 cursor-not-allowed"
              style={{ ...inputStyle, opacity: 0.7 }}
              placeholder="23,000"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Payment Mode
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Advance Amount
            </label>
            <input
              name="advance"
              value={formData.advance}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
              placeholder="11,000"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={labelStyle}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 outline-none"
              style={inputStyle}
            >
              <option value="Select Status">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white font-bold px-12 py-3 rounded-2xl shadow-xl hover:opacity-80 transition-colors"
            style={{ backgroundColor: "var(--theme-button-bg)" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomRentAddPayment;
