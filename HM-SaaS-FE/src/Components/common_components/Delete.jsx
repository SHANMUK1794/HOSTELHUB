import React from "react";
import { X } from "lucide-react";

const Delete = ({ setIsOpenDelete, deleteData, selectedId, refetch }) => {
  const handleDelete = async () => {
    try {
      await deleteData(selectedId);
      if (typeof refetch === "function") {
        refetch();
      }
      setIsOpenDelete(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] font-['Montserrat']">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div
        className="relative w-full max-w-sm md:w-[400px] rounded-[24px] shadow-lg p-8 flex flex-col items-center"
        style={{ background: "var(--theme-card-bg)" }}
      >
        <button
          onClick={() => setIsOpenDelete(false)}
          className="absolute right-6 top-6 hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--theme-secondary-card-bg)" }}
        >
          <img
            src={"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16'/></svg>"}
            alt="delete"
          />
        </div>

        <h1
          className="font-bold text-xl mb-2"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Delete Item
        </h1>

        <p
          className="font-[500] text-center text-[15px] mb-8 px-4 leading-relaxed"
          style={{ color: "var(--theme-accent)" }}
        >
          Are you sure you want to Delete
          <br />
          this item?
        </p>

        <div className="flex gap-5 w-full justify-center">
          <button
            onClick={() => setIsOpenDelete(false)}
            className="w-[100px] h-[36px] rounded-[12px] text-[14px] font-[500] transition-all flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:opacity-80"
            style={{
              background: "var(--theme-secondary-button-bg)",
              color: "var(--theme-primary-text)",
              border: "1px solid #e5e7eb",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="w-[100px] h-[36px] rounded-[12px] text-[14px] font-[500] transition-all flex items-center justify-center hover:opacity-90"
            style={{
              background: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--theme-accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--theme-button-bg)")
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
