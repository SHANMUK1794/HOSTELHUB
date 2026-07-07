import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";
import {
  setStaffAttendanceCount,
  setStaffData
} from "../store/slice/staffAttendanceSlice";


export const useStaffAttendance = () => {
  const dispatch = useDispatch();

  const branchName = useSelector(
    (state) => state.branch.selectedBranch
  );

  const normalizeBranchName = (value) =>
    value?.toString().replace(/['"]/g, "").trim() || "";

  const normalizeAttendanceValue = (value) => {
    if (value === true || value === "present") return "present";
    if (value === false || value === "absent") return "absent";
    return null;
  };

  const normalizeStaffRecord = (staff) => {
    const userId =
      staff?.userId ||
      staff?.employeeId ||
      staff?.id ||
      staff?.uid ||
      staff?._id;

    return {
      ...staff,
      id: userId ? String(userId) : staff?.id || staff?._id || null,
      userId: userId ? String(userId) : null,
      attendance: normalizeAttendanceValue(staff?.attendance ?? staff?.present),
    };
  };

  /** ================= FETCH STAFF ATTENDANCE ================= */
  const fetchStaffAttendanceFn = async ({ date, branch }) => {
    const normalizedBranch = normalizeBranchName(branch);

    const url = ApiRoutes.STAFF_ATTENDANCE.FETCH({
      date,
      branchName: normalizedBranch
    });

    const res = await axiosInstance.get(url);
    return res.data;
  };

  const {
    mutate: fetchStaffAttendance,
    isLoading,
    error
  } = useMutation({
    mutationFn: fetchStaffAttendanceFn,

    onSuccess: (res) => {
      const transformed = (res?.data || []).map((staff) =>
        normalizeStaffRecord(staff)
      );

      dispatch(setStaffData(transformed));
    },

    onError: (err) => {
      console.error("Failed to fetch staff attendance", err);
    }
  });

  /** ================= SUBMIT STAFF ATTENDANCE ================= */
  const submitStaffAttendanceFn = async ({
    localStaffAttendance,
    date,
    branchName
  }) => {
    const attendanceList = (localStaffAttendance || []).map((staff) => ({
      userId: String(staff.userId || staff.id || ""),
      present: staff.present ?? staff.attendance === "present",
      // 🛠️ THE FIX: Fallback data so the backend can find WorkerEmployees
      staffName: staff.staffName || staff.name || "Unnamed", 
      role: staff.role || "Staff",
      shift: staff.shift || "-",
    }));

    const payload = {
      attendanceList,
      branchName: normalizeBranchName(branchName),
      date
    };

    const res = await axiosInstance.post(
      ApiRoutes.STAFF_ATTENDANCE.UPDATE,
      payload
    );

    return res.data;
  };

  // 🛠️ THIS WAS THE MISSING BLOCK THAT CAUSED THE CRASH
  const {
    mutate: submitStaffAttendance,
    isLoading: isSubmitting
  } = useMutation({
    mutationFn: submitStaffAttendanceFn,

    onSuccess: () => {
    },

    onError: (err) => {
      console.error("Failed to submit attendance", err);
    }
  });

  /** ================= STAFF SUMMARY ================= */
  const getStaffSummaryFn = async ({
    branchName,
    yearMonth
  }) => {
    const [year, month] = yearMonth.split(/[-\s]/);

    const url = ApiRoutes.STAFF_ATTENDANCE.SUMMARY({
      branchName,
      year,
      month
    });

    const res = await axiosInstance.get(url);

    return res.data;
  };

  const {
    mutate: getStaffSummary,
    data: summary,
    isLoading: summaryLoading,
    error: summaryError
  } = useMutation({
    mutationFn: getStaffSummaryFn,

    onSuccess: (data) => {
      if (data?.staffAttendance) {
        dispatch(
          setStaffAttendanceCount(data.staffAttendance)
        );
      }
    },

    onError: (err) => {
      console.error("Failed to fetch summary", err);
    }
  });

  return {
    branchName,

    fetchStaffAttendance,
    isLoading,
    error,

    submitStaffAttendance,
    isSubmitting,

    getStaffSummary,
    summary,
    summaryLoading,
    summaryError
  };
};

export default useStaffAttendance;