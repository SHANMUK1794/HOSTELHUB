import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  // Multi-tenant isolation
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  date: { type: Date, required: true },
  branchName: { type: String, required: true },
  attendanceList: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      foodType: String,
      status: Boolean,
      roomNo: String
    }
  ]
});

attendanceSchema.index({ tenantId: 1, branchName: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);