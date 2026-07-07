import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../store/slice/LoginSlice";
import axiosInstance from "../utils/AxiosInstance";

import ApiRoutes from "../utils/ApiRoutes";


const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    mutateAsync: login,
    isLoading: isLoginLoading,
    error: loginError,
  } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(ApiRoutes.USERS.LOGIN, formData);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.RefreshToken, user: data.user }));
      
      localStorage.setItem("token", data.RefreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", data.user.username);

      navigate("/welcome"); 
    },
  });


  const { mutateAsync: googleLogin, isLoading: isGoogleLoading, error: googleError } = useMutation({
    mutationFn: async (googleToken) => {
      const response = await axiosInstance.post("/api/users/v1/google-login", { token: googleToken });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.RefreshToken, user: data.user }));
      localStorage.setItem("token", data.RefreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", data.user.username);
      
      // Navigate to the welcome splash screen
      navigate("/welcome");
    },
  });


  const { mutateAsync: signup, isLoading: isSignupLoading, error: signupError } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(ApiRoutes.USERS.SIGNUP, formData);
      return response.data;
    },
    onSuccess: () => navigate("/"), // redirect to login
  });

  const { mutateAsync: sendOtp, isLoading: isSendOtpLoading, error: sendOtpError } = useMutation({
    mutationFn: async (email) => {
      const response = await axiosInstance.post(ApiRoutes.USERS.SEND_OTP, { email });
      return response.data;
    },
  });

  const { mutateAsync: verifyOtp, isLoading: isVerifyOtpLoading, error: verifyOtpError } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(ApiRoutes.USERS.VERIFY_OTP, data);
      return response.data;
    },
  });

  const { mutateAsync: resetPassword, isLoading: isResetLoading, error: resetError } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(ApiRoutes.USERS.RESET_PASSWORD, data);
      return response.data;
    },
    onSuccess: () => navigate("/"), // redirect to login
  });

  return {
    login,
    isLoginLoading,
    loginError,
    signup,
    isSignupLoading,
    signupError,
    sendOtp,
    isSendOtpLoading,
    sendOtpError,
    verifyOtp,
    isVerifyOtpLoading,
    verifyOtpError,
    resetPassword,
    isResetLoading,
    resetError,
    googleLogin,
    isGoogleLoading,
    googleError,
  };
};

export default useAuth;
