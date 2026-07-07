import { toast } from "sonner";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useExport = () => {
 const store = async ({ year, month }) => {
  const isAndroid = /Android/i.test(navigator.userAgent);

  try {
    const url = ApiRoutes.STORE_ROOM_INVENTORY.GET_SUMMARY(year, month); 

    if (isAndroid) {
      window.location.href = url;
      toast.success("Excel download started");
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
    downloadLink.download = `StoreRoom_Summary_${month}_${year}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    toast.success("Excel downloaded successfully");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export Excel");
  }
};


  return { store };
};

export default useExport;
