import * as service from "./Room&Residence.service.js";

export const bulkImportRooms = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await service.bulkImportRooms(req.file.path, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Room bulk import completed",
      inserted: result.inserted,
      duplicates: result.duplicates,
      errors: result.errors,
    });
  } catch (err) {
    console.error("Bulk Import Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const data = await service.createRoom(req.user, req.body, req.tenantId);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error",
    });
  }
};

export const getallRoom = async (req, res) => {
  try {
    const  {rooms}  = await service.getAllRooms(req.user, req.body, req.query, req.tenantId);

    if (rooms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Room Found ",
        data: rooms,
      });
    }

    return res.status(200).json({
    success: true,
    data: rooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await service.updateRoom(req.user, req.params.id, req.body, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error",
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomToDelete = await service.deleteRoom(req.params.id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      data: roomToDelete,
    });
  } catch (error) {
    console.error("Soft Delete Room Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal Server Error",
      error: error.message,
    });
  }
};

export const recoverRoom = async (req, res) => {
  try {
    const deletedRoom = await service.recoverRoom(req.params.id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Room recovered successfully",
      data: deletedRoom,
    });
  } catch (error) {
    console.error("Recover Room Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal Server Error",
      error: error.message,
    });
  }
};

export const getDeletedRooms = async (req, res) => {
  try {
    const deletedRooms = await service.getDeletedRooms(req.user, req.body, req.query, req.tenantId);

    if (deletedRooms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Deleted Rooms Found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted Rooms Retrieved Successfully",
      data: deletedRooms,
    });
  } catch (error) {
    console.error("Get Deleted Rooms Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const permanentDeleteRoom = async (req, res) => {
  try {
    await service.permanentDeleteRoom(req.params.id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Room permanently deleted successfully",
    });
  } catch (error) {
    console.error("Permanent Delete Room Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal Server Error",
    });
  }
};

export const permanentDeleteAllRooms = async (req, res) => {
  try {
    const deletedCount = await service.permanentDeleteAllRooms(req.tenantId);

    return res.status(200).json({
      success: true,
      message: `Deleted ${deletedCount} rooms permanently`,
    });
  } catch (error) {
    console.error("Permanent Delete All Rooms Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal Server Error",
    });
  }
};
