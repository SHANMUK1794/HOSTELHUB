import * as authService from "./auth.service.js";

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; 
    const { userData, refreshToken, cookieOptions } = await authService.googleAuthUser(token, res);

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Google login successful",
        user: userData,
        RefreshToken: refreshToken,
      });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ success: false, message: "Google Authentication failed." });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { userData, refreshToken, cookieOptions } =
      await authService.loginUser(req.body, res);

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: userData,
        RefreshToken: refreshToken,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logoutUser();

    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed. Try again later.",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const { newRefreshToken, cookieOptions } =
      await authService.refreshAccessToken(incomingRefreshToken, res);

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json({
        status: "success",
        message: "Access token refreshed successfully",
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};

export const signup = async (req, res) => {
  try {
    await authService.signupUser(req.body);

    return res.status(201).json({ success: true, message: "User registered successfully." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    await authService.sendOtp(req.body.email);
    return res.status(200).json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    await authService.verifyOtp(req.body.email, req.body.otp);
    return res.status(200).json({ success: true, message: "OTP verified." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body.email, req.body.newPassword);
    return res.status(200).json({ success: true, message: "Password reset successful." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};