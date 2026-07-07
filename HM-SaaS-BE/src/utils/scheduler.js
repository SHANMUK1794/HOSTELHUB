import cron from "node-cron";
import Register from "../modules/register/register.model.js";
import RoomRent from "../modules/FinanceAndUtilities/RoomRent/roomRent.model.js";
import pgDataService from "../modules/pgdata/pgdata.service.js";
import { 
  sendWhatsappMessageBirthday, 
  sendWhatsappMessageremainder 
} from "./whatsapp.js";
import { getConfig } from "./businessConfig.js";

export const startCronJobs = () => {
  // "0 0 * * *" means: Run at 12:00 AM every single day (Midnight)
 cron.schedule("0 0 * * *", async () => {
  console.log("⏳ [CRON] Running Midnight Automation...");
  await pgDataService.autoDeactivatePgUsers();
});

  // "0 9 * * *" means: Run at 9:00 AM every single day
//"*/1 * * * *" (This means: Run every 1 minute for testing purposes)
  cron.schedule("0 9 * * *" , async () => {
    console.log("⏳ [CRON] Running Daily WhatsApp Automation...");
    
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // 1-12
      const currentDay = today.getDate();
      const currentYear = today.getFullYear();

      // ─────────────────────────────────────────────────────────
      // 1. BIRTHDAY AUTOMATIONS
      // ─────────────────────────────────────────────────────────
      const birthdayResidents = await Register.find({
        staying: true,
        isdeleted: false,
        $expr: {
          $and: [
            { $eq: [{ $month: "$DateOfBirth" }, currentMonth] },
            { $eq: [{ $dayOfMonth: "$DateOfBirth" }, currentDay] },
          ],
        },
      });

      for (const resident of birthdayResidents) {
        if (!resident.tenantId) continue; 
        
        const tenantSettings = await getConfig(resident.tenantId);
        
        if (tenantSettings?.waEnableBirthday) {
          const mobile = resident.SameAsWhatsapp ? resident.MobileNo : resident.Whatsapp;
          if (mobile) {
            try {
              await sendWhatsappMessageBirthday(mobile, resident.Name, tenantSettings);
              console.log(`✅ [CRON] Birthday wish sent to: ${resident.Name}`);
            } catch (err) {
              // Fails silently in cron, detailed error is already logged by whatsapp.js
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────────
      // 2. RENT DUE-DATE ALERTS
      // ─────────────────────────────────────────────────────────
      // Set the day you want the alert to fire (e.g., 4th of the month)
      const ALERT_DAY = 25; 
      
      if (currentDay === ALERT_DAY) {
        // Calculate the start and end of the CURRENT month to avoid old rent rows
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const pendingRents = await RoomRent.find({
          Balance: { $gt: 0 },
          Status: { $ne: "Paid" },
          isdeleted: { $ne: true },
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        });

        const monthName = today.toLocaleString("default", { month: "long" });
        const dueDateString = `${ALERT_DAY + 1} ${monthName}`; // Outputs: "5 October"

        for (const rent of pendingRents) {
          if (!rent.tenantId) continue; 
          
          const tenantSettings = await getConfig(rent.tenantId);
          
          if (tenantSettings?.waEnableRentLastDay) {
            if (rent.MobileNo) {
              await sendWhatsappMessageremainder(
                rent.MobileNo,
                rent.ResidentName,
                rent.Balance.toString(), 
                monthName,
                dueDateString,
                tenantSettings
              );
              console.log(`✅ [CRON] Rent reminder sent to: ${rent.ResidentName}`);
            }
          }
        }
      }

    } catch (error) {
      console.error("❌ [CRON] Error in Daily WhatsApp Automation:", error.message);
    }
  });
};