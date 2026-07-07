import axiosInstance from "../utils/AxiosInstance";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setAchievementsData,
  deleteAchievementData,
  editAchievementsData,
} from "../store/slice/AchievementsSlice";
import { useDispatch, useSelector } from "react-redux";
import ApiRoutes from "../utils/ApiRoutes";

const useAchievements = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  // GET Achievements
  const getAchievementsData = async () => {
    const role = JSON.parse(localStorage.getItem("user"));
    let url =
      role?.role === "Warden"
        ? ApiRoutes.ACHIEVEMENTS.GET_ALL_WARDEN
        : ApiRoutes.ACHIEVEMENTS.GET_ALL(branchName);

    const response = await axiosInstance.get(url);
    dispatch(setAchievementsData(response.data));
    return response.data;
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["achievementData"],
    queryFn: getAchievementsData,
  });

  // ADD Achievement
  const postAchievementsData = async (newData) => {
    // FIX: Removed the manual headers. Axios will auto-detect FormData 
    // and add the correct multipart/form-data header WITH the boundary.
    const response = await axiosInstance.post(
      ApiRoutes.ACHIEVEMENTS.ADD,
      newData
    );
    return response.data;
  };

  const postMutation = useMutation({
    mutationFn: postAchievementsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievementData"] });
    },
  });

  // DELETE Achievement
  const deleteAchievement = async (id) => {
    const response = await axiosInstance.delete(
      ApiRoutes.ACHIEVEMENTS.DELETE(id)
    );
    return response.data;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteAchievement,
    onSuccess: (_, id) => {
      dispatch(deleteAchievementData(id));
      queryClient.invalidateQueries({ queryKey: ["achievementData"] });
    },
  });

  // NEW: Dedicated function just for uploading the image
  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await axiosInstance.post(
      "/api/achievements/v1/upload-image", // Adjust this path if your base URL is different
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.imageUrl;
  };

  // Look for this function in useAchievements.js
  const updateAchievementData = async ({ id, data }) => { // <--- MUST have { id, data } here
    const isFormData = data instanceof FormData;

    if (!isFormData) {
      delete data?.status;
    }

    // Make sure it passes the 'id' to the URL route here
    const response = await axiosInstance.put(
      ApiRoutes.ACHIEVEMENTS.UPDATE(id),
      data 
    );

    return response.data.achievement;
  };


  

  const updateMutation = useMutation({
    mutationFn: updateAchievementData,
    onSuccess: (res) => {
      dispatch(editAchievementsData(res));
      queryClient.invalidateQueries({ queryKey: ["achievementData"] });
    },
  });

  return {
    data,
    isLoading,
    refetch,
    addData: postMutation.mutateAsync,
    deleteAchieveData: deleteMutation.mutateAsync,
    updateAchieveData: updateMutation.mutateAsync,
    isSuccessAchievement: updateMutation.isSuccess,
    uploadImageToServer
  };
};

export default useAchievements;