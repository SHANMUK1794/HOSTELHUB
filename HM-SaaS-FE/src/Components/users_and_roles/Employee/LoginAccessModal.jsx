import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { InputField } from "../FormHelpers";
import { useUsersRoles } from "../../../hooks/useUsersRoles";

const LoginAccessModal = ({ onClose, employee, showToast }) => {
  const allUsers = useSelector((state) => state.users.users) || [];
  const { addUserMutation, updateUserMutation } = useUsersRoles();

  const existingUserRecord = useMemo(() => {
    return allUsers.find(
      (u) =>
        u.staffName === employee.Name &&
        String(u.phoneNo) === String(employee.Mobile),
    );
  }, [allUsers, employee]);

  const [formData, setFormData] = useState({
    username: existingUserRecord?.username || "",
    password: "",
    role: existingUserRecord?.role || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginPayload = {
        staffName: employee.Name || employee.staffName,
        phoneNo: String(employee.Mobile || employee.phoneNo || ""),
        shift: String(employee.Shift || employee.shift || ""),
        username: formData.username,
        password: formData.password,
        role: formData.role,
        branchName: employee.branchName,
      };

      if (existingUserRecord) {
        await updateUserMutation.mutateAsync({
          ...loginPayload,
          _id: existingUserRecord._id,
        });
      } else {
        await addUserMutation.mutateAsync(loginPayload);
      }

      showToast("Login access granted!", "success");
      onClose();
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to create login access", "error"
      );
    }
  };

  return (
    <div
      className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md z-[200] flex justify-center items-start pt-10 p-4"
    >
      <div
        className="w-full max-w-[420px] shadow-2xl rounded-3xl p-8 relative"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-6 text-3xl font-light hover:scale-110 transition-transform"
          style={{ color: "var(--theme-primary-text)" }}
          onClick={onClose}
        >
          &times;
        </button>

        {/* Title */}
        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Login Access
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="User Name"
            name="username"
            placeholder="Enter Name"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Role"
            name="role"
            placeholder="Enter Role"
            value={formData.role}
            onChange={handleInputChange}
            required
          />

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 rounded-xl font-medium hover:opacity-80 transition-opacity"
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
              className="px-10 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAccessModal;
