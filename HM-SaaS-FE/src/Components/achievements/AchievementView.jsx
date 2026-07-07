import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import UploadFile from "./UploadFile";
import axiosInstance from "../../utils/AxiosInstance";
import useAchievements from "../../hooks/useAchievements";
import ToastMessage from "../common_components/ToastMessage";

const AchievementView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const achieve = state?.achieve;

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

  const { data: rawData } = useAchievements();
  const achievementsArray = Array.isArray(rawData)
    ? rawData
    : rawData?.data || [];
  const liveAchievement =
    achievementsArray.find((item) => item._id === achieve?._id) || achieve;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(
    liveAchievement?.photo ||
      "https://asset.techjose.com/Hostelos/images/Achievementuser.png",
  );

  useEffect(() => {
    if (liveAchievement?.photo) {
      setCurrentPhoto(liveAchievement.photo);
    }
  }, [liveAchievement]);

  if (!achieve) {
    return (
      <div className="p-6" style={{ color: "var(--theme-heading-text)" }}>
        No achievement data found.
      </div>
    );
  }

  const handleImageSuccess = (newImageUrl) => {
    setCurrentPhoto(newImageUrl);
  };

  const getImageUrl = (path) => {
    if (
      !path ||
      path === "undefined" ||
      path === "https://asset.techjose.com/Hostelos/images/Achievementuser.png"
    )
      return "https://asset.techjose.com/Hostelos/images/Achievementuser.png";
    if (
      path.startsWith("http") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    )
      return path;

    const BASE_URL =
      axiosInstance.defaults.baseURL ||
      "https://api-techjose-hostelos.techjose.com";
    const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
  };

  const isDefaultPhoto =
    currentPhoto ===
    "https://asset.techjose.com/Hostelos/images/Achievementuser.png";

  return (
    <div
      className="w-full overflow-y-auto"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      <div
        className="p-4 sm:p-6 shadow-lg m-2 sm:m-4 lg:ml-15 rounded-xl border border-[#CDCDCD]"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Back button + heading */}
        <div className="flex justify-between items-center mb-10">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/Achievements")}
          >
            <FaArrowLeft
              className="text-lg sm:text-xl"
              style={{ color: "var(--theme-primary-text)" }}
            />
            <h2
              className="text-2xl sm:text-3xl font-bold ml-2"
              style={{
                color: "var(--theme-heading-text)",
                fontFamily: "var(--theme-font-family-primary)",
                fontSize: "var(--theme-font-heading)",
              }}
            >
              Achievements
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
          {/* Details Section */}
          <div className="space-y-12 text-sm sm:text-md font-medium w-full mt-4 ml-4 sm:ml-6">
            {[
              { label: "NAME", value: liveAchievement.name },
              { label: "BRANCH", value: liveAchievement.branchName },
              { label: "FLOOR NO", value: liveAchievement.floorno || "N/A" },
              { label: "ROOM NO", value: liveAchievement.roomno || "N/A" },
              { label: "POSITION", value: liveAchievement.position },
            ].map(({ label, value }) => (
              <p
                key={label}
                className="text-[16px] sm:text-[18px] lg:text-[20px] break-words"
                style={{
                  color: "var(--theme-primary-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                <strong style={{ color: "var(--theme-heading-text)" }}>
                  {label} :
                </strong>{" "}
                {value}
              </p>
            ))}
          </div>

          {/* Image Section */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full flex items-center justify-center">
              <img
                src={getImageUrl(currentPhoto)}
                alt="User"
                className={`transition-all duration-300 ${
                  !isDefaultPhoto
                    ? "w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] object-cover rounded-full shadow-lg border-[4px]"
                    : "w-full max-w-[350px] h-auto object-contain"
                }`}
                style={
                  !isDefaultPhoto ? { borderColor: "var(--theme-accent)" } : {}
                }
              />
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center justify-center text-[16px] sm:text-[18px] px-5 sm:px-6 py-2 gap-2 rounded hover:opacity-90 transition shadow-md mt-6"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              <img
                className="w-5 h-5 sm:w-6 sm:h-6 filter brightness-0 invert"
                src="https://asset.techjose.com/Hostelos/achievementupload.png"
                alt="upload"
              />
              Upload image
            </button>
          </div>
        </div>

        {isUploadModalOpen && (
          <UploadFile
            setIsUploadFile={setIsUploadModalOpen}
            currentPhoto={currentPhoto}
            defaultPlaceholder={
              "https://asset.techjose.com/Hostelos/images/Achievementuser.png"
            }
            onUploadSuccess={handleImageSuccess}
            achieveData={liveAchievement}
            showToast={showToast}
          />
        )}
      </div>

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

export default AchievementView;
