import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import AddRoomForm from "./AddRoomForm";

const RoomFilters = ({ onAddRoom, onFilterChange }) => {
  const [status, setStatus] = useState(""); // Status filter
  const [type, setType] = useState(""); // Type filter
  const [showModal, setShowModal] = useState(false); // Modal toggle

  const statusOptions = [
    { label: "All", value: "All", color: "blue" },
    { label: "Full", value: "Full", color: "green" },
    { label: "Partial", value: "Partial", color: "yellow" },
    { label: "Vacant", value: "Vacant", color: "red" },
  ];

  const typeOptions = [
    { label: "All", value: "All",color: "blue" },
    { label: "AC", value: "AC",color:"blue" },
    { label: "Non-AC", value: "Non-AC",color:"blue" },
  ];

  const colorClasses = {
    blue:"text-[#302D7F]",
    green: "text-green",
    yellow: "text-liteGreen",
    red: "text-red",
  };

  // Call parent on status change
  const handleStatusChange = (value) => {
    setStatus(value);
    onFilterChange({ status: value, type });
  };

  // Call parent on type change
  const handleTypeChange = (value) => {
    setType(value);
    onFilterChange({ status, type: value });
  };

  // Dropdown component
  const Dropdown = ({ options, placeholder, selectedValue, onSelect }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === selectedValue);
    // When selected, always show white text; only show colors in dropdown list
    const textColor = selectedValue ? "text-white" : "";

    return (
      <div ref={ref} className="relative w-full sm:w-[140px]">
        <div
          onClick={() => setOpen(!open)}
          className="bg-secondaryLiteBg gap-3 rounded-lg px-1 py-1 h-[34px] w-[100px] flex items-center justify-center text-[13px] text-white cursor-pointer"
        >
          <span className={`truncate ${textColor}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-white" />
        </div>

        {open && (
          <ul className="absolute mt-1 w-full max-h-40 overflow-auto z-50 p-0">
            {options.map(({ label, value, color }) => (
              <li
                key={value}
                onClick={() => {
                  onSelect(value);
                  setOpen(false);
                }}
                className={`px-4 py-2 bg-[#fff] text-center text-[13px] cursor-pointer ${colorClasses[color] || ""
                  }`}
              >
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Filter bar */}
      <div className="flex justify-between items-center gap-3 w-full  text-[13px] mb-5 mt-5">
        <div className="flex items-center gap-5">
          <Dropdown
            options={typeOptions}
            placeholder="Type"
            selectedValue={type}
            onSelect={handleTypeChange}
          />
          <Dropdown
            options={statusOptions}
            placeholder="Status"
            selectedValue={status}
            onSelect={handleStatusChange}
          />
        </div>

        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-secondaryLiteBg text-white px-4 py-2 sm:py-1.5 rounded-lg text-sm w-full sm:w-auto"
          >
            + Add Room
          </button>
        </div>

      </div>

      {/* Add Room Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-modalBg flex justify-center items-center z-50 p-4"
          onClick={() => setShowModal(false)} // to close the modal
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <AddRoomForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default RoomFilters;
