import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setFoodSummary } from "../store/slice/FoodDashSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// 🛠️ ADDED branchName to arguments
export const useFoodDash = ({ date, mealTime, branchName }) => {
  const dispatch = useDispatch();

  const fetchFoodDash = async () => {
    // 🛠️ ADDED branchName to the POST body
    const res = await axiosInstance.post(ApiRoutes.FOOD_DISH.GET_SUMMARY, {
      date,
      mealTime,
      branchName, 
    });
    
    const details = res.data;
    if (!details) throw new Error("No details found");
    return details;
  };

  const foodSummaryQuery = useQuery({
    // 🛠️ ADDED branchName to queryKey so it refreshes when you change hostels
    queryKey: ["foodSummary", date, mealTime, branchName],
    queryFn: fetchFoodDash,
    enabled: !!date && !!mealTime && !!branchName, // 🛠️ Only run if we have a branch
    onSuccess: (data) => {
      dispatch(setFoodSummary(data));
    },
  });

  return foodSummaryQuery;
};