import menuRepository from "./menu.repository.js";

class MenuService {
  async createMenu(MealTime, branchName, menuData, tenantId) {
    const existMenu = await menuRepository.findByMealTime(MealTime, branchName, tenantId);
    if (existMenu) throw new Error("ALREADY_EXISTS");
    if (!Array.isArray(menuData) || menuData.length === 0) throw new Error("INVALID_DATA");

    const safeMenu = menuData.map(item => ({
      day: item.day,
      dish: {
        Veg: Array.isArray(item.dish?.Veg) ? item.dish.Veg : [],
        NonVeg: Array.isArray(item.dish?.NonVeg) ? item.dish.NonVeg : []
      }
    }));
    return await menuRepository.create({ MealTime, branchName, Menu: safeMenu, tenantId });
  }

  async getAllMenus(branchName, tenantId) {
    return await menuRepository.findAll(branchName, tenantId);
  }

  async deleteMenu(id, tenantId) {
    return await menuRepository.deleteById({ _id: id, tenantId });
  }

  async getTodayMenu(requestedMealTime = null, specificDayName = null, branchName, tenantId) {
    const todayName = specificDayName || new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });
    const menus = await menuRepository.findAll(branchName, tenantId);

    if (requestedMealTime) {
      let responseDish = { Veg: [], NonVeg: [] };
      
      // 🛡️ CRASH FIX: Force String() conversion to prevent TypeErrors
      const normalizedRequest = String(requestedMealTime).replace(/\s+/g, "").toLowerCase();

      const menuForTime = menus.find((m) => {
        if (!m.MealTime) return false;
        const normalizedDbTime = String(m.MealTime).replace(/\s+/g, "").toLowerCase();
        return normalizedDbTime === normalizedRequest;
      });

      if (menuForTime && Array.isArray(menuForTime.Menu)) {
        const dayItem = menuForTime.Menu.find((m) => m.day && String(m.day).toLowerCase() === todayName.toLowerCase());
        if (dayItem && dayItem.dish) {
          responseDish.Veg = dayItem.dish.Veg || [];
          responseDish.NonVeg = dayItem.dish.NonVeg || [];
        }
      }
      return { data: responseDish, day: todayName, isSummary: false };
    }

    let mealsResult = { Breakfast: { Veg: [], NonVeg: [] }, Lunch: { Veg: [], NonVeg: [] }, Dinner: { Veg: [], NonVeg: [] } };

    menus.forEach((menuDoc) => {
      if (!menuDoc.MealTime) return;
      let mealType = String(menuDoc.MealTime).replace(/\s+/g, ""); 
      mealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);

      if (Array.isArray(menuDoc.Menu) && mealsResult[mealType]) {
        const dayItem = menuDoc.Menu.find((item) => item.day && String(item.day).toLowerCase() === todayName.toLowerCase());
        if (dayItem && dayItem.dish) {
          mealsResult[mealType].Veg = dayItem.dish.Veg || [];
          mealsResult[mealType].NonVeg = dayItem.dish.NonVeg || [];
        }
      }
    });

    return { day: todayName, meals: mealsResult, isSummary: true };
  }
  
  async updateMenu(MealTime, branchName, menuData, tenantId) {
    const exist = await menuRepository.findByMealTime(MealTime, branchName, tenantId);

    const safeFormat = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        if (typeof item === "string") return { name: item, image: "" };
        if (typeof item === "object" && item !== null) return { name: item.name || "Unnamed Dish", image: item.image || "" };
        return null;
      }).filter(item => item !== null); 
    };

    const normalizedMenu = menuData.map((day) => ({
      day: day.day,
      dish: { Veg: safeFormat(day.dish?.Veg), NonVeg: safeFormat(day.dish?.NonVeg) }
    }));

    if (!exist) {
      return await menuRepository.create({ MealTime, branchName, Menu: normalizedMenu, tenantId });
    }

    const normalizedExistMenu = exist.Menu.map((day) => ({
      day: day.day,
      dish: { Veg: safeFormat(day.dish?.Veg), NonVeg: safeFormat(day.dish?.NonVeg) }
    }));

    const isSameMenu = normalizedExistMenu.every((oldDay, index) => {
      const newDay = normalizedMenu[index];
      if (!newDay || oldDay.day !== newDay.day) return false;
      if (oldDay.dish.Veg.length !== newDay.dish.Veg.length) return false;
      if (oldDay.dish.NonVeg.length !== newDay.dish.NonVeg.length) return false;

      const matchVeg = oldDay.dish.Veg.every((dishItem, i) => {
        const newName = newDay.dish.Veg[i]?.name || "";
        const newImg = newDay.dish.Veg[i]?.image || "";
        return (dishItem.name.trim().toLowerCase() === newName.trim().toLowerCase()) && (dishItem.image === newImg);
      });

      const matchNonVeg = oldDay.dish.NonVeg.every((dishItem, i) => {
        const newName = newDay.dish.NonVeg[i]?.name || "";
        const newImg = newDay.dish.NonVeg[i]?.image || "";
        return (dishItem.name.trim().toLowerCase() === newName.trim().toLowerCase()) && (dishItem.image === newImg);
      });

      return matchVeg && matchNonVeg;
    });

    if (isSameMenu) throw new Error("NO_CHANGES");
    return await menuRepository.updateByMealTime(MealTime, branchName, normalizedMenu, tenantId);
  }
}

export default new MenuService();