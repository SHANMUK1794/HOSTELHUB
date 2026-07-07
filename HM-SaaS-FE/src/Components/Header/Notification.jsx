import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNotifications } from "../../hooks/useNotification";
import LottieLoader from "../../Components/common_components/LottieLoader";
import { useNavigate } from "react-router-dom";

const NOTIFICATION_ICONS = {
  birthday:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8'/><path d='M4 16h16'/><path d='M10 9V5a2 2 0 0 1 4 0v4'/><circle cx='12' cy='3' r='1'/></svg>",
  complaint:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><rect x='8' y='2' width='8' height='4' rx='1' ry='1'/><path d='M9 14h6'/><path d='M9 18h6'/><path d='M9 10h3'/></svg>",
  certificate:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='M12 8v4'/><path d='M12 16h.01'/></svg>",
  default:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><rect x='8' y='2' width='8' height='4' rx='1' ry='1'/><path d='M9 14h6'/><path d='M9 18h6'/><path d='M9 10h3'/></svg>",
};

const Notification = () => {
  const navigate = useNavigate();

  const role = useSelector(
    (state) => state?.auth?.user?.role
  );

  const {
    data: notifications = [],
    isLoading,
    error,
    markSingleSeen,
    markAllSeen,
  } = useNotifications();

  const [seenIds, setSeenIds] = useState([]);

  useEffect(() => {
    if (!Array.isArray(notifications)) return;

    const initiallySeen = notifications
      .filter((note) =>
        role === "Admin"
          ? note?.adminSeen
          : note?.wardenSeen
      )
      .map((note) => note._id);

    setSeenIds(initiallySeen);
  }, [notifications, role]);

  const handleSingleClick = (id) => {
    if (!id) return;

    if (!seenIds.includes(id)) {
      setSeenIds((prev) => [...prev, id]);

      markSingleSeen.mutate(id, {
        onError: () => {
          setSeenIds((prev) =>
            prev.filter((item) => item !== id)
          );
        },
      });
    }
  };

  const handleMarkAll = () => {
    if (!notifications.length) return;

    const allIds = notifications.map((item) => item._id);

    setSeenIds(allIds);

    markAllSeen.mutate(undefined, {
      onError: () => {
        const initiallySeen = notifications
          .filter((note) =>
            role === "Admin"
              ? note?.adminSeen
              : note?.wardenSeen
          )
          .map((note) => note._id);

        setSeenIds(initiallySeen);
      },
    });
  };

  const handleViewDetails = (e, note) => {
    e.stopPropagation();

    console.log("Notification Clicked:", note);

    const type = note?.type?.toLowerCase()?.trim();

    const typeRoutes = {
      birthday: "/Reminders",
      certificate: "/Certificates",
      complaint: "/Complaints",
    };

    const path = typeRoutes[type] || "/Dashboard";

    console.log("Notification Type:", type);
    console.log("Navigating To:", path);

    navigate(path);
  };

  return (
    <div
      className="z-50 w-full max-w-[95vw] sm:max-w-[420px] md:max-w-[450px] max-h-[85vh] sm:max-h-[600px] rounded-[16px] sm:rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden border"
      style={{
        backgroundColor: "var(--theme-card-bg)",
        borderColor: "var(--theme-filter-bg)",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b"
        style={{
          backgroundColor: "var(--theme-filter-bg)",
          borderColor: "var(--theme-filter-bg)",
        }}
      >
        <h2
          className="text-[16px] sm:text-[18px] font-bold"
          style={{
            color: "var(--theme-accent)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Notifications
        </h2>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="w-full sm:w-auto text-[12px] sm:text-[13px] font-medium px-4 py-2 rounded-md transition-all hover:opacity-90"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Body */}
      <div
        className="overflow-y-auto max-h-[70vh] sm:max-h-[520px] px-3 sm:px-4 py-2 custom-scrollbar"
        style={{
          backgroundColor: "var(--theme-card-bg)",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LottieLoader />
          </div>
        ) : error ? (
          <p
            className="text-center py-10"
            style={{ color: "#ef4444" }}
          >
            Failed to load notifications.
          </p>
        ) : notifications.length === 0 ? (
          <p
            className="text-center py-10"
            style={{
              color: "var(--theme-muted-text)",
            }}
          >
            No notifications found.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {notifications.map((note) => {
              const isSeen = seenIds.includes(note._id);

              const type = note?.type?.toLowerCase()?.trim();

              const iconUrl =
                NOTIFICATION_ICONS[type] ||
                NOTIFICATION_ICONS.default;

              return (
                <div
                  key={note._id}
                  onClick={() =>
                    handleSingleClick(note._id)
                  }
                  className="flex gap-3 sm:gap-4 cursor-pointer group"
                >
                  {/* Icon */}
                  <div className="min-w-[44px] h-[44px] sm:min-w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0">
                    <img
                      src={iconUrl}
                      alt={type || "notification"}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 border-b pb-4"
                    style={{
                      borderColor:
                        "var(--theme-filter-bg)",
                    }}
                  >
                    <div className="flex justify-between gap-3">
                      <div className="w-full">
                        <h3
                          className="text-[14px] sm:text-[15px] font-bold"
                          style={{
                            color: isSeen
                              ? "var(--theme-muted-text)"
                              : "var(--theme-primary-text)",
                            fontFamily:
                              "var(--theme-font-family-primary)",
                          }}
                        >
                          {note?.title || "Notification"}
                        </h3>

                        <p
                          className="mt-1 text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px]"
                          style={{
                            color: isSeen
                              ? "var(--theme-muted-text)"
                              : "var(--theme-primary-text)",
                            fontFamily:
                              "var(--theme-font-family-primary)",
                          }}
                        >
                          {note?.message ||
                            "No message available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleViewDetails(e, note)
                        }
                        className="text-[12px] underline"
                        style={{
                          color:
                            "var(--theme-muted-text)",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;