import React, { useState } from "react";
import { useCylinders } from "../../../../hooks/useCylinder";
import { X } from "lucide-react";

const NewBookingPopup = ({ onClose, showToast }) => {
  const { addCylinder } = useCylinders(undefined, undefined, undefined, { showToast });

  const [form, setForm] = useState({
    bookingDate: "",
    receivedDate: "",
    installDate: "",
    emptyDate: "",
    capacity: "",
    quantity: "",
    amountPaid: "",
    usage: "",
    cylinderType: "",
    vendorName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.bookingDate ||
      !form.capacity ||
      !form.quantity ||
      !form.amountPaid
    ) {
      if (showToast) showToast("Please fill all required fields!", "error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        date: form.bookingDate,
        deliverydate: form.receivedDate,
        installeddate: form.installDate,
        emptydate: form.emptyDate,
        capacity: form.capacity,
        quantity: Number(form.quantity),
        amount: Number(form.amountPaid),
        usage: form.usage,
        cylinderType: form.cylinderType || "Commercial LPG",
        vendor: form.vendorName || "General Vendor",
      };

      await addCylinder.mutateAsync(payload);
      if (showToast) showToast("New cylinder booking added!", "success");
      onClose();
    } catch (err) {
      if (showToast) showToast("Failed to save booking.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Booking Date", name: "bookingDate", type: "date" },
    { label: "Received Date", name: "receivedDate", type: "date" },
    { label: "Install Date", name: "installDate", type: "date" },
    { label: "Empty Date", name: "emptyDate", type: "date" },
    {
      label: "Capacity (in Kg)",
      name: "capacity",
      type: "text",
      placeholder: "Kg",
    },
    { label: "Quantity", name: "quantity", type: "number", placeholder: "0" },
    {
      label: "Amount Paid",
      name: "amountPaid",
      type: "number",
      placeholder: "0",
    },
    { label: "Usage", name: "usage", type: "text", placeholder: "0" },
    {
      label: "Cylinder Type",
      name: "cylinderType",
      type: "text",
      placeholder: "Enter Type",
    },
    {
      label: "Vendor Name",
      name: "vendorName",
      type: "text",
      placeholder: "Enter Vendor name",
    },
  ];

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
          New Booking
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {fields.map(({ label, name, type, placeholder }) => (
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
                  className="w-full rounded-[10px] px-4 py-2.5 shadow-sm focus:outline-none appearance-none"
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
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBookingPopup;
