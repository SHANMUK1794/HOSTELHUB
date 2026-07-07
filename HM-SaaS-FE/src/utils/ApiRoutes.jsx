import axiosInstance from "./AxiosInstance";

const BASE_URL = axiosInstance.defaults.baseURL;

const ApiRoutes = {
  USERS: {
    LOGIN: "/api/users/v1/login",
    SIGNUP: "/api/users/v1/signup",
    RESET_PASSWORD: "/api/users/v1/reset-password",
    SEND_OTP: "/api/users/v1/send-otp",
    VERIFY_OTP: "/api/users/v1/verify-otp",
  },

  SETTINGS: {
    GET: "/api/settings/v1",
    UPDATE: "/api/settings/v1",
  },

  DASHBOARD: {
    GET_BY_BRANCH: (branchName) => `/api/v1/dashboard?branchName=${branchName}`,
    GET_BY_BRANCH_WITH_DATE: (branchName, year, month) =>
      `/api/v1/dashboard?branchName=${branchName}&year=${year}&month=${month}`,
  },

  ACHIEVEMENTS: {
    GET_ALL: (branchName) =>
      `/api/achievements/v1/all?branchName=${branchName}`,
    GET_ALL_WARDEN: "/api/achievements/v1/all",
    ADD: "/api/achievements/v1/add",
    DELETE: (id) => `/api/achievements/v1/delete/${id}`,
    UPDATE: (id) => `/api/achievements/v1/update/${id}`,
  },

  ATTENDANCE: {
    GET_ROOM_DATA: (date, branchName) => {
      const query = new URLSearchParams({
        date,
        ...(branchName && { branchName }),
      }).toString();
      return `/api/attendance/v1/room-data?${query}`;
    },
    SUBMIT: "/api/attendance/v1/rooms-with-users",
    GET_USER_SUMMARY: "/api/attendance/v1/user",
  },

  TODAYMENU: {
    GET_TODAY_MENU: "/api/kitchen/v1/today",
  },

  CERTIFICATE: {
    GET_ALL: (branchName) => `/api/v1/certificate?branchName=${branchName}`,
    ADD: "/api/v1/certificate/add",
    UPDATE: (id) => `/api/v1/certificate/update/${id}`,
    DELETE: (id) => `/api/v1/certificate/delete/${id}`,
  },

  COMPLAINTS: {
    GET_BY_BRANCH: (branchName, year, month) =>
      `/api/v1/complaint?branchName=${branchName}&year=${year}&month=${month}`,
    GET_ALL: (year, month) => `/api/v1/complaint?year=${year}&month=${month}`, // for Warden
    ADD: "/api/v1/complaint/add",
    UPDATE: (id) => `/api/v1/complaint/update/${id}`,
    DELETE: (id) => `/api/v1/complaint/${id}`,
  },

  DAILY_EXPENSE: {
    GET_BY_BRANCH: (branchName, year, month) =>
      `/api/v1/daily_expense?branchName=${branchName}&year=${year}&month=${month}`,
    GET_ALL: (year, month) =>
      `/api/v1/daily_expense?year=${year}&month=${month}`, // for othe roles
    ADD: "/api/v1/daily_expense/add",
    UPDATE: (id) => `/api/v1/daily_expense/update/${id}`,
    DELETE: (id) => `/api/v1/daily_expense/${id}`,
  },
  EB: {
    GET_ALL: (year, month) =>
      `/api/electricity/v1/allbills?year=${year}&month=${month}`,
    GET_BY_BRANCH: (branchName, year, month) =>
      `/api/electricity/v1/allbills?branchName=${branchName}&year=${year}&month=${month}`,
    ADD: `/api/electricity/v1/addbill`,
    UPDATE: (id) => `/api/electricity/v1/updatebill/${id}`,
    DELETE: (id) => `/api/electricity/v1/deletebill/${id}`,
    SEND_REMINDER: `/api/electricity/v1/sendmesg`,
    GET_SUMMARY: (branchName, year, month) =>
      `${BASE_URL}/api/electricity/v1/export?branchName=${branchName}&year=${year}&month=${month}`,
  },

  EXPENSES: {
    GET_ALL: (year, month, branchName) =>
      `/api/expenses/v1/getallitems?year=${year || ""}&month=${month || ""}&branchName=${branchName || ""}`,
    ADD: "/api/expenses/v1/additem",
    UPDATE: (id) => `/api/expenses/v1/updateitem/${id}`,
    DELETE: (id) => `/api/expenses/v1/deleteitem/${id}`,
    GET_SUMMARY: (branchName, year, month) =>
      `${BASE_URL}/api/v1/daily_expense/export?branchName=${branchName}&year=${year}&month=${month}`,
  },

  FOOD_DISH: {
    GET_SUMMARY: "/api/kitchen/v1/dashMenu",
  },

  BIRTHDAYS: {
    GET_ALL: "/api/birthday/v1/getbirthday",

    GET_BY_BRANCH: (branchName) =>
      `/api/birthday/v1/getbirthday?branchName=${branchName}`,

    SEND_MESSAGE: "/api/birthday/v1/sendmessage",
  },
  INVENTORY: {
    GET_ALL: (year, month) =>
      `/api/inventory/v1/get-item?year=${year}&month=${month}`,
    GET_HISTORY: (year, month) =>
      `/api/inventory/v1/?year=${year}&month=${month}`,
    ADD: "api/inventory/v1/add",
    UPDATE: (id) => `api/inventory/v1/update/${id}`,
    DELETE: (id) => `api/inventory/v1/delete/${id}`,
    DELETE_BY_NAME: (itemName) => `/api/inventory/v1/inventory/${itemName}`,
    GET_SUMMARY: (year, month) =>
      `${BASE_URL}/api/inventory/v1/export?year=${year}&month=${month}`,
  },
  MENU: {
    GET: "/api/kitchen/v1/getMenu",
    CREATE: "/api/kitchen/v1/createMenu",
    UPDATE: "/api/kitchen/v1/updateMenu",
  },
  NOTIFY: {
    GET_BY_BRANCH: (branchName) =>
      `/api/v1/notify/get?branchName=${branchName}`,
    GET_ALL: `/api/v1/notify/get`,
    SEEN_SINGLE: (id) => `/api/v1/notify/seen/${id}`,
    SEEN_ALL: (branchName) =>
      `/api/v1/notify/seen-all?branchName=${branchName}`,
  },
  PAYROLL: {
    GET_ALL: (branchName, year, month) =>
      `/api/v1/payroll/all?branchName=${branchName}&year=${year}&month=${month}`,
    ADD: `/api/v1/payroll/add`,
    UPDATE: (id) => `/api/v1/payroll/update/${id}`,
    DELETE: (id) => `/api/v1/payroll/delete/${id}`,
    GET_SUMMAR: (branchName, year, month) =>
      `${BASE_URL}/api/v1/payroll/payroll/export?branchName=${branchName}&year=${year}&month=${month}`,
  },

  STAFF: {
    GET_ALL: (branchName) => `/api/staff/v1/get?branch=${branchName}`,
  },
  REGISTER: {
    GET_BY_BRANCH: (branchName, year, month) => {
      let url = `/api/register/v1/getalluser?branchName=${encodeURIComponent(branchName)}`;
      if (year && year !== "all") url += `&year=${year}`;
      if (month && month !== "all") url += `&month=${month}`;
      return url;
    },

    GET_BY_MOBILE: (MobileNo) => `/api/register/v1/mobile?MobileNo=${MobileNo}`,

    GET_ALL: (year, month) => {
      let url = `/api/register/v1/getalluser`;
      const params = [];
      if (year && year !== "all") params.push(`year=${year}`);
      if (month && month !== "all") params.push(`month=${month}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      return url;
    },

    ADD: `/api/register/v1/register`,
    DELETE: (id) => `/api/register/v1/delete/${id}`,
    UPDATE: (id) => `/api/register/v1/update/${id}`,
    DEACTIVATE: `/api/register/v1/deactive`,
  },
  ROOM_RENT: {
    GET: (branchName, year, month, role) => {
      if (role === "Warden")
        return `/api/payement/v1/getusersroomrent?year=${year}&month=${month}`;
      return `/api/payement/v1/getusersroomrent?branchName=${branchName}&year=${year}&month=${month}`;
    },
    CREATE: `/api/payement/v1/createroomrent`,
    UPDATE: (id) => `/api/payement/v1/updateroomrent/${id}`,
    DELETE: (id) => `/api/payement/v1/deleteroomrent/${id}`,
    GET_SUMMARY: (year, month, branchName) =>
      `${BASE_URL}/api/payement/v1/room-rent/deposit/export?year=${year}&month=${month}&branchName=${encodeURIComponent(branchName)}`,
  },
  ROOMS: {
    GET: (branchName, role) =>
      role === "Admin"
        ? `/api/rooms/v1/getrooms?branchName=${branchName}`
        : `/api/rooms/v1/getrooms`,
    CREATE: `/api/rooms/v1/createRoom`,
    UPDATE: (id) => `/api/rooms/v1/updateRoom/${id}`,
    DELETE: (id) => `/api/rooms/v1/deleteRoom/${id}`,
  },

  STAFF_ATTENDANCE: {
    FETCH: ({ date, branchName }) => {
      const query = new URLSearchParams({
        date,
        ...(branchName && { branchName }),
      }).toString();
      return `/api/staffAttendance/v1/staff-attendance?${query}`;
    },
    UPDATE: "/api/staffAttendance/v1/update-staff-attendance",
    SUMMARY: ({ branchName, year, month }) =>
      `/api/staffAttendance/v1/staff?branchName=${branchName}&year=${year}&month=${month}`,
  },

  STORE_ROOM: {
    GET: (year, month, branchName) =>
      `/api/v1/store_room_expense?year=${year}&month=${month}&branchName=${encodeURIComponent(branchName)}`,
    ADD: "/api/v1/store_room_expense/add",
    UPDATE: (id) => `/api/v1/store_room_expense/update/${id}`,
    DELETE: (id) => `/api/v1/store_room_expense/${id}`,
    GET_SUMMARY: (year, month) =>
      `${BASE_URL}/api/expenses/v1/export?year=${year}&month=${month}`,
  },
  STORE_ROOM_INVENTORY: {
    GET_ALL: (year, month, branchName) =>
      `/api/v1/store_room_inventory?year=${year}&month=${month}&branchName=${encodeURIComponent(branchName)}`,
    GET_HISTORY: (year, month, branchName) =>
      `/api/v1/store_room_inventory/get_item_history?year=${year}&month=${month}&branchName=${encodeURIComponent(branchName)}`,
    ADD: "/api/v1/store_room_inventory/add",
    UPDATE: (id) => `/api/v1/store_room_inventory/update/${id}`,
    DELETE: (id) => `/api/v1/store_room_inventory/${id}`,
    DELETE_ITEM: (itemName) =>
      `/api/v1/store_room_inventory/inventory/${itemName}`,
    GET_SUMMARY: (year, month) =>
      `${BASE_URL}/api/v1/store_room_inventory/export?year=${year}&month=${month}`,
  },
  EMPLOYEE: {
    GET_ALL: "/api/employee/v1/getallemployees",
    CREATE: "/api/employee/v1/createemployee",
    UPDATE: (id) => `/api/employee/v1/updateemployee/${id}`,
    DELETE: (id) => `/api/employee/v1/deleteemployee/${id}`,
  },

  ADVANCE: {
    GET_ALL: "/api/advance/v1/get",
    ADD: "/api/advance/v1/add",
    UPDATE: (id) => `/api/advance/v1/advance/${id}`,
    DELETE: (id) => `/api/advance/v1/advance/${id}`,
    HISTORY: (employeeId) => `/api/advance/v1/due/${employeeId}`,
    EXPORT: (branchName) =>
      `${BASE_URL}/api/advance/v1/export?branchName=${encodeURIComponent(branchName || "")}`,
  },

  WORKEREMPLOYEE: {
    GET_ALL: "/api/workers/v1/getallemployees",
    CREATE: "/api/workers/v1/createemployee",
    UPDATE: (id) => `/api/workers/v1/updateemployee/${id}`,
    DELETE: (id) => `/api/workers/v1/deleteemployee/${id}`,
    GET_STATS: (empId) =>
      `/api/staffAttendance/v1/staff-attendance/stats/${empId}`,
  },
  CYLINDER: {
    GET_ALL: "/api/cylinder/v1/get",
    ADD: "/api/cylinder/v1/add",
    UPDATE: (id) => `/api/cylinder/v1/update/${id}`,
    DELETE: (id) => `/api/cylinder/v1/delete/${id}`,
    EXPORT: (month, year) =>
      `${BASE_URL}/api/cylinder/v1/export?month=${month}&year=${year}`,
  },

  VACATIONFORM: {
    GET_ALL: "/api/vacationform/v1/get",
    CREATE: "/api/vacationform/v1/create",
    UPDATE: (id) => `/api/vacationform/v1/update/${id}`,
    DELETE: (id) => `/api/vacationform/v1/delete/${id}`,
  },
  REGISTERDELETE: {
    GET_ALL: "/api/deletes/v1/recent",
    RECOVER: "/api/deletes/v1/recover",
    DELETE: "/api/deletes/v1/delete",
    DELETE_ALL: "/api/deletes/v1/delete-all",
    DELETE_ALL_UNIVERSAL: "/api/deletes/v1/delete-all-universal",
  },

  PGDATA: {
    REGISTER: "/api/pgdata/v1/register",
    GET_ALL: "/api/pgdata/v1/getalluser",
    GET_BY_MOBILE: (MobileNo) => `/api/pgdata/v1/mobile?MobileNo=${MobileNo}`,
    UPDATE: (id) => `/api/pgdata/v1/update/${id}`,
    DELETE: (id) => `/api/pgdata/v1/delete/${id}`,
    DEACTIVE: (id) => `/api/pgdata/v1/deactive/${id}`,
    GET_SUMMARY: (branchName, year, month) =>
      `${BASE_URL}/api/pgdata/v1/export?branchName=${branchName}&year=${year}&month=${month}`,
    // `http://localhost:3000/api/pgdata/v1/export?branchName=${branchName}&year=${year}&month=${month}`,
  },
  AMOUNT: {
    GET_ALL: (branchName, year, month) =>
      `/api/funds/v1/get?branchName=${branchName}&year=${year}&month=${month}`,
    CREATE: "/api/funds/v1/create",
    UPDATE: (id) => `/api/funds/v1/update/${id}`,
    DELETE: (id) => `/api/funds/v1/delete/${id}`,
  },
  STORE_ROOM_EXPENSE: {
    GET_SUMMARY: (year, month) =>
      `${BASE_URL}/api/v1/store_room_expense/export?year=${year}&month=${month}`,
  },
};



export default ApiRoutes;