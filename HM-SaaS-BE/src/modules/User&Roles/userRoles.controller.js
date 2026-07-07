import * as service from "./userRoles.service.js";

export const createEmployee = async (req, res) => {
  try {
    // 1. Forcefully attach the logged-in Admin's ID to the payload
    const admin_id = req.user?._id;
    if (!admin_id) {
      return res.status(401).json({ success: false, message: "Unauthorized Admin" });
    }

    const payload = { ...req.body, admin_id };
    await service.createEmployee(payload, req.tenantId);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
      error: error.statusCode ? undefined : error.message,
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    // 2. Inject admin_id into the query. The service must use this to filter the DB.
    const admin_id = req.user?._id;
    if (!admin_id) {
      return res.status(401).json({ success: false, message: "Unauthorized Admin" });
    }

    const secureQuery = { ...req.query, admin_id };
    const result = await service.getAllEmployees(secureQuery, req.tenantId);

    if (result.branchMissing) {
      return res.status(200).json({
        success: true,
        message: "branchName is required.",
      });
    }

    return res.status(200).json({
      success: true,
      employees: result.employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      data: error,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    // 3. Pass the admin_id so the service can verify ownership before updating
    const admin_id = req.user?._id;
    if (!admin_id) {
      return res.status(401).json({ success: false, message: "Unauthorized Admin" });
    }

    const payload = { ...req.body, admin_id };
    const updatedEmployee = await service.updateEmployee(
      req.params.id.trim(),
      payload,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: "Employee data updated successfully.",
      data: {
        staffName: updatedEmployee.staffName,
        role: updatedEmployee.role,
        shift: updatedEmployee.shift,
        username: updatedEmployee.username,
        phoneNo: updatedEmployee.phoneNo,
        branchName: updatedEmployee.branchName,
      },
    });
  } catch (error) {
    console.error("Update employee error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    // 4. Already securely passing req.user._id to the service
    const employee = await service.deleteEmployee(req.params.id, req.user?._id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Employee moved to Trash successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Soft Delete Employee Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal Server Error",
      error: error.message,
    });
  }
};