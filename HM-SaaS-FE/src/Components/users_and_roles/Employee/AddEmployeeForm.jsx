import React, { useState } from "react";
import { useCreateEmployee } from "../../../hooks/useEmployee";
import { InputField, SelectField } from "../FormHelpers";

const AddEmployeeForm = ({ onClose, branchName, refetch, showToast }) => {
  const [formData, setFormData] = useState({
    name: "",
    empNo: "",
    shift: "",
    doj: "",
    dob: "",
    salary: "",
    phone: "",
    designation: "",
  });

  const shiftOptions = [
    { value: "Morning", label: "Morning" },
    { value: "Evening", label: "Evening" },
    { value: "Night", label: "Night" },
  ];

  const createEmployeeMutation = useCreateEmployee();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!branchName) return showToast("Select a branch first", "error");
      await createEmployeeMutation.mutateAsync({
        branchName,
        Name: formData.name,
        EmpNo: formData.empNo,
        Shift: formData.shift,
        DOJ: formData.doj,
        DOB: formData.dob,
        Salary: formData.salary,
        Mobile: formData.phone,
        Designation: formData.designation,
      });
      showToast("Employee added!", "success");
      refetch();
      onClose();
    } catch (error) {
      showToast(error?.response?.data?.message || "Error adding employee", "error");
      console.error(error);
    }
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-10 z-[9990] p-4">
      <div
        className="max-h-[95vh] overflow-y-auto w-full max-w-[850px] shadow-lg rounded-3xl p-8 relative font-montserrat transition-colors duration-300"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          color: "var(--theme-primary-text)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        <button
          className="absolute top-4 right-6 text-3xl font-light hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-primary-text)" }}
          onClick={onClose}
        >
          &times;
        </button>

        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Add User
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <InputField
              label="Name"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Employee no"
              name="empNo"
              placeholder="Enter employee number"
              value={formData.empNo}
              onChange={handleInputChange}
            />
            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <InputField
              label="Joining Date"
              name="doj"
              type="date"
              value={formData.doj}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone No"
              name="phone"
              type="number"
              placeholder="Enter Phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <SelectField
              label="Shift"
              name="shift"
              value={formData.shift}
              onChange={handleInputChange}
              options={shiftOptions}
              required
            />
            <InputField
              label="Salary"
              name="salary"
              type="number"
              placeholder="Enter Salary"
              value={formData.salary}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Designation"
              name="designation"
              placeholder="Enter designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-10 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-3 rounded-xl font-[500] shadow-[0px_4px_1px_rgba(0,0,0,0.15)] hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "var(--theme-secondary-button-bg)",
                color: "var(--theme-secondary-button-text)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEmployeeMutation.isLoading}
              className="px-16 py-3 rounded-xl font-[500] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              {createEmployeeMutation.isLoading ? "Processing..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
