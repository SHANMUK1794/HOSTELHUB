import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useUpdateEmployee } from "../../../hooks/useEmployee";
import { useUsersRoles } from "../../../hooks/useUsersRoles";
import { InputField, SelectField, SelectBranch } from "../FormHelpers";

const EditEmployee = ({ employee, onClose, refetch, showToast }) => {
  const allUsers = useSelector((state) => state.users.users) || [];
  const { addUserMutation, updateUserMutation: updateLoginMutation } =
    useUsersRoles();

  const existingUserRecord = useMemo(() => {
    return allUsers.find(
      (u) =>
        u.staffName === employee.Name &&
        String(u.phoneNo) === String(employee.Mobile),
    );
  }, [allUsers, employee]);

  const hasExistingAccess = !!existingUserRecord;
  const [enableLogin, setEnableLogin] = useState(hasExistingAccess);

  const [formData, setFormData] = useState({
    name: employee.Name || "",
    empNo: employee.EmpNo || "",
    branchName: employee.branchName || "",
    shift: employee.Shift || "",
    doj: employee.DOJ ? employee.DOJ.split("T")[0] : "",
    dob: employee.DOB ? employee.DOB.split("T")[0] : "",
    salary: employee.Salary || "",
    phone: employee.Mobile || "",
    designation: employee.Designation || "",
    role: existingUserRecord?.role || "",
    username: existingUserRecord?.username || "",
    password: "",
  });

  const shiftOptions = ["Morning", "Evening", "Night", "Full Time"];
  const roleOptions = ["Admin", "Warden", "Chef", "Staff"];

  const updateEmployeeMutation = useUpdateEmployee();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enableLogin) {
      if (!formData.role) return showToast("Please select a System Role.", "error");
      if (!formData.username) return showToast("Username is required.", "error");
      if (!hasExistingAccess && !formData.password) {
        return showToast("Password is required for new logins.", "error");
      }
    }

    try {
      const hrPayload = {
        Name: formData.name,
        EmpNo: formData.empNo,
        Mobile: formData.phone,
        branchName: formData.branchName,
        Shift: formData.shift,
        DOB: formData.dob,
        DOJ: formData.doj,
        Salary: formData.salary,
        Designation: formData.designation,
      };

      await updateEmployeeMutation.mutateAsync({
        id: employee._id,
        payload: hrPayload,
      });

      if (enableLogin) {
        const loginPayload = {
          staffName: formData.name,
          phoneNo: formData.phone,
          branchName: formData.branchName,
          shift: formData.shift,
          role: formData.role,
          username: formData.username,
          password: formData.password || undefined,
        };

        if (hasExistingAccess) {
          await updateLoginMutation.mutateAsync({
            _id: existingUserRecord._id,
            ...loginPayload,
          });
        } else {
          await addUserMutation.mutateAsync(loginPayload);
        }
      }

      showToast(
        enableLogin
          ? "Employee & Login Access Saved!"
          : "Employee HR Data Saved!",
        "success"
      );
      refetch();
      onClose();
    } catch (error) {
      showToast(error?.response?.data?.message || "Error saving data", "error");
      console.error(error);
    }
  };

  return (
    <div
      className="fixed top-[87px] bottom-0 left-0 right-0 flex justify-center items-center z-[9990] p-4 pt-0 pb-10"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="max-h-[calc(100vh-140px)] overflow-y-auto w-full max-w-[850px] shadow-lg rounded-3xl p-6 md:px-8 md:py-6 relative"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          fontFamily: "var(--theme-font-family-primary)",
          color: "var(--theme-primary-text)",
        }}
      >
        <button
          className="absolute top-4 right-6 text-3xl font-light hover:scale-110 transition-transform"
          style={{ color: "var(--theme-primary-text)" }}
          onClick={onClose}
        >
          &times;
        </button>

        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit}>
          {/* --- EMPLOYEE HR DETAILS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Employee no"
              name="empNo"
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
              value={formData.phone}
              onChange={handleInputChange}
            />
            <SelectField
              label="Shift"
              name="shift"
              value={formData.shift}
              onChange={handleInputChange}
              options={shiftOptions}
              placeholder="Select Shift"
              required
            />
            <InputField
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
            />
            <InputField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
            />
            <SelectBranch
              label="Branch"
              name="branchName"
              value={formData.branchName}
              onChange={handleInputChange}
            />
          </div>

          {/* --- SYSTEM LOGIN ACCESS SECTION --- */}
          <div
            className="mt-6 pt-6"
            style={{ borderTop: "1px solid var(--theme-secondary-card-bg)" }}
          >
            {/* Toggle Row */}
            <div
              className="flex items-center justify-between p-4 rounded-xl mb-4"
              style={{
                backgroundColor: "var(--theme-filter-bg)",
                border: "1px solid var(--theme-secondary-card-bg)",
              }}
            >
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  System Login Access
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  Allow this employee to log into the software.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enableLogin}
                  onChange={() => setEnableLogin(!enableLogin)}
                />
                <div
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{
                    backgroundColor: enableLogin
                      ? "var(--theme-accent)"
                      : "var(--theme-secondary-card-bg)",
                    borderColor: "var(--theme-secondary-card-bg)",
                  }}
                ></div>
              </label>
            </div>

            {/* Login Fields */}
            {enableLogin && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 p-5 rounded-xl"
                style={{
                  backgroundColor: "var(--theme-filter-bg)",
                  border: "1px solid var(--theme-secondary-card-bg)",
                }}
              >
                <SelectField
                  label="System Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  options={roleOptions}
                  placeholder="Select System Role"
                />
                <div className="hidden md:block"></div>
                <InputField
                  label="Username"
                  name="username"
                  placeholder="Enter login username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <InputField
                  label={
                    hasExistingAccess ? "New Password (Optional)" : "Password"
                  }
                  name="password"
                  type="password"
                  placeholder={
                    hasExistingAccess
                      ? "Leave blank to keep current"
                      : "Enter temporary password"
                  }
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex justify-center gap-10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-2 rounded-xl font-medium hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "var(--theme-filter-bg)",
                color: "var(--theme-primary-text)",
                boxShadow: "0px 4px 1px rgba(0,0,0,0.15)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                updateEmployeeMutation.isLoading || addUserMutation.isLoading
              }
              className="px-16 py-2 rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              {updateEmployeeMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
