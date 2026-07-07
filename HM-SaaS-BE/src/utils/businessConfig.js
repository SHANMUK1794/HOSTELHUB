import Settings from "../modules/settings/settings.model.js";

export const getConfig = async (tenantId) => {
  const settings = await Settings.findOne({ tenantId });
  return (
    settings || {
      ebRatePerUnit: 10,
      registrationFee: 500,
      ebDeposit: 1000,
      workingDaysPerMonth: 30,
      workingHoursPerDay: 8,
      overtimeMultiplier: 1,
      casualLeavePerMonth: 2,
    }
  );
};
