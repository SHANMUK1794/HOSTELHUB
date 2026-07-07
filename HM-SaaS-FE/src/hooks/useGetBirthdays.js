import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useGetBirthdays = (role, branchName) => {
  return useQuery({
    queryKey: ["birthdays", role, branchName],
    queryFn: async () => {
      let url;
      if (role === "Admin") {
        url = branchName
          ? ApiRoutes.BIRTHDAYS.GET_BY_BRANCH(branchName)
          : ApiRoutes.BIRTHDAYS.GET_ALL;
      } else if (role === "Warden") {
        url = ApiRoutes.BIRTHDAYS.GET_BY_BRANCH(branchName);
      } else {
        url = ApiRoutes.BIRTHDAYS.GET_ALL;
      }

      const res = await axiosInstance.get(url);
      return res.data || {};
    },
    enabled: !!role && !!branchName,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

