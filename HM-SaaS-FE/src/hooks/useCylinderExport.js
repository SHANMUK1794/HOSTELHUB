import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const UsecylinerExport = () => {
  const usecyliner = async ({ branchName, year, month, showToast }) => {
    try {
      if (showToast) showToast("Preparing download...", "success");

      // 1. Axios handles the request AND attaches your login token automatically
      const response = await axiosInstance.get(
        ApiRoutes.CYLINDER.EXPORT(month, year, branchName),
        {
          responseType: "blob", // CRITICAL: Tells Axios we are downloading a file, not JSON
        }
      );

      // 2. Convert the raw data into an Excel file blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 3. Create a temporary secure link in the browser memory
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Cylinder_Kitchen_${month}_${year}.xlsx`; // File name

      // 4. Force the browser to click the link and download the file
      document.body.appendChild(link);
      link.click();

      // 5. Clean up the temporary link
      link.remove();
      window.URL.revokeObjectURL(url);

      if (showToast) showToast("Excel downloaded successfully!", "success");
    } catch (error) {
      console.error("Export error:", error);
      
      // If the backend sends an error while responseType is 'blob', it requires parsing
      if (error.response && error.response.data instanceof Blob) {
         const errorData = JSON.parse(await error.response.data.text());
         if (showToast) showToast(errorData.message || "Failed to export Excel", "error");
      } else {
         if (showToast) showToast("Failed to export Excel", "error");
      }
    }
  };

  return { usecyliner };
};

export default UsecylinerExport;