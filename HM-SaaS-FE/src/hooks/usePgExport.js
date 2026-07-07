import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useExport = () => {
  const exportPg = async ({
    branchName,
    year,
    month,
    showToast,
  }) => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    try {
   
      if (isAndroid) {
        const url = ApiRoutes.PGDATA.GET_SUMMARY(branchName, year, month);

      
        window.location.href = url;

        if (showToast) showToast("Excel download started", "success");
        return;
      }

   
      const response = await axiosInstance.get(
        ApiRoutes.PGDATA.GET_SUMMARY(branchName, year, month),
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
      link.download = `Pg_${branchName}_${month}_${year}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      if (showToast) showToast("Excel downloaded successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      if (showToast) showToast("Failed to export Excel", "error");
    }
  };

  return { exportPg };
};

export default useExport;
