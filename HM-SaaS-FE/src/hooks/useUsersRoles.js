

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser, setUsers } from "../store/slice/UserSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useUsersRoles = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  const fetchUsers = async () => {
    const res = await axiosInstance.get(ApiRoutes.EMPLOYEE.GET_ALL, {
      params: { branchName },
    });
    const users = res.data.employees;
    if (!users) throw new Error("No Employee found");
    return users;
  };

  const usersQuery = useQuery({
    queryKey: ["usersRoles", branchName],
    queryFn: async () => {
      const users = await fetchUsers();
      dispatch(setUsers(users));
      return users;
    },
    enabled: !!branchName,
    staleTime: 0,
  });

  const addUserMutation = useMutation({
    mutationFn: async (newUser) => {
      const payload = { ...newUser, branchName };
      const res = await axiosInstance.post(ApiRoutes.EMPLOYEE.CREATE, payload);
      return res.data;
    },
    onSuccess: async () => {
      // 🛠️ THE FIX: Force fetch to update Redux immediately even if unmounted
      const users = await fetchUsers();
      dispatch(setUsers(users));
      queryClient.setQueryData(["usersRoles", branchName], users);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser) => {
      const payload = { ...updatedUser, branchName };
      const res = await axiosInstance.put(
        ApiRoutes.EMPLOYEE.UPDATE(updatedUser._id),
        payload
      );
      return res.data.updatedUser;
    },
    onSuccess: async () => {
      // 🛠️ THE FIX: Force fetch to update Redux immediately even if unmounted
      const users = await fetchUsers();
      dispatch(setUsers(users));
      queryClient.setQueryData(["usersRoles", branchName], users);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(ApiRoutes.EMPLOYEE.DELETE(id));
      return id;
    },
    onSuccess: (deletedId) => {
      dispatch(deleteUser(deletedId));
      queryClient.invalidateQueries(["usersRoles", branchName]);
    },
  });

  return {
    ...usersQuery,
    addUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};

