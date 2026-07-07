

import Service from "./roomRent.service.js";

class RoomRentController {
  async createRoomRent(req, res) {
    try {
      const data = await Service.createRoomRent(req.body, req.user, req.tenantId);
      res.status(201).json({
        success: true,
        message: "Room Rent created successfully.",
        data,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
async addInstallment(req, res) {
    try {
      const { id } = req.params;
      const data = await Service.addInstallment(id, req.body, req.user, req.tenantId);

      res.status(200).json({
        success: true,
        message: "Installment payment processed successfully.",
        data,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async getalluserRent(req, res) {
    try {
      const users = await Service.getAllRents(req.query, req.user, req.tenantId);
      if (!users.length)
        return res
          .status(200)
          .json({ success: true, message: "No user found", data: [] });
      res.status(200).json({
        success: true,
        message: "Records retrieved successfully",
        data: users,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async deleteRoomRent(req, res) {
    try {
      // 👉 FIXED: Added missing await keyword here
      await Service.deleteRent(req.params.id, req.user, req.tenantId);
      res
        .status(200)
        .json({ success: true, message: "Record safely moved to Recycle Bin." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async exportExcel(req, res) {
    try {
      const buffer = await Service.generateExcelBuffer(req.query, req.user, req.tenantId);
      const branch = req.query.branchName || "All";
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Room_Deposit_${branch}.xlsx"`,
      );
      res.end(buffer);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async bulkImport(req, res) {
    try {
      const result = await Service.bulkImport(req.file, req.tenantId);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async updateRoomRent(req, res) {
    try {
      const { id } = req.params;
      // 👉 FIXED: Added missing await keyword here as well
      const data = await Service.updateRoomRent(id, req.body, req.user, req.tenantId);

      res.status(200).json({
        success: true,
        message: "Room rent updated successfully.",
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RoomRentController();