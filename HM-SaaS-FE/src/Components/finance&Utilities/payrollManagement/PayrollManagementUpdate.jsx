import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSavePayroll } from "../../../hooks/usePayroll";

const PayrollManagementUpdate = ({ setIsOpen, defaultData = null, showToast }) => {
  const { mutate: savePayroll } = useSavePayroll();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  const [formData, setFormData] = useState({
    date: "",
    staff_name: "",
    staff_role: "",
    salary: "",
    advance: "",
    overtime: "",
    status: "Unpaid",
  });

  useEffect(() => {
    if (defaultData) {
      setFormData({
        date: defaultData.date
          ? new Date(defaultData.date).toISOString().split("T")[0]
          : "",
        staff_name: defaultData.staff_name || "",
        staff_role: defaultData.staff_role || "",
        salary: defaultData.salary || "",
        advance: defaultData.advance || "",
        overtime:
          defaultData.overtime !== undefined
            ? defaultData.overtime.toString()
            : "",
        status: defaultData.status || "Unpaid",
        _id: defaultData._id,
      });
    }
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const salary = Number(formData.salary || 0);
    const advance = Number(formData.advance || 0);
    const balance = salary - advance;
    const preparedData = {
      ...formData,
      staff_name: formData.staff_name.trim(),
      staff_role: formData.staff_role.trim(),
      date: formData.date.trim(),
      status: formData.status,
      salary,
      advance,
      balance,
      overtime: Number(formData.overtime || 0),
      branchName,
    };
    const requiredFields = [
      "date",
      "staff_name",
      "staff_role",
      "salary",
      "advance",
    ];
    const allFieldsFilled = requiredFields.every((key) => {
      const val = preparedData[key];
      if (typeof val === "string") return val.trim() !== "";
      if (typeof val === "number") return !isNaN(val);
      return Boolean(val);
    });
    if (!allFieldsFilled) {
      showToast(
        "Please fill all fields correctly. Note: zero is not allowed.", "error"
      );
      return;
    }
    savePayroll(preparedData, {
      onSuccess: () => setIsOpen(false),
      onError: () =>
        showToast("Failed to save. Please check all fields and try again.", "error"),
    });
  };

  const inputClass =
    "w-full px-3 py-1 mb-3 rounded-xl border shadow outline-none";
  const inputStyle = {
    borderColor: "var(--theme-secondary-card-bg)",
    backgroundColor: "var(--theme-filter-bg)",
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
    >
      <form
        onSubmit={handleSubmit}
        className="px-6 py-6 rounded-2xl w-[320px] shadow-lg"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {defaultData ? "Edit Details" : "Add Details"}
        </h2>

        <label className="text-sm" style={labelStyle}>
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={inputClass}
          style={inputStyle}
        />

        <div className="flex gap-3 mb-3">
          <div className="w-1/2">
            <label className="text-sm" style={labelStyle}>
              Staff Name
            </label>
            <input
              type="text"
              name="staff_name"
              value={formData.staff_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-1 mt-1 rounded-xl border shadow outline-none"
              style={inputStyle}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm" style={labelStyle}>
              Staff Role
            </label>
            <select
              name="staff_role"
              value={formData.staff_role}
              onChange={handleChange}
              required
              className="w-full px-3 py-1 mt-1 rounded-xl border shadow outline-none"
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Warden">Warden</option>
              <option value="Chef">Chef</option>
              <option value="Storeman">Storeman</option>
              <option value="Other Employees">Other Employees</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="w-1/2">
            <label className="text-sm" style={labelStyle}>
              Salary
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="w-full px-3 py-1 mt-1 rounded-xl border shadow outline-none"
              style={inputStyle}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm" style={labelStyle}>
              Advance
            </label>
            <input
              type="number"
              name="advance"
              value={formData.advance}
              onChange={handleChange}
              required
              className="w-full px-3 py-1 mt-1 rounded-xl border shadow outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="w-1/2">
            <label className="text-sm" style={labelStyle}>
              Overtime
            </label>
            <input
              type="number"
              name="overtime"
              value={formData.overtime}
              onChange={handleChange}
              className="w-full px-3 py-1 mt-1 rounded-xl border shadow outline-none"
              style={inputStyle}
            />
          </div>
          <div className="w-1/2" />
        </div>

        {defaultData && (
          <div className="flex items-center mb-5">
            <label className="text-sm mr-2" style={labelStyle}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="px-3 py-[6px] rounded-xl border outline-none w-1/2"
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        )}

        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 rounded-xl shadow hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "var(--theme-filter-bg)",
              color: "var(--theme-primary-text)",
              border: "1px solid var(--theme-secondary-card-bg)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded-xl shadow hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            {defaultData ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollManagementUpdate;
