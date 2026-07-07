import * as repo from "./vacationform.repository.js";

// ================= HELPER =================

const parseDate = (input) => {
  if (!input) return null;

  if (
    typeof input === "string" &&
    input.includes("/")
  ) {
    const [dd, mm, yyyy] = input
      .split("/")
      .map(Number);

    return new Date(
      Date.UTC(yyyy, mm - 1, dd)
    );
  }

  return new Date(input);
};

// ================= CREATE =================

export const createVacationForm = async (
  user,
  body,
  tenantId
) => {
  const {
    role,
    branchName: userBranch,
  } = user;

  const {
    applicationname,
    roomno,
    floorno,
    roomtype,
    dateofapply,
    vacatedate,
    mobile,
  } = body;

  const branchName =
    role === "Admin"
      ? body.branchName
      : userBranch;

  // ================= REQUIRED VALIDATION =================

  if (
    !applicationname ||
    !roomtype ||
    !vacatedate ||
    !mobile ||
    !branchName
  ) {
    throw new Error(
      "Required fields are missing"
    );
  }

  // ================= FIND USER =================

  let userData = null;
  let userSource = null;

  // ================= TRY PG USER =================

  userData = await repo.findPGUserRepo({
    MobileNo: mobile,
    branchName,
    tenantId,
  });

  if (userData) {
    userSource = "PG";
  }

  // ================= TRY REGISTER USER =================

  if (!userData) {
    userData = await repo.findUserRepo({
      MobileNo: mobile,
      branchName,
      tenantId,
    });
    if (userData) {
      userSource = "Resident";
    }
  }

  // ================= USER NOT FOUND =================

  if (!userData) {
    throw new Error(
      "User not found or not staying"
    );
  }

  // ================= CHECK STATUS =================

  const currentStatus = String(
    userData.status || ""
  )
    .trim()
    .toLowerCase();

  // allow old data + active users

  if (
    currentStatus === "vacated"
  ) {
    throw new Error(
      "User already vacated"
    );
  }

  // ================= FIX OLD DATA =================

  if (!userData.RoomNo) {
    userData.RoomNo =
      roomno || "OLD-DATA";
  }

  if (!userData.FloorNo) {
    userData.FloorNo =
      floorno || "-";
  }

  if (
    userData.Deposit === undefined ||
    userData.Deposit === null
  ) {
    userData.Deposit = 0;
  }

  // ================= RESOLVE ROOM TYPE =================

  // For Register users, use their actual RoomType (AC/Non-AC).
  // For PG users (no RoomType field), use the form-submitted roomtype.
  const resolvedRoomType =
    userData.RoomType || roomtype || "PG";

  // ================= CREATE VACATION =================

  const form =
    await repo.createVacationFormRepo({
      applicationname,

      roomno:
        roomno &&
        roomno !== "null"
          ? roomno
          : userData.RoomNo ||
            "Old Data",

      floorno:
        floorno &&
        floorno !== "-" &&
        floorno !== "null"
          ? floorno
          : userData.FloorNo ||
            "Old Data",

      roomtype: resolvedRoomType,
      userType: userSource,

      dateofapply:
        dateofapply ||
        new Date(),

      vacatedate:
        parseDate(vacatedate),

      branchName,
      tenantId,

      mobile,
    });

  // ================= UPDATE USER =================

  userData.status = "vacating";

  userData.vacatedate = parseDate(vacatedate);

  // Set staying to false unconditionally so it appears in inactive sections
  userData.staying = false;

  await repo.saveUserRepo(userData);

  return form;
};

// ================= DELETE =================

export const deleteVacationForm = async (
  user,
  id,
  tenantId
) => {
  if (
    user.role !== "Admin" &&
    user.role !== "Warden"
  ) {
    throw new Error("Access Denied");
  }

  const form =
    await repo.findFormByIdRepo({ _id: id, tenantId });

  if (!form) {
    throw new Error(
      "Vacation form not found"
    );
  }

  let userData = null;

  // ================= TRY PG USER =================

  userData = await repo.findPGUserRepo({
    MobileNo: form.mobile,
    branchName: form.branchName,
    tenantId,
  });

  // ================= TRY REGISTER USER =================

  if (!userData) {
    userData = await repo.findUserRepo({
      MobileNo: form.mobile,
      branchName: form.branchName,
      tenantId,
    });
  }

  if (userData) {
    userData.status = "staying";
    userData.vacatedate = null;
    userData.staying = true;
    await repo.saveUserRepo(userData);
  }

  await repo.deleteFormRepo({ _id: id, tenantId });

  return userData;
};

// ================= GET =================

export const getVacationForms = async (
  user,
  query,
  tenantId
) => {
  const {
    role,
    branchName: userBranch,
  } = user;

  const {
    filter = "all",
    branchName: queryBranch,
  } = query;

  const branchName =
    role === "Admin"
      ? queryBranch || userBranch
      : userBranch || queryBranch;

  if (!branchName) {
    throw new Error(
      "Branch name is required"
    );
  }

  const validFilters = [
    "all",
    "vacating",
    "vacated",
  ];

  if (
    !validFilters.includes(
      filter.toLowerCase()
    )
  ) {
    throw new Error("Invalid filter");
  }

  const dbQuery = { branchName, tenantId };

  if (filter === "vacating") {
    dbQuery.status = "Pending";
  }

  if (filter === "vacated") {
    dbQuery.status = "Vacated";
  }

  return repo.getFormsRepo(dbQuery);
};

// ================= UPDATE =================

export const updateVacationForm = async (
  user,
  id,
  body,
  tenantId
) => {
  if (
    user.role !== "Admin" &&
    user.role !== "Warden"
  ) {
    throw new Error("Access Denied");
  }

  const form =
    await repo.findFormByIdRepo({ _id: id, tenantId });

  if (!form) {
    throw new Error(
      "Vacation form not found"
    );
  }

  const parsedDate = parseDate(
    body.vacatedate
  );

  if (
    parsedDate &&
    parsedDate < form.dateofapply
  ) {
    throw new Error(
      "Invalid vacate date"
    );
  }

  return repo.updateFormRepo({ _id: id, tenantId }, {
    ...form._doc,
    ...body,
    vacatedate:
      parsedDate || form.vacatedate,
  });
};