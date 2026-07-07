import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendCustomMessage } from "../../store/slice/reminderSlice";

const ForwardToModal = ({ isOpen, onClose, onSend, showToast }) => {
  const dispatch = useDispatch();

  const message = useSelector((state) => state.reminder?.message || "");
  const sending = useSelector((state) => state.reminder?.messageSending);
  const sendErrorFromState = useSelector((state) => state.reminder?.error);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
    }
  }, [isOpen]);

  const availableBranches =
    useSelector((state) => state.branch.tenantBranches) || [];

  if (!isOpen) return null;

  const sections = [
    {
      title: "Everyone",
      items: [{ label: "All Hostel Inmates", type: "all" }],
    },
    {
      title: "All Inmates in",
      items: availableBranches.map((branchName) => ({
        label: branchName,
        type: "branch",
        branchName: branchName,
      })),
    },
    {
      title: "Staffs",
      items: [
        { label: "Warden", type: "staff", staffType: "warden" },
        { label: "Staffs", type: "staff", staffType: "employees" },
        { label: "Other Staffs", type: "staff", staffType: "chef" },
      ],
    },
  ];

  const handleSelect = (item) => {
    setSelected(item);
  };

  const handleSend = async () => {
    if (!message?.trim()) {
      showToast("Message is empty.", "error");
      return;
    }

    if (!selected) {
      showToast("Please select one option.", "error");
      return;
    }

    const payload = { type: selected.type, message };
    if (selected.branchName) payload.branchName = selected.branchName;
    if (selected.staffType) payload.staffType = selected.staffType;

    console.log("Sending Message Payload:", payload);

    try {
      const response = await dispatch(sendCustomMessage(payload)).unwrap();
      console.log("Message Send Success:", response);
      onClose?.();
      onSend?.();
    } catch (err) {
      console.error("Message Send Failed:", err);
      showToast(
        err?.message || sendErrorFromState || "Failed to send message.",
        "error"
      );
    }
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 pt-0 pb-10">
      <div
        className="w-[820px] rounded-[22px] px-12 py-8 relative shadow-lg max-[768px]:w-[95%] max-[768px]:px-6 max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          disabled={sending}
          className="absolute top-5 right-6 text-[34px] font-light leading-none transition-opacity hover:opacity-70"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ×
        </button>

        {/* TITLE */}
        <h2
          className="text-[24px] font-semibold mb-8"
          style={{
            color: "var(--theme-primary-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Forward to...
        </h2>

        {/* SECTIONS */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3
                className="text-[16px] font-medium mb-4"
                style={{
                  color: "var(--theme-muted-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                {section.title}
              </h3>

              <div className="space-y-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <p
                      className="text-[18px] font-semibold"
                      style={{
                        color: "var(--theme-primary-text)",
                        fontFamily: "var(--theme-font-family-primary)",
                      }}
                    >
                      {item.label}
                    </p>

                    <button
                      onClick={() => handleSelect(item)}
                      className="w-[28px] h-[28px] border-2 rounded-[3px] flex items-center justify-center transition-all"
                      style={{
                        backgroundColor:
                          selected?.label === item.label
                            ? "var(--theme-button-bg)"
                            : "transparent",
                        borderColor: "var(--theme-accent)",
                      }}
                    >
                      {selected?.label === item.label && (
                        <span
                          className="text-sm"
                          style={{ color: "var(--theme-button-text)" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEND */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSend}
            disabled={sending}
            className="text-[20px] font-medium px-8 py-3 rounded-[14px] shadow-md disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardToModal;
