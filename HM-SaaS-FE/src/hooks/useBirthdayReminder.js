import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBirthdays, sendCustomMessage } from "../store/slice/reminderSlice";

export const useBirthdayReminder = () => {
  const dispatch = useDispatch();

  const { birthdays, loading, messageSending, error, response } = useSelector(
    (state) => state.reminder
  );

  useEffect(() => {
    dispatch(fetchBirthdays());
  }, [dispatch]);

  const sendMessage = (payload) => {
    dispatch(sendCustomMessage(payload));
  };

  return {
    birthdays,
    loading,
    messageSending,
    error,
    response,
    sendMessage,
  };
};
