import ElectricityBill from "./ebill.model.js";

class ElectricityBillRepository {
  async create(data) {
    return await ElectricityBill.create(data);
  }

  async find(filter) {
    return await ElectricityBill.find(filter).lean();
  }

  async findOne(filter) {
    return await ElectricityBill.findOne(filter);
  }

  async findById(filter) {
    return await ElectricityBill.findOne(filter);
  }

  // Adjusted to use findById internally to support safe soft-delete pipelines
  async findLastSNo(tenantId) {
    return await ElectricityBill.findOne({ tenantId }).sort({ SNo: -1 });
  }
}

export default new ElectricityBillRepository();

