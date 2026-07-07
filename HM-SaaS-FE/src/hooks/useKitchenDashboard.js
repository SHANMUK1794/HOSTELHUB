// src/hooks/useKitchenDashboard.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";

export const useKitchenDashboard = () => {
  const [kitchenData, setKitchenData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Use GET request
        const response = await axiosInstance.get("/api/v1/dashboard/kitchen");

        if (response.data.success) {
          let data = response.data.data;

          // ✅ Filter based on Chef's branch
          if (user?.role === "Chef" && user?.branchName) {
            const branchKey = Object.keys(data).find((key) =>
              data[key]?.branchName
                ?.toLowerCase()
                .includes(user.branchName.toLowerCase())
            );

            if (branchKey) {
              data = {
                [branchKey]: data[branchKey],
                totals: data.totals,
              };
            }
          }

          setKitchenData(data);
        } else {
          console.warn("Backend responded with success:false", response.data);
          setKitchenData(null);
        }
      } catch (err) {
        console.error("❌ Error fetching kitchen dashboard:", err);
        setKitchenData(null);
      } finally {
        // ✅ Important: stop loading no matter what
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { kitchenData, isLoading };
};
