import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "../../../../utils/AxiosInstance";
import { useSavePayroll } from "../../../../hooks/usePayroll";
import { useSelector } from "react-redux";
import { useTheme } from "../../../../hooks/ThemeContext";
// import { loadBusinessConfig } from "../../../settings/Settings"

const AddPaymentPopup = ({ onClose, showToast }) => {
  const saveMutation = useSavePayroll();
  const { theme } = useTheme();

  const selectedBranch = useSelector((s) => s.branch?.selectedBranch || "");

  const [formData, setFormData] = useState({
    date: "",
    month: "",
    year: new Date().getFullYear(),
    mobile: "",
    employeeId: "",
    staff_name: "",
    staff_role: "",
    salary: 0,
    advance: 0,
    balance: 0,
    overtime: 0,
    bonus: 0,
    deduction: 0,
    designation: "",
    total: 0,
    roundoff: 0,
    leave: 0,
    cl: 0,
    leavewages: 0,
    paymentmethod: "Cash",
    status: "",
    branchName: "",
    workingdays: 0,
  });

  useEffect(() => {
    if (selectedBranch) {
      setFormData((prev) => ({ ...prev, branchName: selectedBranch }));
    }
  }, [selectedBranch]);

  useEffect(() => {
    

    const mobile = String(formData.mobile || "").trim();
    if (!mobile || mobile.length < 6) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      
      try {
        const monthMap = {
          January: "01",
          February: "02",
          March: "03",
          April: "04",
          May: "05",
          June: "06",
          July: "07",
          August: "08",
          September: "09",
          October: "10",
          November: "11",
          December: "12",
        };
        const numericMonth =
          formData.month && monthMap[formData.month]
            ? monthMap[formData.month]
            : new Date().toISOString().slice(5, 7);
        const res = await axios.post("/api/v1/payroll/getinfo", {
          phoneNumber: mobile,
          branchName: formData.branchName,
          month: numericMonth,
          year: formData.year,
        });
        
        const empData = res.data?.data;
        const emp = empData?.employee;

        

        if (!cancelled && empData && emp) {
          setFormData((prev) => ({
            ...prev,
            employeeId: emp._id || "",
            staff_name: emp.Name || "",
            staff_role: emp.Shift || prev.staff_role || "Employee",
            designation: emp.Designation || prev.designation || "",
            salary: emp.Salary != null ? Number(emp.Salary) : 0,
            advance: empData.advance != null ? Number(empData.advance) : 0,
            // bonus: empData.bonus != null ? Number(empData.bonus) : 0,
            // cl: empData.cl != null ? Number(empData.cl) : 0,
            bonus:
              empData.leavewages != null
                ? Number(empData.leavewages)
                : 0,
            leave: empData.leave != null ? Number(empData.leave) : 0,
            leavewages:
              empData.leavewages != null ? Number(empData.leavewages) : 0,
            
            workingdays:
              empData.workingdays != null ? Number(empData.workingdays) : 0,
            balance: empData.balance != null ? Number(empData.balance) : 0,
            roundoff: empData.roundoff != null ? Number(empData.roundoff) : 0,
            total:
              (emp.Salary != null ? Number(emp.Salary) : 0) +
              (empData.bonus != null ? Number(empData.bonus) : 0) +
              (empData.roundoff != null ? Number(empData.roundoff) : 0) -
              (empData.leavewages != null ? Number(empData.leavewages) : 0) -
              (empData.deduction != null ? Number(empData.deduction) : 0),
            branchName: emp.branchName || prev.branchName,
            mobile: emp.Mobile != null ? String(emp.Mobile) : prev.mobile,
            paymentmethod: "Cash",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch employee info:", err);
      
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.mobile, formData.branchName, formData.month, formData.year]);

 useEffect(() => {
  const total =
    (Number(formData.salary) || 0) +
    (Number(formData.overtime) || 0) +
    (Number(formData.roundoff) || 0) -
    (Number(formData.bonus) || 0) -
    (Number(formData.deduction) || 0);

  setFormData((prev) =>
    prev.total === total ? prev : { ...prev, total }
  );
}, [
  formData.salary,
  formData.overtime,
  formData.roundoff,
  formData.bonus,
  formData.deduction,
]);

  const clearEmployeeFields = () => {
    setFormData((prev) => ({
      ...prev,
      mobile: "",
      employeeId: "",
      staff_name: "",
      staff_role: "",
      designation: "",
      salary: 0,
      advance: 0,
      bonus: 0,
      leave: 0,
      leavewages: 0,
      cl: 0,
      workingdays: 0,
      balance: 0,
      total: 0,
      roundoff: 0,
      paymentmethod: "Cash",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "workingdays",
      "salary",
      "advance",
      "balance",
      "overtime",
      "bonus",
      "deduction",
      "total",
      "roundoff",
      "leave",
      "cl",
      "leavewages",
      "year",
    ];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.staff_name || !formData.mobile) {
      showToast("⚠️ Please provide staff name and mobile before submitting.", "error");
      return;
    }
    if (!formData.branchName) {
      showToast("⚠️ Please select a branch before adding payment.", "error");
      return;
    }
    const finalPayload = {
      employeeId: formData.employeeId,
      staff_name: formData.staff_name.trim(),
      staff_role: formData.staff_role.trim() || "Employee",
      date: formData.date || new Date().toISOString().split("T")[0],
      month:
        formData.month ||
        new Date().toLocaleString("default", { month: "long" }),
      year: Number(formData.year),
      mobile: formData.mobile,
      salary: Number(formData.salary || 0),
      advance: Number(formData.advance || 0),
      balance: Number(formData.balance || 0),
      overtime: Number(formData.overtime || 0),
      bonus: Number(formData.bonus || 0),
      deduction: Number(formData.deduction || 0),
      designation: formData.designation?.trim() || "",
      total: Number(formData.total || 0),
      roundoff: Number(formData.roundoff || 0),
      leave: Number(formData.leave || 0),
      cl: Number(formData.cl || 0),
      leavewages: Number(formData.leavewages || 0),
      paymentmethod: formData.paymentmethod || "Cash",
      status: formData.status || "Unpaid",
      branchName: formData.branchName,
      workingdays: Number(formData.workingdays || 0),
    };
    saveMutation.mutate(finalPayload, {
      onSuccess: () => {
        showToast("Payment added successfully!", "success");
        onClose();
      },
      onError: (err) => {
        console.error("Error saving payroll:", err);
        showToast("❌ Failed to add payment. No User found.", "error");
      },
    });
  };

  const inputStyle = `w-full h-[38px] rounded-[10px] border px-3 text-[14px] outline-none placeholder:text-[#9A9A9A]`;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 p-3 pt-0 pb-10"
    >
      <div
        className="w-full max-w-[550px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] rounded-3xl shadow-xl overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col px-5 py-3"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        {/* HEADER */}
        <div className="relative mb-5">
          <h2
            className="text-center text-[22px] font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Add Payment
          </h2>
          <MdClose
            size={28}
            onClick={onClose}
            className="absolute right-0 top-0 cursor-pointer"
            style={{ color: "var(--theme-primary-text)" }}
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { label: "Salary Date", key: "date", type: "date" },
              { label: "Balance", key: "balance", readOnly: true },
              { label: "Month", key: "month", type: "month" },
              { label: "Deduction", key: "deduction" },
              { label: "Year", key: "year" },
              { label: "Working Days", key: "workingdays" },
              { label: "Staff Name", key: "staff_name", readOnly: true },
              { label: "Leave Salary", key: "bonus" },
              { label: "Mobile Number", key: "mobile", type: "mobile" },
              { label: "Designation", key: "designation" },
              { label: "Salary", key: "salary", readOnly: true },
              { label: "Total", key: "total" },
              { label: "Advance", key: "advance", readOnly: true },
              { label: "Roundoff", key: "roundoff" },
              { label: "Status", key: "status", type: "select" },
              { label: "Overtime", key: "overtime" },
            ].map(({ label, key, readOnly, type }, i) => (
              <div key={i}>
                <label
                  className="mb-[2px] block text-[14px] font-medium"
                  style={{
                    color: "var(--theme-primary-text)",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                >
                  {label}
                </label>

                {type === "select" ? (
                  <select
                    name={key}
                    value={formData[key] ?? ""}
                    onChange={handleInputChange}
                    className={inputStyle}
                    style={{
                      borderColor: "var(--theme-secondary-card-bg)",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
                  >
                    <option value="">Select Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                ) : type === "month" ? (
                  <select
                    name={key}
                    value={formData[key] ?? ""}
                    onChange={handleInputChange}
                    className={inputStyle}
                    style={{
                      borderColor: "var(--theme-secondary-card-bg)",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
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
                ) : type === "date" ? (
                  <input
                    type="date"
                    name={key}
                    value={formData[key] ?? ""}
                    onChange={handleInputChange}
                    className={inputStyle}
                    style={{
                      borderColor: "var(--theme-secondary-card-bg)",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
                  />
                ) : type === "mobile" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter mobile number"
                      name={key}
                      value={formData[key] ?? ""}
                      onChange={handleInputChange}
                      className={`${inputStyle} flex-1`}
                      style={{
                        borderColor: "var(--theme-secondary-card-bg)",
                        background:
                          "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                        color: "var(--theme-primary-text)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={clearEmployeeFields}
                      className="h-[38px] min-w-[80px] rounded-[10px] px-4 text-[14px] font-semibold"
                      style={{
                        backgroundColor: "var(--theme-button-bg)",
                        color: "var(--theme-button-text)",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    name={key}
                    readOnly={readOnly || key === "total"}
                    value={formData[key] ?? ""}
                    onChange={handleInputChange}
                    placeholder={`Enter ${label}`}
                    className={inputStyle}
                    style={{
                      borderColor: "var(--theme-secondary-card-bg)",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              disabled={
                saveMutation.isLoading ||
                !(formData.staff_name && formData.mobile && formData.branchName)
              }
              className="h-[40px] min-w-[180px] rounded-[10px] px-8 text-[15px] font-semibold"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              {saveMutation.isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentPopup;
