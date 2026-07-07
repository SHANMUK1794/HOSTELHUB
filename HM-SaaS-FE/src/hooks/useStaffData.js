import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStaffData } from "../store/slice/staffSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useStaffData = (branchName) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!branchName) return;

    const fetchStaff = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${ApiRoutes.EMPLOYEE.GET_ALL}?branchName=${encodeURIComponent(branchName)}`
        );

        dispatch(setStaffData(data?.employees || data || []));
      } catch (error) {
        console.error("Failed to fetch staff data:", error);
        dispatch(setStaffData([]));
      }
    };

    fetchStaff();
  }, [branchName, dispatch]);
};