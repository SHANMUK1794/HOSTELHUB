import { toast } from "sonner";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useExport = () => {
  const dailyexpense = async ({
    branchName,
    year,
    month,
  }) => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    try {
   
      if (isAndroid) {
        const url = ApiRoutes.EXPENSES.GET_SUMMARY(branchName, year, month);

      
        window.location.href = url;

        toast.success("Excel download started");
        return;
      }

   
      const response = await axiosInstance.get(
        ApiRoutes.EXPENSES.GET_SUMMARY(branchName, year, month),
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
      link.download = `Dailyexpense_${branchName}_${month}_${year}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Excel downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel");
    }
  };

  return { dailyexpense };
};

export default useExport;
