


/////
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import { setAttendance, setUserAttendanceCount } from "../store/slice/AttendanceSlice";

import ApiRoutes from "../utils/ApiRoutes";

const useAttendance = (yearMonth) => {
  const dispatch = useDispatch();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  // Fetch attendance for rooms
  const fetchAttendanceFn = async ({ date, branch }) => {
    const res = await axiosInstance.get(
      ApiRoutes.ATTENDANCE.GET_ROOM_DATA(date, branch)
    );
    return res.data;
  };

  const { mutate: fetchAttendance, isLoading, error } = useMutation({
    mutationFn: fetchAttendanceFn,
    onSuccess: (response) => {
      const transformed = response.data.map(({ Name, ...rest }) => ({
        ...rest,
        members: Name.map((member) => ({
          ...member,
          attendance:
            member.status === true
              ? "present"
              : member.status === false
              ? "absent"
              : null,
        })),
      }));

      dispatch(setAttendance(transformed));
    },
  });

  // Submit attendance
  const submitAttendanceFn = async ({ localAttendance, date, branchName }) => {
    const attendanceList = localAttendance.flatMap((room) =>
      room.members
        .filter((member) => member.attendance !== null)
        .map((member) => ({
          userId: member.id,
          status: member.attendance === "present",
        }))
    );

    const payload = { attendanceList, branchName, date };
    const response = await axiosInstance.post(ApiRoutes.ATTENDANCE.SUBMIT, payload);
    return response.data;
  };

  const { mutate: submitAttendance, isLoading: isSubmitting, error: submitError } =
    useMutation({
      mutationFn: submitAttendanceFn,
    });

  // Get attendance summary
  const getAttendanceSummaryFn = async ({ branchName, yearMonth }) => {
    const [year, month] = yearMonth.split(/[-\s]/);
    const res = await axiosInstance.get(ApiRoutes.ATTENDANCE.GET_USER_SUMMARY, {
      params: { branchName, year, month },
    });
    return res.data;
  };

  const {
    mutate: getAttendanceSummary,
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useMutation({
    mutationFn: getAttendanceSummaryFn,
    onSuccess: (data) => {
      if (data?.userAttendance) {
        dispatch(setUserAttendanceCount(data.userAttendance));
      }
    },
  });

  return {
    fetchAttendance,
    isLoading,
    error,
    submitAttendance,
    isSubmitting,
    submitError,
    getAttendanceSummary,
    summary,
    summaryLoading,
    summaryError,
  };
};

export default useAttendance;
