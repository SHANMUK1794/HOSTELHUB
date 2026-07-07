import { useState } from "react";

const EditUser = ({ selectedUser, onUpdate, onClose, showToast }) => {
  const [formData, setFormData] = useState(() => ({
    _id: selectedUser._id,
    staffName: selectedUser.staffName || "",
    role: selectedUser.role || "",
    shift: selectedUser.shift || "",
    username: selectedUser.username || "",
    phoneNo: selectedUser.phoneNo || "",
    password: selectedUser.password || "",
    branchName: "IOB Mens Hostel",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNo") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, phoneNo: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = String(formData.phoneNo || "").trim();
    if (!/^\d{10}$/.test(phone)) {
      showToast("Phone number must be exactly 10 digits.", "error");
      return;
    }
    if (
      formData.role !== "Other Employees" &&
      !String(formData.password || "").trim()
    ) {
      showToast("Password cannot be empty. Please enter a new password.", "error");
      return;
    }
    onUpdate(formData);
  };

  const inputClass =
    "w-full border px-3 py-2 rounded-[10px] transition-colors duration-200";
  const inputStyle = {
    borderColor: "var(--theme-secondary-card-bg)",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontSize: "var(--theme-font-small)",
    fontWeight: "bold",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full px-6 pt-5 pb-5 rounded-xl space-y-3"
      style={{
        backgroundColor: "var(--theme-card-bg)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      <h2
        className="text-[18px] text-center font-bold"
        style={{ color: "var(--theme-heading-text)" }}
      >
        Edit User
      </h2>

      <button
        className="absolute top-2 right-4 text-2xl font-light hover:opacity-70 transition-opacity"
        style={{ color: "var(--theme-primary-text)" }}
        onClick={onClose}
      >
        &times;
      </button>

      {/* Name */}
      <div className="flex flex-col items-center space-y-1">
        <label htmlFor="staffName" className="ml-1 w-full" style={labelStyle}>
          Name
        </label>
        <input
          id="staffName"
          name="staffName"
          type="text"
          value={formData.staffName}
          onChange={handleChange}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Role */}
      <div className="flex flex-col items-center space-y-1">
        <label htmlFor="role" className="ml-1 w-full" style={labelStyle}>
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={inputClass}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Warden">Warden</option>
          <option value="Chef">Chef</option>
          <option value="Staff">Staff</option>
          <option value="Other Employees">Other Employees</option>
        </select>
      </div>

      {/* Shift */}
      <div className="flex flex-col items-center space-y-1">
        <label htmlFor="shift" className="ml-1 w-full" style={labelStyle}>
          Shift
        </label>
        <select
          id="shift"
          name="shift"
          value={formData.shift}
          onChange={handleChange}
          className={inputClass}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
      </div>

      {/* Username */}
      {formData.role !== "Other Employees" && (
        <div className="flex flex-col items-center space-y-1">
          <label htmlFor="username" className="ml-1 w-full" style={labelStyle}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      )}

      {/* Phone No */}
      <div className="flex flex-col items-center space-y-1">
        <label htmlFor="phoneNo" className="ml-1 w-full" style={labelStyle}>
          Phone No
        </label>
        <input
          id="phoneNo"
          name="phoneNo"
          type="tel"
          value={formData.phoneNo}
          onChange={handleChange}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Password */}
      {formData.role !== "Other Employees" && (
        <div className="flex flex-col items-center space-y-1">
          <label htmlFor="password" className="ml-1 w-full" style={labelStyle}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New password"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-center pt-1">
        <button
          type="submit"
          className="flex justify-center items-center px-16 w-[100px] h-[35px] font-bold rounded-lg shadow-sm text-[15px] hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-secondary)",
          }}
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default EditUser;
