import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// 1️⃣ Get Payroll
export const useGetPayroll = (yearMonth) => {
  const branchName = useSelector((state) => state.branch.selectedBranch);

  return useQuery({
    queryKey: ["payroll", branchName, yearMonth],
    queryFn: async () => {
      const [year, month] = yearMonth.split(/[-\s]/);
      const res = await axios.get(
        ApiRoutes.PAYROLL.GET_ALL(branchName, year, month)
      );
      const data = res.data.data;
      return Array.isArray(data) ? data : [data];
    },
    enabled: !!branchName,
  });
};

// 2️⃣ Save Payroll
export const useSavePayroll = () => {
  const queryClient = useQueryClient();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        employeeId: data.employeeId,
        staff_name: data.staff_name?.trim(),
        staff_role: data.staff_role?.trim() || "Employee",
        date: data.date,
        month: data.month,
        mobile: Number(data.mobile || 0),
        salary: Number(data.salary || 0),
        advance: Number(data.advance || 0),
        balance: Number(data.balance || 0),
        overtime: Number(data.overtime || 0),
        bonus: Number(data.bonus || 0),
        deduction: Number(data.deduction || 0),
        total: Number(data.total || 0), // ✅ fixed key name
        roundoff: Number(data.roundoff || 0),
        leave: Number(data.leave || 0),
        cl: Number(data.cl || 0),
        leavewages: Number(data.leavewages || 0),
        paymentmethod: data.paymentmethod || "cash",
        status: data.status || "Unpaid",
        branchName: branchName,
        workingdays: Number(data.workingdays || 0),
      };

      return data._id
        ? await axios.put(ApiRoutes.PAYROLL.UPDATE(data._id), payload)
        : await axios.post(ApiRoutes.PAYROLL.ADD, payload);
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["payroll", branchName]);
    //   toast.success("Payment added successfully!");
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll", branchName] });
    },
    onError: (error) => {
      console.error("Add payroll failed:", error);
    },
  });
};

// 3️⃣ Update Payroll
export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  return useMutation({
    mutationFn: async (data) => {
      if (!data._id) throw new Error("No payroll ID provided for update");

      const payload = {
        employeeId: data.employeeId,
        staff_name: data.staff_name,
        staff_role: data.staff_role,
        date: data.date,
        month: data.month,
        mobile: Number(data.mobile || 0),
        salary: Number(data.salary || 0),
        advance: Number(data.advance || 0),
        balance: Number(data.balance || 0),
        overtime: Number(data.overtime || 0),
        bonus: Number(data.bonus || 0),
        deduction: Number(data.deduction || 0),
        total: Number(data.total || 0), // ✅ fixed key name
        roundoff: Number(data.roundoff || 0),
        leave: Number(data.leave || 0),
        cl: Number(data.cl || 0),
        leavewages: Number(data.leavewages || 0),
        paymentmethod: data.paymentmethod || "cash",
        status: data.status || "Unpaid",
        branchName: branchName,
        workingdays: Number(data.workingdays || 0),
      };

      const response = await axios.put(
        ApiRoutes.PAYROLL.UPDATE(data._id),
        payload
      );
      return response.data;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["payroll", branchName]);
    //   toast.success("Payment updated successfully!");
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll", branchName] }); // ✅ Force-clears matching caches
    },
    onError: (error) => {
      console.error("Update payroll failed:", error);
    },
  });
};

// 4️⃣ Delete Payroll Hook Configuration

export const useDeletePayroll = () => {
  const queryClient = useQueryClient();
  // Note: branchName is no longer needed here since we invalidate the root key globally

  return useMutation({
    mutationFn: async (id) => await axios.delete(ApiRoutes.PAYROLL.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] }); // ✅ Wipes the entire "payroll" cache tree instantly
      // Toast success is now handled directly inside SalaryTable.jsx handleDelete, 
      // so you can remove the toast here to prevent double-alerts!
    },
  });
};


