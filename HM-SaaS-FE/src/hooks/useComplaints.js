


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  addComplaint,
  setComplaintsData,
} from "../store/slice/ComplaintsSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const useComplaints = (yearMonth) => {
  const [year, month] = yearMonth.split(/[-\s]/);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  // Get complaints
  const getComplaints = async () => {
    try {
      const role = JSON.parse(localStorage.getItem("user"));
      const url =
        role?.role === "Warden"
          ? ApiRoutes.COMPLAINTS.GET_ALL(year, month)
          : ApiRoutes.COMPLAINTS.GET_BY_BRANCH(branchName, year, month);

      const response = await axiosInstance.get(url);
      dispatch(setComplaintsData(response.data));
      return response.data;
    } catch (error) {
      dispatch(setComplaintsData([]));
      console.error("Error fetching complaints:", error);
      return [];
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["complaintsForm", year, month],
    queryFn: getComplaints,
    enabled: !!branchName || JSON.parse(localStorage.getItem("user"))?.role === "Warden",
  });

  // Add complaint
  const addMutation = useMutation({
    mutationFn: (newComplaint) =>
      axiosInstance.post(ApiRoutes.COMPLAINTS.ADD, newComplaint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaintsForm"] });
    },
  });

  // Update complaint
  const updateComplaintData = async (data) => {
    const response = await axiosInstance.put(
      ApiRoutes.COMPLAINTS.UPDATE(data._id),
      data
    );
    return response.data;
  };

  const updateMutation = useMutation({
    mutationFn: updateComplaintData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaintsForm"] });
    },
  });

  // Delete complaint
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(ApiRoutes.COMPLAINTS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaintsForm"] });
    },
  });

  return {
    data,
    isLoading,
    refetch,
    addComplaint: addMutation.mutateAsync,
    updateComplaint: updateMutation.mutateAsync,
    deleteComplaint: deleteMutation.mutateAsync,
  };
};

export default useComplaints;

