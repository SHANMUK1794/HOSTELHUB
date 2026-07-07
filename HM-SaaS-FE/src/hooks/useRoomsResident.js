import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import {
  addRoom,
  deleteRoom,
  setRooms,
} from "../store/slice/roomSlice";

import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useRoomsResidents = ({ showToast } = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  // ================= USER =================

  const user = useSelector((state) => state.auth?.user);

  const role = user?.role;

  const selectedBranch = useSelector(
    (state) => state.branch.selectedBranch
  );

  const branchName =
    role === "Admin"
      ? selectedBranch
      : user?.branchName;

  // ================= FETCH ROOMS =================

  const fetchRooms = async () => {
    const url = ApiRoutes.ROOMS.GET(
      branchName,
      role
    );

    const res = await axiosInstance.get(url);

    const rooms = res?.data?.data || res?.data?.user || [];

    return rooms;
  };

  // ================= QUERY =================

  const roomsQuery = useQuery({
    queryKey: ["roomsResidents", role, branchName],

    queryFn: async () => {
      const rooms = await fetchRooms();

      dispatch(setRooms(rooms));

      return rooms;
    },

    enabled: !!role && !!branchName,

    staleTime: 1000 * 60 * 5,
  });

  // ================= ADD ROOM =================

  const addRoomMutation = useMutation({
    mutationFn: async (newRoom) => {
      const res = await axiosInstance.post(
        ApiRoutes.ROOMS.CREATE,
        newRoom
      );

      return res.data.data;
    },

    onSuccess: (newRoom) => {
      dispatch(addRoom(newRoom));

      queryClient.invalidateQueries({
        queryKey: [
          "roomsResidents",
          role,
          branchName,
        ],
      });

      if (showToast) showToast("Room added successfully", "success");
    },

    onError: () => {
      if (showToast) showToast("Failed to add room", "error");
    },
  });

  // ================= UPDATE ROOM =================

  // const updateRoomMutation = useMutation({
  //   mutationFn: async (updatedRoom) => {
  //     const res = await axiosInstance.put(
  //       ApiRoutes.ROOMS.UPDATE(updatedRoom._id),
  //       updatedRoom
  //     );

  //     return res.data.updatedRoom;
  //   },

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: [
  //         "roomsResidents",
  //         role,
  //         branchName,
  //       ],
  //     });

  //     toast.success("Room updated successfully");
  //   },

  //   onError: () => {
  //     toast.error("Failed to update room");
  //   },
  // });

  const updateRoomMutation = useMutation({
    mutationFn: async (updatedRoom) => {
      const res = await axiosInstance.put(
        ApiRoutes.ROOMS.UPDATE(updatedRoom._id),
        updatedRoom,
      );
      return res.data.updatedRoom;
    },

    onSuccess: () => {
      // Invalidate query so fresh data is fetched
      queryClient.invalidateQueries({
        queryKey: ["roomsResidents", role, branchName],
      });
      // After refetch, the queryFn already dispatches setRooms(rooms)
      // so Redux will update automatically on the next fetch

      if (showToast) showToast("Room updated successfully", "success");
    },

    onError: () => {
      if (showToast) showToast("Failed to update room", "error");
    },
  });

  // ================= DELETE ROOM =================

  const deleteRoomMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(
        ApiRoutes.ROOMS.DELETE(id)
      );

      return id;
    },

    onSuccess: (id) => {
      dispatch(deleteRoom(id));

      queryClient.invalidateQueries({
        queryKey: [
          "roomsResidents",
          role,
          branchName,
        ],
      });

      if (showToast) showToast("Room deleted successfully", "success");
    },

    onError: () => {
      if (showToast) showToast("Failed to delete room", "error");
    },
  });

  return {
    ...roomsQuery,

    addRoomMutation,

    updateRoomMutation,

    deleteRoomMutation,
  };
};