import Advance from "./advance.model.js";

class AdvanceRepository {
  async findByEmployeeId(employeeId, tenantId) {
    return await Advance.findOne({ employee_id: employeeId, tenantId });
  }

  async findById(filter) {
    return await Advance.findOne(filter);
  }

  async findAll(query) {
    return await Advance.find(query).sort({ updatedAt: -1 });
  }

  async create(data) {
    return await Advance.create(data);
  }

  async deleteOne(id) {
    return await Advance.deleteOne({ _id: id });
  }
}

export default new AdvanceRepository();
