

////
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  addCertificate,
  deleteCertificate as deleteCertRedux,
  setCertificateData,
  updateCertificateData as updateCertificateRedux,
} from "../store/slice/CertificateSlice";
import axiosInstance from "../utils/AxiosInstance";
import { toast } from "sonner";
import ApiRoutes from "../utils/ApiRoutes";

const useCertificate = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
   const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user); // get full user from redux

  // Decide branch based on role
  const branchName =
    user?.role?.toLowerCase() === "admin"
      ? selectedBranch
      : user?.role?.toLowerCase() === "warden"
      ? user?.branchName
      : null;

  // Fetch
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["certificates", branchName],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRoutes.CERTIFICATE.GET_ALL(branchName));
      dispatch(setCertificateData(res.data));
      return res.data;
    },
    enabled: !!branchName,
  });

  // Add
  const addMutation = useMutation({
    mutationFn: (newCertificate) =>
      axiosInstance.post(ApiRoutes.CERTIFICATE.ADD, newCertificate),
    onSuccess: (res) => {
      dispatch(addCertificate(res.data));
      queryClient.invalidateQueries({ queryKey: ["certificates", branchName] });
    },
  });

  // Update
  const updateFn = async ({ id, updatedData }) => {
    await axiosInstance.put(ApiRoutes.CERTIFICATE.UPDATE(id), updatedData);
    return { id, updatedData };
  };

  const updateMutation = useMutation({
    mutationFn: updateFn,
    onSuccess: (res) => {
      dispatch(updateCertificateRedux(res));
      queryClient.invalidateQueries({ queryKey: ["certificates", branchName] });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(ApiRoutes.CERTIFICATE.DELETE(id)),
    onSuccess: (_, id) => {
      dispatch(deleteCertRedux(id));
      queryClient.invalidateQueries({ queryKey: ["certificates", branchName] });
      toast.success("Certificate deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete certificate");
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    addCertificate: addMutation.mutateAsync,
    updateCertificate: updateMutation.mutateAsync,
    deleteCertificate: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isLoading,
    isUpdateSuccess: updateMutation.isSuccess,
  };
};

export default useCertificate;


