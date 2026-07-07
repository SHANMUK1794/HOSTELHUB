import Settings from "./settings.model.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ tenantId: req.tenantId });
    if (!settings) settings = await Settings.create({ tenantId: req.tenantId });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { tenantId: req.tenantId },
      { $set: req.body },
      { new: true, upsert: true },
    );
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
