import cylinder from "./cylinder.model.js";

export const createCylinderRepo = (data) => cylinder.create(data);

export const getAllCylindersRepo = (filter) =>
  cylinder.find({ ...filter, isdeleted: { $ne: true } }).sort({ Bookingdate: 1 });

export const getCylinderByIdRepo = (id) =>
  cylinder.findById(id);

export const updateCylinderRepo = (id, updateData) =>
  cylinder.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

export const deleteCylinderRepo = (id, userId) =>
  cylinder.findByIdAndUpdate(
    id,
    {
      isdeleted: true,
      deletedinfo: { deleteddate: new Date(), deleteby: userId },
    },
    { new: true }
  );