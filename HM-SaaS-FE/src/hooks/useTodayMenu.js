import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useTodayMenu = ({ date, mealTime, branchName }) => {
  return useQuery({
    queryKey: ["todayMenu", date, mealTime, branchName],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRoutes.TODAYMENU.GET_TODAY_MENU, {
        params: {
          Date: date,
          MealTime: mealTime,
          branchName: branchName,
        },
      });
      return res.data;
    },
    enabled: !!date && !!mealTime,

    // ✅ FIX: Return the raw menu object with Veg/NonVeg intact.
    // The old select() was transforming data into { day, items } which
    // broke FoodMenu.jsx that expected { Veg: [], NonVeg: [] }.
    // Now we return the raw response so FoodMenu can extract Veg/NonVeg itself.
    select: (response) => {
      // Unwrap all possible Axios/backend nesting levels
      // and return the object that contains Veg and NonVeg arrays.
      const menuObj =
        response?.data?.data && (response.data.data.Veg || response.data.data.NonVeg)
          ? response.data.data
          : response?.data && (response.data.Veg || response.data.NonVeg)
          ? response.data
          : response?.Veg || response?.NonVeg
          ? response
          : null;

      if (!menuObj) {
        // Nothing matched — log the raw response so you can see the real shape
        console.warn("[useTodayMenu] Could not find Veg/NonVeg in response:", response);
        return { Veg: [], NonVeg: [] };
      }

      return menuObj; // { Veg: [...], NonVeg: [...] }
    },
  });
};