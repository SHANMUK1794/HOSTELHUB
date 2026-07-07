import React, { useState, useEffect } from "react";
import { useCylinders } from "../../../../hooks/useCylinder";
import { X } from "lucide-react";

const EditBookingPopup = ({ onClose, bookingData, showToast }) => {
  const { updateCylinder } = useCylinders(undefined, undefined, undefined, { showToast });

  const [form, setForm] = useState({
    bookingDate: bookingData?.date
      ? new Date(bookingData.date).toISOString().split("T")[0]
      : "",
    receivedDate: bookingData?.deliverydate
      ? new Date(bookingData.deliverydate).toISOString().split("T")[0]
      : "",
    installDate: bookingData?.installeddate
      ? new Date(bookingData.installeddate).toISOString().split("T")[0]
      : "",
    emptyDate: bookingData?.emptydate
      ? new Date(bookingData.emptydate).toISOString().split("T")[0]
      : "",
    capacity: bookingData?.capacity || "",
    quantity: bookingData?.quantity || "",
    amountPaid: bookingData?.amount || "",
    usage: bookingData?.usage || "",
    cylinderType: bookingData?.cylinderType || "",
    vendor: bookingData?.vendor || "",
  });

  const [loading, setLoading] = useState(false);

  // Auto-calculate usage if dates change
  useEffect(() => {
    if (form.installDate && form.emptyDate) {
      const install = new Date(form.installDate);
      const empty = new Date(form.emptyDate);
      const diffTime = empty - install;
      if (diffTime >= 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setForm((prev) => ({ ...prev, usage: diffDays }));
      } else {
        setForm((prev) => ({ ...prev, usage: "" }));
      }
    }
  }, [form.installDate, form.emptyDate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = bookingData?._id || bookingData?.id;
      const updatedData = {
        date: form.bookingDate,
        deliverydate: form.receivedDate,
        installeddate: form.installDate,
        emptydate: form.emptyDate,
        capacity: form.capacity,
        quantity: form.quantity,
        amount: form.amountPaid,
        usage: form.usage,
        cylinderType: form.cylinderType,
        vendor: form.vendor,
      };
      await updateCylinder.mutateAsync({ id, updatedData });
      if (showToast) showToast("Booking updated successfully!", "success");
      onClose();
    } catch (error) {
      if (showToast) showToast("Failed to update booking", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pt-0 pb-10">
      <div
        className="w-full max-w-2xl rounded-[24px] shadow-2xl p-6 md:px-8 md:py-6 relative max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 transition-colors"
          style={{ color: "var(--theme-primary-text)" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseOut={(e) =>
            (e.currentTarget.style.color = "var(--theme-primary-text)")
          }
        >
          <X size={28} />
        </button>

        <h2
          className="text-center text-2xl mb-4 font-bold"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Edit Booking
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {[
              { label: "Booking Date", name: "bookingDate", type: "date" },
              { label: "Received Date", name: "receivedDate", type: "date" },
              { label: "Install Date", name: "installDate", type: "date" },
              { label: "Empty Date", name: "emptyDate", type: "date" },
              {
                label: "Capacity (Kg)",
                name: "capacity",
                type: "text",
                placeholder: "Kg",
              },
              { label: "Quantity", name: "quantity", type: "number" },
              { label: "Amount Paid", name: "amountPaid", type: "number" },
              {
                label: "Cylinder Type",
                name: "cylinderType",
                type: "text",
                placeholder: "Type",
              },
              {
                label: "Vendor",
                name: "vendor",
                type: "text",
                placeholder: "Vendor name",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label
                  className="text-sm font-medium block mb-1.5"
                  style={{
                    color: "var(--theme-heading-text)",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-[10px] px-4 py-2.5 shadow-sm focus:outline-none"
                  style={{
                    border: "1px solid var(--theme-secondary-card-bg)",
                    background:
                      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                    color: "var(--theme-primary-text)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--theme-accent)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--theme-secondary-card-bg)")
                  }
                />
              </div>
            ))}

            {/* Usage — read-only */}
            <div>
              <label
                className="text-sm font-medium block mb-1.5"
                style={{
                  color: "var(--theme-heading-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                Usage
              </label>
              <input
                type="text"
                name="usage"
                value={form.usage}
                readOnly
                className="w-full rounded-[10px] px-4 py-2.5 shadow-sm cursor-not-allowed"
                style={{
                  border: "1px solid #e5e7eb",
                  backgroundColor: "var(--theme-app-bg)",
                  color: "var(--theme-muted-text)",
                }}
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-2.5 rounded-[12px] font-semibold transition-colors min-w-[140px]"
              style={{
                backgroundColor: "var(--theme-secondary-button-bg)",
                color: "var(--theme-secondary-button-text)",
                border: "1px solid var(--theme-secondary-card-bg)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-2.5 rounded-[12px] font-semibold transition-colors min-w-[140px] shadow-md"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--theme-accent-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--theme-button-bg)")
              }
            >
              {loading ? "Updating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingPopup;
