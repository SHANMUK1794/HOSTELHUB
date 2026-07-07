import dashRepository from "./dashboard.repository.js";
import menuschema from "../menu/menu.model.js";

class DashService {
  // Helper to force Date to UTC Midnight
  parseDateUTC(rawDate) {
    const d = new Date(rawDate);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
  }

  async getBranchFoodSummary(tenantId, branchName, normalizedDate) {
    const startOfDay = normalizedDate;
    const endOfDay = new Date(normalizedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const summaries = await dashRepository.getFoodSummaries(
      tenantId,
      branchName,
      startOfDay,
      endOfDay,
    );

    let totalVeg = 0;
    let totalNonVeg = 0;

    summaries.forEach((s) => {
      totalVeg += s.totalVeg || 0;
      totalNonVeg += s.totalNonVeg || 0;
    });

    return {
      branchName,
      totalVeg,
      totalNonVeg,
      totalPresent: totalVeg + totalNonVeg,
    };
  }

  async getTodayKitchenSummary(date, mealTime, branchName, tenantId) {
    // 1. Normalize Date
    const normalizedDate = this.parseDateUTC(date);
    const inputDate = new Date(date);
    const dayName = inputDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });

    // 2. Safely Fetch Menu Dishes & KEEP CATEGORIES SPLIT
    const allMenus = await menuschema.find({ tenantId, branchName });
    const normalizedRequest = String(mealTime).replace(/\s+/g, "").toLowerCase();

    const matchedMenu = allMenus.find((m) => {
      if (!m.MealTime) return false;
      const normalizedDbTime = String(m.MealTime).replace(/\s+/g, "").toLowerCase();
      return normalizedDbTime === normalizedRequest;
    });

    // 🛠️ FIX: Default to an Object with strictly separated Veg and NonVeg arrays
    let safeDish = { Veg: [], NonVeg: [] };

    if (matchedMenu && Array.isArray(matchedMenu.Menu)) {
      const matchedDay = matchedMenu.Menu.find((m) => m.day && String(m.day).toLowerCase() === dayName.toLowerCase());
      if (matchedDay && matchedDay.dish) {
         safeDish.Veg = matchedDay.dish.Veg || [];
         safeDish.NonVeg = matchedDay.dish.NonVeg || [];
      }
    }

    // 3. Fetch Summaries per branch
    const branchSummary = await this.getBranchFoodSummary(tenantId, branchName, normalizedDate);

    // 4. Calculate Overall Totals (now just the specific branch)
    const totals = {
      totalVeg: branchSummary.totalVeg,
      totalNonVeg: branchSummary.totalNonVeg,
      totalPresent: branchSummary.totalPresent,
    };

    // 5. Final response
    return {
      day: dayName,
      dish: safeDish, // 🟢 Frontend will now receive the exact { Veg: [...], NonVeg: [...] } object
      branches: { [branchName]: branchSummary },
      totals,
    };
  }
}

export default new DashService();