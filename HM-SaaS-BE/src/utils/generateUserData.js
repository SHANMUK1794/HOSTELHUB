export const generateUserData = async (user) => {
  const { createdAt, updatedAt, password, refreshToken, ...userData } = user.toObject
    ? user.toObject()
    : user;
  // tenantId is included in ...userData automatically
  return userData;
};

