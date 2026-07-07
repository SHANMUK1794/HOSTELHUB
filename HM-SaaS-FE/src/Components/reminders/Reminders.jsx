import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetBirthdays } from "../../hooks/useGetBirthdays";
import { setBirthdays } from "../../store/slice/BirthdaySlice";
import LottieLoader from "../../Components/common_components/LottieLoader";
import BirthdayCard from "./BirthdayCard";
import CustomMessageModal from "./CustomMessageModal";
import ForwardToModal from "./ForwardToModal";
import ToastMessage from "../common_components/ToastMessage";

const Reminders = () => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);

  const dispatch = useDispatch();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  const branchName =
    role === "Admin"
      ? selectedBranch
      : role === "Warden"
        ? user?.branchName
        : null;

  const birthdays = useSelector((state) => state.birthday.birthdays);

  const { data, isLoading, isError, refetch } = useGetBirthdays(
    role,
    branchName,
  );

  useEffect(() => {
    if (data && (data.data || data.weekList)) {
      const todayList = Array.isArray(data.data) ? data.data : [];
      const weekList = Array.isArray(data.weekList) ? data.weekList : [];

      const allBirthdays = [...todayList, ...weekList]
        .filter((item) =>
          role === "Admin"
            ? item.branchName === branchName
            : item.branchName === user?.branchName,
        )
        .map((item) => {
          const formattedDOB = item.DateOfBirth
            ? new Date(item.DateOfBirth).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })
            : "-";
          return {
            name: item.Name || "Unknown",
            room: item.RoomNo || "-",
            year: formattedDOB,
            dateLabel: item.weekday || "-",
            days: item.inDays || "",
            isToday:
              item.inDays === "Today" || item.inDays === "Today!" || false,
            branchName: item.branchName,
            role: item.role,
          };
        });

      dispatch(setBirthdays(allBirthdays));
    } else {
      dispatch(setBirthdays([]));
    }
  }, [data, dispatch, branchName, role, user?.branchName]);

  useEffect(() => {
    if (branchName && role) refetch();
  }, [branchName, role, refetch]);

  const [toastConfig, setToastConfig] = useState({ show: false, text: "", success: false, failed: false });

  const showToast = (text, type) => {
    setToastConfig({ show: true, text, success: type === "success", failed: type === "error" });
    setTimeout(() => {
      setToastConfig({ show: false, text: "", success: false, failed: false });
    }, 3000);
  };

  const closeToast = () => {
    setToastConfig({ show: false, text: "", success: false, failed: false });
  };

  const handleSendCustomMessage = () => {
    setShowCustomModal(false);
    setShowForwardModal(true);
  };

  const handleForwardSend = () => {
    setShowForwardModal(false);
    showToast("Your message is Successfully Sent..!!", "success");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LottieLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center justify-center h-full font-semibold"
        style={{ color: "#ef4444" }}
      >
        Failed to load birthdays.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-5"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {/* HEADER */}
      <div
        className="mt-6 flex justify-between items-center mb-10
          max-[426px]:flex-col max-[426px]:items-start max-[426px]:gap-4"
      >
        <h1
          className="text-[32px] font-bold max-[769px]:text-[26px] max-[426px]:text-[22px]"
          style={{
            color: "var(--theme-accent)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Birthday Reminders
        </h1>

        <button
          onClick={() => setShowCustomModal(true)}
          className="px-5 py-2 rounded-lg text-[16px] font-semibold flex items-center gap-2 shadow-md
            transition-all duration-300 hover:scale-[1.02]
            max-[426px]:text-[12px] max-[426px]:px-3 max-[426px]:py-2"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          <img
            src="https://asset.techjose.com/Hostelos/remindersimages/plusicon.png"
            alt="plus"
            className="w-[20px] h-[20px] object-contain"
          />
          Add Custom Message
        </button>
      </div>

      {/* EMPTY */}
      {(!birthdays || birthdays.length === 0) && (
        <div
          className="flex justify-center items-center h-[50vh] text-lg font-medium"
          style={{ color: "var(--theme-muted-text)" }}
        >
          🎂 No upcoming birthdays found.
        </div>
      )}

      {/* CARDS */}
      <div className="flex flex-wrap gap-5 items-center max-[426px]:justify-center">
        {birthdays.map((b, i) => (
          <BirthdayCard
            key={i}
            index={i}
            name={b.name}
            room={b.room}
            year={b.year}
            dateLabel={b.dateLabel}
            days={b.days}
            role={b.role}
          />
        ))}
      </div>

      {/* MODALS */}
      <CustomMessageModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSend={handleSendCustomMessage}
      />

      <ForwardToModal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        onSend={handleForwardSend}
        showToast={showToast}
      />

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default Reminders;
