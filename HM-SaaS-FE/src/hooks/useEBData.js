import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useEBData = (yearMonth) => {
  const [year, month] = yearMonth.split(/[-\s]/);
  const queryClient = useQueryClient();

  const { role } = useSelector((state) => state.auth.user || {});
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);

  // Map selected branch to backend-friendly format
  const branchMap = {
    "IOB Men's Hostel": "IOB Mens Hostel",
    "Rameswaram Men's Hostel": "Rameswaram Mens Hostel",
    "New Men's Hostel": "New Mens Hostel",
    "Womens Hostel": "Womens Hostel",
  };
  const branchName = branchMap[selectedBranch] || selectedBranch;

  const queryKey = ["ebData", selectedBranch, yearMonth];

  // Fetch EB data
  const fetchEBData = async () => {
    let url = ApiRoutes.EB.GET_ALL(year, month);
    if (role === "Admin" && selectedBranch) {
      url = ApiRoutes.EB.GET_BY_BRANCH(selectedBranch, year, month);
    }
    const response = await axiosInstance.get(url);
    return response.data.data;
  };

  const { data: ebData = [], isLoading, isError } = useQuery({
    queryKey,
    queryFn: fetchEBData,
    enabled: !!role && !!selectedBranch,
  });

  // Delete EB payment
  const deleteEBPayment = async (id) => {
    await axiosInstance.delete(ApiRoutes.EB.DELETE(id));
    queryClient.invalidateQueries(queryKey);
  };

  // Add/Edit EB payment
  const { mutateAsync: saveEBData, isLoading: isSaving } = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) {
        await axiosInstance.put(ApiRoutes.EB.UPDATE(payload.id), payload);
      } else {
        await axiosInstance.post(ApiRoutes.EB.ADD, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  // WhatsApp reminder
  const { mutate: whatsappMessage } = useMutation({
    mutationFn: async ({ RoomNo, Month }) => {
      if (!RoomNo || !Month || !branchName) {
        throw new Error("RoomNo, Month, and branchName are required.");
      }
      await axiosInstance.post(ApiRoutes.EB.SEND_REMINDER, {
        RoomNo,
        Month,
        branchName,
      });
    },
    onSuccess: () => {
      // we'll handle this in UI
    },
  });
  // Export EB data using GET
const { mutate: exportEBData, isLoading: isExporting } = useMutation({
  mutationFn: async () => {
    const url = ApiRoutes.EB.EXPORTDATA(branchName, year, month);

    return await axiosInstance.get(url, {
      responseType: "blob", // needed for file download
    });
  },

  onSuccess: (response) => {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `EB-Report-${branchName}-${year}-${month}.xlsx`;
    link.click();
  },
});
// NEW: Fetch summary data
// const fetchEBSummary = async () => {
//   const url = ApiRoutes.EB.GET_SUMMARY(branchName, year, month);
//   const response = await axiosInstance.get(url);
//   return response.data.data;
// };

// const {
//   data: ebSummary = [],
//   isLoading: isSummaryLoading,
//   isError: isSummaryError,
// } = useQuery({
//   queryKey: ["ebSummary", branchName, yearMonth],
//   queryFn: fetchEBSummary,
//   enabled: !!branchName && !!yearMonth,
// });



  return {
  ebData,
  isLoading,
  isError,
  deleteEBPayment,
  saveEBData,
  whatsappMessage,
  branchName,
  exportEBData,
  isExporting,

  // NEW ADDED
  // ebSummary,
  // isSummaryLoading,
  // isSummaryError,
};

};
