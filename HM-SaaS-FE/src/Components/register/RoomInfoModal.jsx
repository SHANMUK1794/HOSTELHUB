import { useSelector } from "react-redux";

const RoomInfoModal = ({ setIsOpenRoomInfo, selectedStudentId }) => {
  const rooms = useSelector((state) => state.rooms.rooms) || [];
  const allStudents = useSelector((state) => state.register.registration) || [];

  const student = allStudents.find((s) => s._id === selectedStudentId);
  const selectedRoom = rooms.find(
    (room) =>
      room?.RoomNo?.trim()?.toLowerCase() ===
      student?.RoomNo?.trim()?.toLowerCase(),
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const labelStyle = {
    color: "var(--theme-heading-text)",
    fontWeight: 600,
    width: 150,
  };
  const colonStyle = { color: "var(--theme-heading-text)", marginRight: 12 };
  const valueStyle = { color: "var(--theme-primary-text)" };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 px-3"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <div
        className="rounded-2xl shadow-xl w-full max-w-[600px] relative px-8 py-7 max-[768px]:px-5 max-[768px]:py-5 max-[480px]:px-4"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Close */}
        <button
          onClick={() => setIsOpenRoomInfo(false)}
          className="absolute right-5 top-3 text-[30px] font-bold"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-row items-center justify-center mb-8">
          <div
            className="h-[58px] w-[58px] rounded-full flex items-center justify-center"
            // style={{ backgroundColor: "var(--theme-button-bg)" }}
          >
            <img
              src={"https://asset.techjose.com/Hostelos/employeemodelimg.png"}
              alt="profile"
              className="w-full object-contain"
            />
          </div>
          <h2
            className="text-[34px] font-bold mt-2 ml-5"
            style={{ color: "var(--theme-primary-text)" }}
          >
            {student?.Name || "N/A"}
          </h2>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-5 max-[768px]:grid-cols-1 max-[768px]:gap-y-4">
          {/* LEFT */}
          <div className="space-y-4">
            {[
              { label: "Mob no", value: student?.MobileNo },
              { label: "Aadhaar no", value: student?.AddharNumber },
              {
                label: "Profession",
                value: student?.Profession || student?.occupation || "Student",
              },
              { label: "Rent", value: `₹${selectedRoom?.Rate || "0"}` },
              {
                label: "Payment Mode",
                value: student?.PaymentMode || "Online",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-[140px_20px_1fr] items-center"
              >
                <p style={labelStyle}>{label}</p>
                <span style={colonStyle}>:</span>
                <p style={valueStyle}>{value || "N/A"}</p>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {[
              {
                label: "Date of Joining",
                value: formatDate(
                  student?.DateOfJoining ||
                    student?.JoiningDate ||
                    student?.createdAt,
                ),
              },
              {
                label: "Date of Leaving",
                value: formatDate(student?.vacatedate),
              },
              { label: "Room NO", value: student?.RoomNo },
              {
                label: "Bill NO",
                value: student?.BillNo || student?._id?.slice(-6),
              },
              {
                label: "Discount",
                value: student?.DiscountAmt || student?.Discount || "0",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-[140px_20px_1fr] items-center"
              >
                <p style={labelStyle}>{label}</p>
                <span style={colonStyle}>:</span>
                <p style={valueStyle}>{value || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInfoModal;
