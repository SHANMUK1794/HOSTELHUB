

import * as reminderRepository from "./reminder.repository.js";
import { sendWhatsappMessageBirthday, sendCustomMessage } from "../../utils/whatsapp.js";
import Notification from "../notification/notification.model.js";
import Tenant from "../tenant/tenant.model.js";

/* =========================================================
   NORMALIZE USERS (Students + Employees)
========================================================= */
export const normalizeUsers = (students, employees) => {
  const studentList = students.map(s => ({
    role: "student",
    Name: s.Name,
    RoomNo: s.RoomNo || null,
    MobileNo: s.MobileNo,
    SameAsWhatsapp: s.SameAsWhatsapp,
    Whatsapp: s.Whatsapp,
    branchName: s.branchName,
    DateOfBirth: s.DateOfBirth
  }));

  const employeeList = employees.map(e => ({
    role: "employee",
    Name: e.Name,
    RoomNo: null,
    MobileNo: e.Mobile,
    SameAsWhatsapp: true,
    Whatsapp: e.Mobile,
    branchName: e.branchName,
    DateOfBirth: e.DOB
  }));

  return [...studentList, ...employeeList];
};

/* =========================================================
   TODAY BIRTHDAYS
========================================================= */
export const todayBirthDay = (users) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate();

  return users.filter(u => {
    if (!u.DateOfBirth) return false;
    
    let dobStr = u.DateOfBirth;
    let bMonth, bDay;
    
    // 🛠️ FIX: Safe parse for DD/MM/YYYY formats and YYYY-MM-DD
    if (typeof dobStr === "string") {
      if (dobStr.includes("/")) {
        const [day, month, year] = dobStr.split("/");
        bMonth = parseInt(month, 10);
        bDay = parseInt(day, 10);
      } else if (dobStr.includes("-")) {
        const [year, month, day] = dobStr.split("T")[0].split("-");
        bMonth = parseInt(month, 10);
        bDay = parseInt(day, 10);
      }
    } else if (dobStr instanceof Date) {
      bMonth = dobStr.getMonth() + 1;
      bDay = dobStr.getDate();
    }
    
    if (!bMonth || !bDay) return false;

    return bMonth === currentMonth && bDay === currentDay;
  });
};

/* =========================================================
   UPCOMING BIRTHDAYS (NEXT 7 DAYS)
========================================================= */
export const upcomingBirthdays = (users) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return users
    .filter(u => u.DateOfBirth)
    .map(user => {
      let dobStr = user.DateOfBirth;
      let bMonth, bDay;
      
      // 🛠️ FIX: Safe parse for DD/MM/YYYY formats and YYYY-MM-DD
      if (typeof dobStr === "string") {
        if (dobStr.includes("/")) {
          const [day, month, year] = dobStr.split("/");
          bMonth = parseInt(month, 10);
          bDay = parseInt(day, 10);
        } else if (dobStr.includes("-")) {
          const [year, month, day] = dobStr.split("T")[0].split("-");
          bMonth = parseInt(month, 10);
          bDay = parseInt(day, 10);
        }
      } else if (dobStr instanceof Date) {
        bMonth = dobStr.getMonth() + 1;
        bDay = dobStr.getDate();
      }

      if (!bMonth || !bDay) return null;

      // Create a Date object for this year's birthday
      let birthdayThisYear = new Date(today.getFullYear(), bMonth - 1, bDay);
      birthdayThisYear.setHours(0, 0, 0, 0);

      // If the birthday has already passed this year, look at next year
      if (birthdayThisYear < today) {
        birthdayThisYear.setFullYear(today.getFullYear() + 1);
      }

      const diffDays = Math.round((birthdayThisYear - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 30) return null;

      return {
        ...user,
        inDays: diffDays === 0 ? "Today" : `${diffDays} day(s)`,
        weekday: diffDays === 0 ? "Today" : birthdayThisYear.toLocaleDateString("en-US", { weekday: "long" }),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.inDays === "Today") return -1;
      if (b.inDays === "Today") return 1;
      return parseInt(a.inDays) - parseInt(b.inDays);
    });
};

/* =========================================================
   DASHBOARD HELPER
========================================================= */
export const getBirthDayData = async (branchName, tenantId) => {
  // 🛠️ THE FIX: Added 'staying: true' and 'isdeleted: false' to ignore vacated students!
  const studentQuery = branchName 
    ? { branchName, staying: true, isdeleted: false, tenantId } 
    : { staying: true, isdeleted: false, tenantId };
    
  const employeeQuery = branchName 
    ? { branchName, isdeleted: false, tenantId } 
    : { isdeleted: false, tenantId };

  const students = await reminderRepository.getStudents(studentQuery);
  const employees = await reminderRepository.getEmployees(employeeQuery);

  const allUsers = normalizeUsers(students, employees);

  const todayList = todayBirthDay(allUsers);
  const weekList = upcomingBirthdays(allUsers);

  if (todayList.length === 0 && weekList.length === 0) return null;

  return {
    first: todayList.length > 0 ? todayList[0] : null,
    count: todayList.length
  };
};

