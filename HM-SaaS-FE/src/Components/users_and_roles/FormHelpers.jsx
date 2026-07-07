import React from "react";
import { useSelector } from "react-redux";

export const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) => (
  /* 🌙 ADDED: text-gray-700 dark:text-gray-200 */
  <label className="flex flex-col text-md text-gray-700 dark:text-gray-200">
    {label}
    {/* 🌙 ADDED: dark:from-gray-800 dark:to-gray-900 text-black dark:text-white */}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border-[#EA6A12] border px-3 py-2 rounded-[10px] bg-gradient-to-r from-[#FFE5D1] to-white dark:from-gray-800 dark:to-gray-900 text-black dark:text-white transition-colors duration-200"
      style={{
        background:
          "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
        borderColor: "var(--theme-secondary-card-bg)",
        color: "var(--theme-primary-text)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    />
  </label>
);

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
}) => (
  /* 🌙 ADDED: text-gray-700 dark:text-gray-200 */
  <label className="flex flex-col text-md text-gray-700 dark:text-gray-200">
    {label}
    {/* 🌙 ADDED: dark:from-gray-800 dark:to-gray-900 text-black dark:text-white */}
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border-[#EA6A12] border px-3 py-2 rounded-[10px] bg-gradient-to-r from-[#FFE5D1] to-white dark:from-gray-800 dark:to-gray-900 text-black dark:text-white cursor-pointer transition-colors duration-200"
      style={{
        background:
          "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
        borderColor: "var(--theme-secondary-card-bg)",
        color: "var(--theme-primary-text)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      <option
        value=""
        className="text-black dark:text-white bg-white dark:bg-gray-800"
      >
        {placeholder}
      </option>
      {options.map((opt, index) => {
        // 🛠️ THE WHITE SCREEN FIX: Check if option is an object or a string
        const isObject = typeof opt === "object" && opt !== null;
        const optionValue = isObject ? opt.value : opt;
        const optionLabel = isObject ? opt.label : opt;

        return (
          <option
            key={isObject ? opt.value : `${opt}-${index}`}
            value={optionValue}
            className="text-black dark:text-white bg-white dark:bg-gray-800"
          >
            {optionLabel}
          </option>
        );
      })}
    </select>
  </label>
);

export const SelectBranch = ({ label, name, value, onChange }) => {
  const tenantBranches = useSelector((state) => state.branch?.tenantBranches) || [];

  // Ensure the current value is always an option, even if it's not in tenantBranches
  const options = [...tenantBranches];
  if (value && !options.includes(value)) {
    options.push(value);
  }

  return (
    <label className="flex flex-col text-sm font-bold text-gray-700 dark:text-gray-200">
      {label}
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border-[#EA6A12] border px-3 py-2 rounded-[10px] bg-gradient-to-r from-[#FFE5D1] to-white dark:from-gray-800 dark:to-gray-900 text-black dark:text-white cursor-pointer transition-colors duration-200"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
          borderColor: "var(--theme-secondary-card-bg)",
          color: "var(--theme-primary-text)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        <option
          value=""
          className="text-black dark:text-white bg-white dark:bg-gray-800"
        >
          Select Branch
        </option>
        {options.map((branch, index) => (
          <option
            key={index}
            value={branch}
            className="text-black dark:text-white bg-white dark:bg-gray-800"
          >
            {branch}
          </option>
        ))}
      </select>
    </label>
  );
};
