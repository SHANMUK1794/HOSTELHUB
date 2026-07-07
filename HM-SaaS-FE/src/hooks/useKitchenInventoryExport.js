import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useExport = () => {
 const inventory = async ({ year, month, showToast }) => {
  const isAndroid = /Android/i.test(navigator.userAgent);

  try {
    const url = ApiRoutes.INVENTORY.GET_SUMMARY(year, month); 

    if (isAndroid) {
      window.location.href = url;
      if (showToast) showToast("Excel download started", "success");
      return;
    }

    const response = await axiosInstance.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = `Kitchen_Inventory_${month}_${year}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    if (showToast) showToast("Excel downloaded successfully", "success");
  } catch (error) {
    console.error("Export error:", error);
    if (showToast) showToast("Failed to export Excel", "error");
  }
};


  return { inventory };
};

export default useExport;
