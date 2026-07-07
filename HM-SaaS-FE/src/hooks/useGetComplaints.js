import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
const getComplaintsByBranchName = async (branchName) => {
    branchName="Rameswaram Mens Hostel"
  const response = await axiosInstance.get(
    `/api/v1/complaint?branchName=${branchName}`
  );
  return response.data;
};

const useGetComplaints = (branchName) => {
  return useQuery({
    queryKey: ["complaintsForm", branchName], // Make queryKey dynamic
    queryFn: () => getComplaintsByBranchName(branchName),
    enabled: !!branchName, // Only run when branchName is truthy
  });
};
export default useGetComplaints;
