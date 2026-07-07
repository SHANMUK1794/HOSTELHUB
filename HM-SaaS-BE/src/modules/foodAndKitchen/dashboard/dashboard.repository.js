import summarySchema from "../kitchenSummary/summary.model.js";

class DashRepository {
  async getFoodSummaries(tenantId, branchName, start, end) {
    
    return await summarySchema.find({
      tenantId,
      branchName,
      date: { $gte: start, $lte: end }
    });
  }
}

export default new DashRepository();