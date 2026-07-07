import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMenu } from "../store/slice/MenuSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// Fetch & Normalize Backend Data with branchName param for GET
const FetchMenu = async (branchName) => {
  const res = await axiosInstance.get(
    `${ApiRoutes.MENU.GET}?branchName=${encodeURIComponent(branchName)}`
  );
  const backendData = res.data.data;
  if (!backendData) throw new Error("Menu not found");

  const fullDays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];
  const mealKeys = ["Breakfast", "Lunch", "Dinner"];

  const normalized = fullDays.map((day) => {
    const entry = { day };
    mealKeys.forEach((meal) => {
      const mealBlocks = backendData.filter((m) => m.MealTime === meal);
      const mealBlockForDay = mealBlocks.find((m) =>
        m.Menu.some((menuItem) => menuItem.day === day)
      );
      const dishes =
        mealBlockForDay?.Menu?.find((menuItem) => menuItem.day === day)?.dish || [];
      entry[meal] = dishes;
    });
    return entry;
  });

  return normalized;
};

export const useMenu = (branchName, { showToast } = {}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // ✅ Prevent query if branchName not yet loaded
  const menuQuery = useQuery({
    queryKey: ["Menu", branchName],
    queryFn: () => FetchMenu(branchName),
    enabled: !!branchName,
  });

  useEffect(() => {
    if (menuQuery.data) {
      dispatch(setMenu(menuQuery.data));
    }
  }, [menuQuery.data, dispatch]);

  // ✅ Create Menu API
  const createMenu = useMutation({
    mutationFn: async (data) => {
      const payloadWithBranch = { ...data, branchName };
      const res = await axiosInstance.post(ApiRoutes.MENU.CREATE, payloadWithBranch);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Menu", branchName]);
      if (showToast) showToast("Menu created successfully!", "success");
    },
    onError: (err) => {
      if (showToast) showToast(err.response?.data?.message || "Failed to create menu", "error");
    },
  });

  // ✅ Update Menu API
  const updateMenu = useMutation({
    mutationFn: async (data) => {
      const payloadWithBranch = { ...data, branchName };
      const res = await axiosInstance.put(ApiRoutes.MENU.UPDATE, payloadWithBranch);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Menu", branchName]);
      if (showToast) showToast("Menu updated successfully!", "success");
    },
    onError: (err) => {
      if (showToast) showToast("Menu update failed: " + (err.response?.data?.message || ""), "error");
    },
  });

  return {
    ...menuQuery,
    updateMenu,
    createMenu,
  };
};
