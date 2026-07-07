import * as fundService from "./fund.service.js";

export const createIncomingFund = async (req, res) => {
  try {
    const data = await fundService.createFund(req.body, req.user, req.tenantId);
    res
      .status(201)
      .json({
        success: true,
        message: "Incoming fund created successfully",
        data,
      });
  } catch (error) {
    const status = error.message.includes("missing") ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const getIncomingFundWithTotal = async (req, res) => {
  try {
    const result = await fundService.getFunds(req.user, req.query, req.tenantId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIncomingFund = async (req, res) => {
  try {
    const data = await fundService.updateFund(req.params.id, req.body, req.tenantId);
    res
      .status(200)
      .json({
        success: true,
        message: "Incoming fund updated successfully",
        data,
      });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const deleteIncomingFund = async (req, res) => {
  try {
    await fundService.deleteFund(req.params.id, req.user, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Incoming fund successfully moved to Recycle Bin" });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

