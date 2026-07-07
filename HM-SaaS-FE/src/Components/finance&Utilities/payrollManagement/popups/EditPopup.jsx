import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useUpdatePayroll } from "../../../../hooks/usePayroll";
import { useTheme } from "../../../../hooks/ThemeContext";

const EditPopup = ({ rowData, onClose, showToast }) => {
  const updatePayroll = useUpdatePayroll();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({});

  useEffect(() => { 
    

    if (rowData) {
    
      const salary = Number(rowData.salary || 0);
      const advance = Number(rowData.advance || 0);
      const overtime = Number(rowData.overtime || 0);
      const bonus = Number(rowData.bonus || 0);
      const deduction = Number(rowData.deduction || 0);
      const roundoff = Number(rowData.roundoff || 0);
      const dailySalary = salary / 30;

      const hourlySalary = dailySalary / 8;

      const overtimeAmount =
        hourlySalary * overtime;

      const calculatedTotal =
        salary -
        bonus +
        overtimeAmount +
        roundoff -
        deduction;

      setFormData({
        _id: rowData._id || "",
        staff_name: rowData.staff_name || "",
        mobile: rowData.mobile || "",
        designation: rowData.designation || "",
        date: rowData.date || "",
        month: rowData.month || "",
        year: rowData.year || "",
        salary,
        advance,
        balance: Number(rowData.balance || 0),
        deduction,
        workingdays: Number(rowData.workingdays || 0),
        overtime,
        bonus,
        total: calculatedTotal,
        roundoff,
        status: rowData.status || "",
      });
    }
  }, [rowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "salary",
      "advance",
      "balance",
      "deduction",
      "workingdays",
      "overtime",
      "bonus",
      "roundoff",
    ];
    setFormData((prev) => {
      const updatedValue = numericFields.includes(name)
        ? Number(value || 0)
        : value;
      const updatedData = { ...prev, [name]: updatedValue };
      const salary = Number(updatedData.salary || 0);
      // const advance = Number(updatedData.advance || 0);
      const overtime = Number(updatedData.overtime || 0);
      const bonus = Number(updatedData.bonus || 0);
      const deduction = Number(updatedData.deduction || 0);
      const roundoff = Number(updatedData.roundoff || 0);
      const dailySalary = salary / 30;

      const hourlySalary = dailySalary / 8;

      const overtimeAmount =
        hourlySalary * overtime;

      updatedData.total =
        salary -
        bonus +
        overtimeAmount +
        roundoff -
        deduction;

      return updatedData;
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePayroll.mutateAsync(formData);
      showToast("Payment updated successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Edit error:", error);
      const errMsg = 
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        error?.message || 
        "Failed to update payment";
      showToast(errMsg, "error");
    }
  };

  const inputStyle =
    "w-full h-[38px] rounded-[10px] border px-3 text-[14px] outline-none";

  const inputProps = {
    style: {
      borderColor: "var(--theme-secondary-card-bg)",
      background:
        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
      color: "var(--theme-primary-text)",
    },
  };

  const labelStyle = {
    style: {
      color: "var(--theme-primary-text)",
      fontFamily: "var(--theme-font-family-primary)",
    },
  };

  
  return (
    <div
      onClick={handleOverlayClick}
      className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 p-3 pt-0 pb-10"
    >
      <div
        className="w-full max-w-[550px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] rounded-3xl shadow-xl overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col relative"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        {/* HEADER */}
        <div className="relative mb-5 flex items-center justify-center">
          <h2
            className="text-[20px] font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Edit Payment
          </h2>
          <button onClick={onClose} className="absolute right-0 top-0">
            <MdClose size={28} style={{ color: "var(--theme-primary-text)" }} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Salary Date
              </label>
              <input
                type="date"
                name="date"
                value={
                  formData.date
                    ? new Date(formData.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Balance
              </label>
              <input
                type="number"
                name="balance"
                value={formData.balance || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Month
              </label>
              <select
                name="month"
                value={formData.month || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              >
                <option value="">Select Month</option>
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
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Deduction
              </label>
              <input
                type="number"
                name="deduction"
                value={formData.deduction || ""}
                onChange={handleInputChange}
                placeholder="Enter Deduction Amount"
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year || ""}
                onChange={handleInputChange}
                placeholder="0000"
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Working Days
              </label>
              <input
                type="number"
                name="workingdays"
                value={formData.workingdays || ""}
                onChange={handleInputChange}
                placeholder="Enter Working days"
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Staff Name
              </label>
              <input
                type="text"
                name="staff_name"
                value={formData.staff_name || ""}
                onChange={handleInputChange}
                placeholder="Enter Name"
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Leave Salary
              </label>
              <input
                type="number"
                name="bonus"
                value={formData.bonus || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Mobile Number
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className={`${inputStyle} flex-1`}
                  {...inputProps}
                />
                <button
                  type="button"
                  className="h-[38px] min-w-[80px] rounded-[10px] px-4 text-[14px] font-semibold"
                  style={{
                    backgroundColor: "var(--theme-button-bg)",
                    color: "var(--theme-button-text)",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ""}
                onChange={handleInputChange}
                placeholder="Enter designation"
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Total
              </label>
              <input
                type="number"
                name="total"
                value={formData.total || ""}
                readOnly
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Advance
              </label>
              <input
                type="number"
                name="advance"
                value={formData.advance || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Roundoff
              </label>
              <input
                type="number"
                name="roundoff"
                step="any"
                value={formData.roundoff || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Status
              </label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-[15px] font-medium"
                {...labelStyle}
              >
                Overtime
              </label>
              <input
                type="number"
                name="overtime"
                value={formData.overtime || ""}
                onChange={handleInputChange}
                className={inputStyle}
                {...inputProps}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="mt-9 flex justify-center">
            <button
              type="submit"
              disabled={updatePayroll.isLoading}
              className="h-[40px] min-w-[180px] rounded-[10px] px-8 font-semibold"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              {updatePayroll.isLoading ? "Updating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPopup;
