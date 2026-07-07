import vacationForm from "./vacationform.model.js";

import register from "../register/register.model.js";

import pgdata from "../pgdata/pgdata.model.js";

// ================= CREATE =================

export const createVacationFormRepo = (
  data
) => {
  return vacationForm.create(data);
};

// ================= REGISTER USER =================

export const findUserRepo = (
  filter
) => {
  return register.findOne(filter);
};

// ================= PG USER =================

export const findPGUserRepo = (
  filter
) => {
  return pgdata.findOne(filter);
};

// ================= SAVE USER =================

export const saveUserRepo = (
  user
) => {
  return user.save();
};

// ================= FIND FORM =================

export const findFormByIdRepo = (
  filter
) => {
  return vacationForm.findOne(filter);
};

// ================= DELETE FORM =================

export const deleteFormRepo = (
  filter
) => {
  return vacationForm.findOneAndDelete(
    filter
  );
};

// ================= DELETE USER =================

export const deleteUserRepo = (
  filter
) => {
  return register.findOneAndDelete(filter);
};

// ================= GET FORMS =================

export const getFormsRepo = (
  query
) => {
  return vacationForm
    .find(query)
    .sort({
      dateofapply: -1,
    });
};

// ================= UPDATE FORM =================

export const updateFormRepo = (
  filter,
  data
) => {
  return vacationForm.findOneAndUpdate(
    filter,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ================= FIND ONE FORM =================

export const findOneFormRepo = (
  filter
) => {
  return vacationForm.findOne(filter);
};