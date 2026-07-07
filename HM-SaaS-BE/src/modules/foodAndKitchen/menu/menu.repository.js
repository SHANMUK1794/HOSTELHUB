import Menu from "./menu.model.js";

class MenuRepository {
  async findByMealTime(MealTime, branchName, tenantId) {
    const query = { MealTime, tenantId };
    if (branchName) query.branchName = branchName;
    return await Menu.findOne(query);
  }

  async findAll(branchName, tenantId) {
    const query = { tenantId };
    if (branchName) query.branchName = branchName;
    return await Menu.find(query);
  }

  async findById(filter) {
    return await Menu.findOne(filter);
  }

  async create(menuData) {
    const menu = new Menu(menuData);
    return await menu.save();
  }

  async updateByMealTime(MealTime, branchName, normalizedMenu, tenantId) {
    const query = { MealTime, tenantId };
    if (branchName) query.branchName = branchName;
    return await Menu.findOneAndUpdate(
      query,
      { $set: { Menu: normalizedMenu } },
      { new: true, runValidators: true }
    );
  }

  async deleteById(filter) {
    return await Menu.findOneAndDelete(filter);
  }
}

export default new MenuRepository();