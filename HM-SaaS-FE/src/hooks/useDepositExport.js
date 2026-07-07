import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useExport = () => {
  const deposit = async (
    { branchName, year, month },
    { onSuccess, onError } = {}
  ) => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    try {
      if (isAndroid) {
        const url = ApiRoutes.ROOM_RENT.GET_SUMMARY(year, month, branchName);
        window.location.href = url;
        onSuccess?.("Excel download started");
        return;
      }

      const response = await axiosInstance.get(
        ApiRoutes.ROOM_RENT.GET_SUMMARY(year, month, branchName),
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Deposit_Amount_${branchName}_${month}_${year}.xlsx`;

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

  return { deposit };
};

export default useExport;
