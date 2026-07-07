import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useAdvanceExport = () => {
  const advanceExport = async (branchName, { onSuccess, onError } = {}) => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    try {
      if (isAndroid) {
        const url = ApiRoutes.ADVANCE.EXPORT(branchName);
        window.location.href = url;
        onSuccess?.("Excel download started");
        return;
      }

      const response = await axiosInstance.get(
        ApiRoutes.ADVANCE.EXPORT(branchName),
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Advance_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      onSuccess?.("Excel downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      onError?.("Failed to export Excel");
    }
  };

  return { advanceExport };
};

export default useAdvanceExport;
