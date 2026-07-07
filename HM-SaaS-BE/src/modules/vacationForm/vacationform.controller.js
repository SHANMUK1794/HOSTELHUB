import * as service from "./vacationform.service.js";

// CREATE
export const createVacationForm = async (req, res) => {
  try {
    const data = await service.createVacationForm(req.user, req.body, req.tenantId);

    res.status(201).json({
      success: true,
      message:
        "Vacation form created successfully and user marked as 'vacating'.",
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteVacationForm = async (req, res) => {
  try {
    const userData = await service.deleteVacationForm(req.user, req.params.id, req.tenantId);

    res.status(200).json({
      success: true,
      message: userData
        ? userData.staying
          ? "Vacation form deleted and user status reverted to 'staying'."
          : "Vacation form deleted and user removed."
        : "Vacation form deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET
export const getVacationForms = async (req, res) => {
  try {
    const data = await service.getVacationForms(req.user, req.query, req.tenantId);

    res.status(200).json({
      success: true,
      message: "Vacation forms fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateVacationForm = async (req, res) => {
  try {
    const data = await service.updateVacationForm(
      req.user,
      req.params.id,
      req.body,
      req.tenantId
    );

    res.status(200).json({
      success: true,
      message: "Vacation form updated successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