/* =========================================================
   DUPLICATE WHATSAPP PREVENTION (IN-MEMORY)
========================================================= */
let branchWishTracker = {};

/* =========================================================
   GET BIRTHDAYS & SEND REMINDERS
========================================================= */
export const getBirthdaysService = async (reqUser, queryBranchName, tenantId) => {
  const { role } = reqUser;

  const branchName =
    role === "Admin"
      ? queryBranchName?.trim()
      : reqUser.branchName?.trim();

  if (!branchName) {
    throw new Error("Branch name not specified");
  }

  // Load users
  const students = await reminderRepository.getStudents({
    branchName,
    staying: true,
    isdeleted: false,
    tenantId
  });

  const employees = await reminderRepository.getEmployees({
    branchName,
    isdeleted: false,
    tenantId
  });

  const allUsers = normalizeUsers(students, employees);

  const weekListAll = upcomingBirthdays(allUsers);
  const todayList = weekListAll.filter(b => b.inDays === "Today");
  const weekList = weekListAll.filter(b => b.inDays !== "Today");

  if (weekListAll.length === 0) {
    return {
      success: false,
      message: "No birthdays in the next 30 days",
      todayCount: 0,
      data: [],
      weekList: []
    };
  }

  /* ===== WhatsApp Deduplication ===== */
  const todayKey = new Date().toISOString().split("T")[0];
  const tracker =
    branchWishTracker[branchName] || { lastDate: null, sent: false };

  if (tracker.lastDate !== todayKey) {
    tracker.lastDate = todayKey;
    tracker.sent = false;
  }

  if (!tracker.sent && todayList.length > 0) {
    for (const user of todayList) {
      const number = user.SameAsWhatsapp
        ? user.MobileNo
        : user.Whatsapp;

      if (number) {
        try {
          await sendWhatsappMessageBirthday(number, user.Name);
        } catch (err) {
          console.warn(`WhatsApp failed for ${user.Name}: ${err.message}`);
        }
      }
    }
    tracker.sent = true;
    branchWishTracker[branchName] = tracker;
  }

  return {
    success: true,
    message: "🎂 Upcoming Birthdays (Next 30 Days)",
    todayCount: todayList.length,
    data: todayList,
    weekList
  };
};

/* =========================================================
   SEND CUSTOM MESSAGE
========================================================= */
export const sendCustomMessageService = async ({ type, branchName, staffType, message }, tenantId) => {
  let recipients = [];

  // 1️⃣ ALL STUDENT ANNOUNCEMENTS (Festival Wishes)
  if (type === "all") {
    const students = await reminderRepository.getStudents({
      staying: true,
      // status: "staying",
      isdeleted: false,
      tenantId,
    });
    recipients = students.map((s) => s.Whatsapp).filter(Boolean);
  }
  // 2️⃣ HOSTEL-SPECIFIC MESSAGE (Maintenance)
  else if (type === "branch") {
    const students = await reminderRepository.getStudents({
      branchName: branchName,
      staying: true,
      status: "staying",
      tenantId
    });
    recipients = students.map((s) => s.Whatsapp).filter(Boolean);
  }
  // 3️⃣ STAFF MESSAGES
  else if (type === "staff") {
    // Send to warden
    if (staffType === "warden") {
      const wardens = await reminderRepository.getUsers({ role: "Warden", tenantId });
      recipients = wardens.map((u) => u.phoneNo).filter(Boolean);
    }
    // Send to chef
    else if (staffType === "chef") {
      const chefs = await reminderRepository.getUsers({ role: "Chef", tenantId });
      recipients = chefs.map((u) => u.phoneNo).filter(Boolean);
    }
    // Send to working employees
    else if (staffType === "employees") {
      const empList = await reminderRepository.getEmployees({ tenantId });
      recipients = empList.map((e) => e.Mobile).filter(Boolean);
    }
  }

  if (recipients.length === 0) {
    return {
      success: false,
      message: "No recipients found for this message type.",
      count: 0
    };
  }

  // Send WhatsApp Message to all recipients
  for (const number of recipients) {
    try {
      await sendCustomMessage(number, message);
    } catch (err) {
      console.warn(`Failed for ${number}: ${err.message}`);
    }
  }

  try {
    let branchesToNotify = [];
    if (branchName) {
      branchesToNotify = [branchName];
    } else {
      const tenantDoc = await Tenant.findById(tenantId);
      if (tenantDoc && tenantDoc.branches) {
        branchesToNotify = tenantDoc.branches;
      }
    }

    for (const bName of branchesToNotify) {
      const newNotification = new Notification({
        tenantId,
        branchName: bName,
        type: "custom",
        message: message,
        date: new Date(),
      });
      await newNotification.save();
    }
  } catch (err) {
    console.error("Failed to save notification:", err.message);
  }

  return {
    success: true,
    message: `Message sent successfully to ${recipients.length} recipients.`,
    count: recipients.length
  };
};
