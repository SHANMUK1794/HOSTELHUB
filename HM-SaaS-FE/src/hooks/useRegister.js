



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setRegistrationData } from "../store/slice/RegisterSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";  // <-- import here

const useRegister = (yearMonth) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const branchName = useSelector((state) => state.branch.selectedBranch);
  const role = useSelector((state) => state.auth?.user?.role); 
  // keep it consistent with useDailyExpense

  const [year, month] = yearMonth ? yearMonth.split(/[-\s]/) : [];


  // GET
   const fetchRegistrationData = async () => {
    let url;
    if (role === "Admin") {
      url = ApiRoutes.REGISTER.GET_BY_BRANCH(branchName, year, month);
    } else {
      url = ApiRoutes.REGISTER.GET_ALL(year, month);
    }

    const response = await axiosInstance.get(url);

    dispatch(setRegistrationData(response?.data?.data || []));
    return response.data.data || [];
  };

  const { query, refetch } = useQuery({
    queryKey: ["registration", branchName, year, month],
    queryFn: fetchRegistrationData,
  });

  // POST
  const postRegistrationData = async (newData) => {
    const response = await axiosInstance.post(ApiRoutes.REGISTER.ADD, newData);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postRegistrationData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
    },
  });

  // DELETE
  const deleteData = async (id) => {
    const response = await axiosInstance.delete(ApiRoutes.REGISTER.DELETE(id));
    return response.data;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
    },
  });

  // EDIT
  const editData = async (updatedData) => {
    const { editId, data } = updatedData;
    const response = await axiosInstance.put(ApiRoutes.REGISTER.UPDATE(editId), data);
    return response.data;
  };

  const editMutation = useMutation({
    mutationFn: editData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
    },
  });

  // DEACTIVATE
  const changeStatus = async (data) => {
    const response = await axiosInstance.put(ApiRoutes.REGISTER.DEACTIVATE, data);
    return response.data;
  };

  const changeMutation = useMutation({
    mutationFn: changeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
      queryClient.invalidateQueries({ queryKey: ["vacations"] });
    },
  });

  return {
    ...query,
    deactivateUser: changeMutation.mutateAsync,
    createUser: mutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    editUser: editMutation.mutateAsync,
    refetch,
    update: { ...editMutation },
    status: {
      isLoading: mutation.isPending,
      isError: mutation.isError,
      isSuccess: mutation.isSuccess,
      error: mutation.error,
    },
  };
};

export default useRegister;



