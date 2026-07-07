import DueTracker from "./dueTracker.model.js";

class DueTrackerRepository {
  async create(data) {
    return await DueTracker.create(data);
  }

  async findById(filter) {
    return await DueTracker.findOne(filter);
  }

  async findByEmployeeId(employeeId, tenantId) {
    return await DueTracker.find({ employee_id: employeeId, tenantId }).sort({
      createdAt: -1,
    });
  }

  async findLatestByEmployeeId(employeeId, tenantId) {
    return await DueTracker.findOne({ employee_id: employeeId, tenantId }).sort({
      date: -1,
    });
  }

  async findByIdAndDelete(filter) {
    return await DueTracker.findOneAndDelete(filter);
  }
}

export default new DueTrackerRepository();
