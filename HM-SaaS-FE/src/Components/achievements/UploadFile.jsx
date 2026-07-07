import React, { useRef, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import useAchievements from "../../hooks/useAchievements";
import axiosInstance from "../../utils/AxiosInstance";

const UploadFile = ({
  setIsUploadFile,
  currentPhoto,
  defaultPlaceholder,
  onUploadSuccess,
  achieveData,
  showToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const { updateAchieveData, refetch } = useAchievements();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      !isUploading
    ) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("Please upload a valid image file (JPG, JPEG, WEBP or PNG)", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be less than 10MB", "error");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile && !previewUrl) {
      showToast("Please select an image first", "error");
      return;
    }

    if (selectedFile) {
      setIsUploading(true);
      setUploadProgress(10);

      try {
        const achievementId = achieveData?._id;

        if (!achievementId) {
          showToast("CRITICAL ERROR: The ID is missing!", "error");
          setIsUploading(false);
          setUploadProgress(0);
          return;
        }

        const formData = new FormData();
        formData.append("photo", selectedFile);

        const res = await axiosInstance.post(
          "/api/achievements/v1/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            },
          },
        );

        if (res.data.success) {
          const newImageUrl = res.data.imageUrl;
          await updateAchieveData({
            id: achievementId,
            data: { photo: newImageUrl },
          });
          if (refetch) refetch();
          if (onUploadSuccess) onUploadSuccess(newImageUrl);
        }
      } catch (error) {
        console.error("Upload Error:", error);
        showToast("Failed to save image to the database.", "error");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }

    showToast("Image saved successfully!", "success");
    setIsUploadFile(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md p-6 rounded-[16px] shadow-2xl relative flex flex-col items-center"
        style={{ backgroundColor: "var(--theme-filter-bg)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center w-full mb-6">
          <button
            onClick={() => setIsUploadFile(false)}
            className="hover:opacity-60 transition"
            style={{ color: "var(--theme-primary-text)" }}
            disabled={isUploading}
          >
            <FaArrowLeft size={20} />
          </button>
          <h2
            className="text-xl font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
              fontSize: "var(--theme-font-subheading)",
            }}
          >
            Upload image
          </h2>
          <button
            onClick={() => setIsUploadFile(false)}
            className="hover:opacity-60 transition"
            style={{ color: "var(--theme-primary-text)" }}
            disabled={isUploading}
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-64 border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center p-4 transition-colors mb-4 cursor-pointer ${
            isUploading ? "opacity-50 pointer-events-none" : ""
          }`}
          style={{
            borderColor: isDragging
              ? "var(--theme-accent)"
              : "color-mix(in srgb, var(--theme-accent) 50%, transparent)",
            backgroundColor: isDragging
              ? "color-mix(in srgb, var(--theme-accent) 10%, transparent)"
              : "var(--theme-card-bg)",
          }}
          onClick={() =>
            !previewUrl && !isUploading && fileInputRef.current?.click()
          }
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center text-center pointer-events-none">
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                alt="Drag and drop graphic"
                className="mb-4"
              />
              <p
                className="font-medium mt-2"
                style={{
                  color: "var(--theme-accent)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                Drag &amp; Drop your file here
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isUploading && uploadProgress > 0 && (
          <div
            className="w-full rounded-full h-2.5 mb-6 shadow-inner"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--theme-accent) 15%, white)",
            }}
          >
            <div
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: "var(--theme-accent)",
              }}
            />
            <p
              className="text-xs mt-1 text-right font-medium"
              style={{ color: "var(--theme-accent)" }}
            >
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div className="w-full flex flex-col gap-4 items-center mt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-48 font-medium py-2.5 rounded-[6px] hover:opacity-90 transition-colors shadow-sm disabled:opacity-50"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            {previewUrl ? "Change Photo" : "Choose Photo"}
          </button>

          <button
            onClick={handleSave}
            disabled={isUploading}
            className="w-48 font-medium py-2.5 rounded-[6px] hover:opacity-90 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            {isUploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
