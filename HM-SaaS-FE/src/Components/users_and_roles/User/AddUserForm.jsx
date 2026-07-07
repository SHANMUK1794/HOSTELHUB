import { useState } from "react";
import { useUsersRoles } from "../../../hooks/useUsersRoles";

const AddUsersRoles = ({ onClose }) => {
  const [formData, setFormData] = useState({
    staffName: "",
    role: "",
    username: "",
    password: "",
  });

  const { addUserMutation } = useUsersRoles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.role === "Other Employees") {
        payload.username = "default";
        payload.password = "1234";
      }
      await addUserMutation.mutateAsync(payload);
      onClose();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const inputClass =
    "w-full border px-3 py-2 rounded-[10px] transition-colors duration-200";
  const inputStyle = {
    borderColor: "var(--theme-accent)",
    background: "linear-gradient(to right, #FFE5D1, var(--theme-card-bg))",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontSize: "var(--theme-font-small)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full px-6 pt-5 pb-5 space-y-3 rounded-xl"
      style={{
        backgroundColor: "var(--theme-card-bg)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      <h2
        className="text-[18px] font-bold text-center"
        style={{ color: "var(--theme-heading-text)" }}
      >
        Add User
      </h2>

      <button
        className="absolute top-2 right-4 text-2xl font-light hover:opacity-70 transition-opacity"
        style={{ color: "var(--theme-primary-text)" }}
        onClick={onClose}
      >
        &times;
      </button>

      {/* staffName */}
      <div className="flex flex-col items-center space-y-1">
        <label htmlFor="staffName" className="ml-1 w-full" style={labelStyle}>
          Name
        </label>
        <input
          id="staffName"
          type="text"
          value={formData.staffName}
          onChange={(e) =>
            setFormData({ ...formData, staffName: e.target.value })
          }
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* role */}
      <div className="flex flex-col items-center space-y-1">
        <label htmlFor="role" className="ml-1 w-full" style={labelStyle}>
          Role
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

      {formData.role !== "Other Employees" && (
        <>
          {/* username */}
          <div className="flex flex-col items-center space-y-1">
            <label
              htmlFor="username"
              className="ml-1 w-full"
              style={labelStyle}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* password */}
          <div className="flex flex-col items-center space-y-1">
            <label
              htmlFor="password"
              className="ml-1 w-full"
              style={labelStyle}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </>
      )}

      {/* Submit */}
      <div className="flex justify-center pt-1">
        <button
          type="submit"
          className="flex justify-center items-center py-5 px-20 w-[100px] h-[32px] rounded-lg shadow-sm text-[15px] font-medium hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddUsersRoles;
