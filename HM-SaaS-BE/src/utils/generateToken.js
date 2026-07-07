import jwt from "jsonwebtoken";

const generateToken = (res, uuid, tenantId = null) => {
  const token = jwt.sign({ uuid, tenantId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("auth_token", token, {   
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge:  7 * 24 * 60 * 60 * 1000, 
  });

 // ✔ Returns nothing — token is set as cookie
};

export default generateToken;

