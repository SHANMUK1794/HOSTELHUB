

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import { setExpense } from "../store/slice/DailyExpenseSlice";
import ApiRoutes from "../utils/ApiRoutes";

const useDailyExpense = (yearMonth) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const role = useSelector((state) => state.auth?.user?.role);
  const branchName = useSelector((state) => state.branch.selectedBranch);

  const { data: expenses, isLoading, error, refetch } = useQuery({
    queryKey: ["daily_expense", branchName, role, yearMonth],
    queryFn: async () => {
      const [year, month] = yearMonth.split(/[-\s]/);

      const url =
        role === "Admin"
          ? ApiRoutes.DAILY_EXPENSE.GET_BY_BRANCH(branchName, year, month)
          : ApiRoutes.DAILY_EXPENSE.GET_ALL(year, month);

      const response = await axiosInstance.get(url);
      dispatch(setExpense(response.data.data));
      return response.data.data;
    },
    enabled: !!branchName && !!yearMonth,
  });

  const { mutate: addPayment } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(ApiRoutes.DAILY_EXPENSE.ADD, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_expense"] });
    },
  });

  const { mutate: editPayment } = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const response = await axiosInstance.put(
        ApiRoutes.DAILY_EXPENSE.UPDATE(id),
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_expense"] });
    },
  });


  const { mutate: deletePayment } = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(ApiRoutes.DAILY_EXPENSE.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_expense"] });
    },
  });

  return {
    expenses,
    isLoading,
    error,
    refetch,
    addPayment,
    editPayment,
    deletePayment,
  };
};

export default useDailyExpense;

