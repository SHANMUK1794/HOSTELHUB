import express from "express";
import axios from "axios";

const router = express.Router();

// NEW LOCAL → LIVE forward route
router.post("/forward-attendance", async (req, res) => {
  try {
    // 1. Your LIVE login API
    const login = await axios.post(
      "https://api.kasthurihostel.org/api/users/v1/login",
      {
        username: process.env.LIVE_ADMIN_USERNAME,
        password: process.env.LIVE_ADMIN_PASSWORD
      }
    );
    const accessToken = login.data.accessToken;

    // 2. Forward the SAME body to LIVE
    const response = await axios.post(
      "https://api.kasthurihostel.org/api/staffAttendance/v1/update-staff-attendance",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
           cookie: `auth_token=${accessToken}`
        }
      }
    );

    res.json({
      success: true,
      message: "Forwarded to LIVE",
      liveResponse: response.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

export default router;
