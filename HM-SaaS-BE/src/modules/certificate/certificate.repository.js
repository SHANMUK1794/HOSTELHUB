import Certificate from "./certificate.model.js";

export const createCertificate = async (data) => {
  return await Certificate.create(data);
};
export const findCertificate = async (query) => {
  return await Certificate.findOne(query);
};
export const findCertificateById = async (filter) => {
  return await Certificate.findOne(filter);
};
export const findCertificates = async (query) => {
  return await Certificate.find(query);
};
export const updateCertificateById = async (filter, updateData) => {
  return await Certificate.findOneAndUpdate(
    filter,
    { $set: updateData },
    { new: true },
  );
};
export const deleteCertificateById = async (filter) => {
  return await Certificate.findOneAndDelete(filter);
};
export const deleteCertificates = async (query) => {
  return await Certificate.deleteMany(query);
};
