import Service from "./ebill.service.js";
import Repository from "./ebill.repository.js";
// import room from "../../../models/room.js";
import room from "../../roomAndResidents/Room&Residence.model.js";
import register from "../../register/register.model.js";
import { sendWhatsappMessageremainder } from "../../../utils/whatsapp.js";

// Define monthMap so it is accessible within the controller functions
const monthMap = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

class ElectricityBillController {
  async addBill(req, res) {
    try {
      const data = await Service.addBills(req.body, req.user, req.tenantId);
      res
        .status(201)
        .json({ message: "Electricity bills added successfully.", data, succes:true });
    } catch (error) {
      console.error("Add bill error:", error);
      res.status(500).json({ message: error.message , success:false});
    }
  }

  async getAllBills(req, res) {
    try {
      const data = await Service.getBills(req.query, req.user, req.tenantId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Get bills error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateBill(req, res) {
    try {
      const data = await Service.updateBill(req.params.id, req.body, req.tenantId);
      res
        .status(200)
        .json({ success: true, message: "Updated successfully.", data });
    } catch (error) {
      console.error("Update bill error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }


  async deleteBill(req, res) {
    try {
      const bill = await Repository.findById({ _id: req.params.id, tenantId: req.tenantId });
      if (!bill) return res.status(404).json({ message: "Bill not found" });

      const { role } = req.user;
      const branchName =
        role === "Admin" ? req.body.branchName : req.user.branchName;

      if (role === "Warden" && bill.branchName !== branchName) {
        return res
          .status(403)
          .json({
            message: "Access Denied: Cannot delete bills from other branches",
            success: false
          });
      }

      // 👉 FIXED: Pass req.user context to document soft delete parameters
      await Service.deleteBillService(req.params.id, req.user, req.tenantId);
      res.status(200).json({ success: true, message: "Bill safely moved to Recycle Bin." });
    } catch (error) {
      console.error("Delete bill error:", error);
      res.status(500).json({ success: false, message: error.message || "Server error." });
    }
  }

  async getRoomData(req, res) {
    try {
      const { RoomNo, branchName, Month, Year } = req.query;

      const targetRoom = await room.findOne({ RoomNo, branchName, tenantId: req.tenantId });
      if (!targetRoom) {
        return res
          .status(404)
          .json({ success: false, message: "Room not found" });
      }

      const now = new Date();
      // Normalize Month and Year
      let currentMonth = Month
        ? Month.toLowerCase()
        : now.toLocaleString("default", { month: "long" }).toLowerCase();
      let currentYear = Year ? parseInt(Year) : now.getFullYear();

      const monthNames = Object.keys(monthMap);
      let currentMonthIndex = monthMap[currentMonth];

      if (currentMonthIndex === undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid month name provided" });
      }

      // Calculate Previous Month/Year
      let prevIdx = currentMonthIndex - 1;
      let prevYear = currentYear;
      if (prevIdx < 0) {
        prevIdx = 11;
        prevYear -= 1;
      }
      const prevMonthName = monthNames[prevIdx];

      // Fetch previous bill from repository
      const prevBill = await Repository.findOne({
        RoomNo,
        branchName,
        Month: prevMonthName,
        Year: prevYear,
        tenantId: req.tenantId,
      });

      // Calculate Total (Rent + Reg Fee + Deposit + EB Deposit)
      const RegistrationFee = 500;
      const EBDeposit = 1000;
      const totalCost =
        targetRoom.Rate + RegistrationFee + targetRoom.Rate + EBDeposit;

      res.status(200).json({
        success: true,
        message: "Total and Previous month fetched.",
        total: totalCost,
        previousMonth: prevBill?.CurrentMonth || 0,
        previousMonthName: prevMonthName,
        previousYear: prevYear,
      });
    } catch (error) {
      console.error("getRoomData error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async sendManualReminder(req, res) {
    try {
      const { UserID, UserName, Month, total } = req.body;
      const user = await register.findOne({ _id: UserID, tenantId: req.tenantId });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const numberToSend = user.SameAsWhatsapp ? user.MobileNo : user.Whatsapp;
      if (!numberToSend)
        return res
          .status(400)
          .json({ success: false, message: "No WhatsApp number" });

      const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await sendWhatsappMessageremainder(
        numberToSend,
        UserName,
        Month,
        total,
        formattedDate,
      );
      res
        .status(200)
        .json({ success: true, message: "Reminder sent successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async sendGroupMessage(req, res) {
    try {
      await Service.sendRoomWhatsapp(req.body.RoomNo, req.body.Month, req.user, req.tenantId);
      res
        .status(200)
        .json({
          success: true,
          message: "WhatsApp messages sent to all users in room.",
        });
    } catch (error) {
      res.status(500).json({ message: error.message, success:true });
    }
  }
}

export default new ElectricityBillController();
