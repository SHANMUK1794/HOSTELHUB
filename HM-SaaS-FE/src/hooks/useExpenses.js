import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../store/slice/ExpenseSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useExpenses = (year, month, { showToast } = {}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const role = useSelector((state) => state.auth?.user?.role);
  const branchName = useSelector((state) => state.branch.selectedBranch);

  // ✅ Direct API without date filter
  const fetchExpenses = async () => {
    const res = await axiosInstance.get(ApiRoutes.EXPENSES.GET_ALL(year, month, branchName));
    const expenses = res.data.items;
    if (!expenses) throw new Error("Expenses not found");
    return expenses;
  };

  const expensesQuery = useQuery({
    queryKey: ["expenses", role, branchName, year, month],
    queryFn: fetchExpenses,
    enabled: !!role,   // ✅ ONLY needs role now
    onSuccess: (expenses) => {
      dispatch(setExpenses(expenses));
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense) => {
      const res = await axiosInstance.post(ApiRoutes.EXPENSES.ADD, newExpense);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses", role, branchName]);
      if (showToast) showToast("Expense item added successfully", "success");
    },
    onError: () => {
      if (showToast) showToast("Invalid item", "error");
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId) => {
      await axiosInstance.delete(ApiRoutes.EXPENSES.DELETE(expenseId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses", role, branchName]);
      if (showToast) showToast("Item deleted successfully!", "success");
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async (updatedExpense) => {
      const res = await axiosInstance.put(
        ApiRoutes.EXPENSES.UPDATE(updatedExpense._id),
        updatedExpense
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses", role, branchName]);
      if (showToast) showToast("Expense item updated successfully", "success");
    },
    onError: () => {
      if (showToast) showToast("No changes detected. Please modify at least one field to update", "error");
    },
  });

  return {
    ...expensesQuery,
    addExpenseMutation,
    deleteExpenseMutation,
    updateExpenseMutation,
  };
};
