import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ViewRoomModal = ({ room, onClose }) => {

  
  const residents = room.pgUsers || room.users || [];


  return (
    <div
      className="rounded-[30px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
      {/* Header */}
      <div className="p-8 pb-4 flex justify-between items-center">
        <h2
          className="text-3xl font-bold"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Room No: {room.RoomNo}
        </h2>

        <div className="flex gap-8 items-center pr-12">
          <span
            className="font-medium"
            style={{
              color: "var(--theme-primary-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Type: {room.RoomType}
          </span>
          <span
            className="font-medium"
            style={{
              color: "var(--theme-primary-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Occupied: {room.Occupied || 0}/{room.Capacity}
          </span>
        </div>

        <button
          onClick={onClose}
          className="absolute right-6 top-6 hover:scale-110 transition-transform"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <XMarkIcon className="h-8 w-8 stroke-2" />
        </button>
      </div>

      {/* Grid */}
      <div className="p-8 pt-0 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {residents.length > 0 ? (
            residents.map((person, index) => (
              <ResidentCard key={index} person={person} />
            ))
          ) : (
            <div
              className="col-span-full py-20 text-center font-medium"
              style={{ color: "var(--theme-muted-text)" }}
            >
              No occupants currently in this room.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--theme-secondary-card-bg);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

const ResidentCard = ({ person }) => (
  <div
    className="rounded-[25px] p-5 flex flex-col items-center text-center shadow-sm"
    style={{
      backgroundColor: "var(--theme-filter-bg)",
      border: "1px solid var(--theme-secondary-card-bg)",
      fontFamily: "var(--theme-font-family-secondary)",
    }}
  >
    <h3
      className="text-xl font-bold mb-3"
      style={{
        color: "var(--theme-heading-text)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      {person.Name || person.name || "N/A"}
    </h3>

    <div className="space-y-1 mb-4 text-[13px]">
      <p className="font-bold" style={{ color: "var(--theme-primary-text)" }}>
        Phone No:{" "}
        <span className="font-medium">
          {person.MobileNo || person.phoneNumber || "N/A"}
        </span>
      </p>
      <p className="font-bold" style={{ color: "var(--theme-primary-text)" }}>
        Aadhar No:{" "}
        <span className="font-medium">{person.AddharNumber || "N/A"}</span>
      </p>
    </div>

    <h4
      className="text-sm font-bold mb-1"
      style={{ color: "var(--theme-heading-text)" }}
    >
      Address
    </h4>
    <p
      className="text-[12px] leading-tight px-2"
      style={{ color: "var(--theme-primary-text)" }}
    >
      {person.PermanentAddress ||
        person.address ||
        "123 Maple Street, Anytown, CA 91234"}
    </p>
  </div>
);

export default ViewRoomModal;
