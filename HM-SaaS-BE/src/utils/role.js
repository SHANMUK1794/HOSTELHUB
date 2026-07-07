

 const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role?.trim();

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied: Only ${allowedRoles.join(", ")} allowed`,
      });
    }

    
    next();
  };
};
export default checkRole;
export const adminOnly = checkRole("Admin");
export const adminWarden = checkRole("Admin", "Warden");
export const adminChef = checkRole("Admin", "Chef","Staff");
export const allaccess = checkRole("Admin", "Chef","Warden","Staff");
export const adminStoreman = checkRole("Admin", "Storeman","Staff");
