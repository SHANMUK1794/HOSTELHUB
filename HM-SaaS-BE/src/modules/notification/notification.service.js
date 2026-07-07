import * as notifyRepo from "./notification.repository.js";
import certificate from "../certificate/certificate.model.js";
import * as reminderService from "../reminder/reminder.service.js";
import Tenant from "../tenant/tenant.model.js";

class NotificationService {
  async generateDailyNotifications(tenantId) {
    if (!tenantId) return;
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const tenantDoc = await Tenant.findById(tenantId);
    if (!tenantDoc) return;
    
    const branches = tenantDoc.branches || [];

    for (const branchName of branches) {
      const next7Days = new Date();
      next7Days.setDate(next7Days.getDate() + 7);

      const [birthdays, certificates] = await Promise.all([
        reminderService.getBirthDayData(branchName, tenantId),
        certificate.find({
          branchName,
          renewal_date: {
            $gte: todayStart,
            $lte: next7Days,
          },
          isdeleted: false,
          tenantId,
        }),
      ]);

      // 🎂 Handle Birthdays
      if (birthdays?.first) {
        try {
          const message =
            birthdays.count === 1
              ? `🎉 It's ${birthdays.first.Name}'s birthday today!`
              : `🎉 Today is the birthday of ${birthdays.first.Name} and ${
                  birthdays.count - 1
                } others!`;

          await notifyRepo.upsertNotification(
            {
              tenantId,
              branchName,
              type: "birthday",
              date: todayStart,
            },
            {
              $set: {
                title: "Birthday Reminder 🎂",
                message,
                adminSeen: false,
                wardenSeen: false,
              },
              $setOnInsert: {
                tenantId,
                branchName,
                type: "birthday",
                date: todayStart,
              },
            }
          );
        } catch (err) {
          console.error("Birthday Insert Error:", err.message);
        }
      }

      // 📄 Handle Certificates
      for (const cert of certificates) {
        const route = `/certificates/${cert._id}`;

        const daysLeft = Math.ceil(
          (new Date(cert.renewal_date) - todayStart) /
            (1000 * 60 * 60 * 24)
        );

        const message =
          daysLeft === 0
            ? `📄 Certificate '${cert.certificate_name}' renewal is due today.`
            : `📄 Certificate '${cert.certificate_name}' is due within ${daysLeft} day(s).`;

        await notifyRepo.upsertNotification(
          {
            tenantId,
            branchName,
            type: "certificate",
            route,
          },
          {
            $setOnInsert: {
              tenantId,
              branchName,
              type: "certificate",
              title: "Certificate Renewal 📄",
              message,
              route,
              date: todayStart,
              adminSeen: false,
              wardenSeen: false,
            },
          }
        );
      }
    }
  }

  async getNotificationsForUser(user, queryBranch, tenantId) {
    const { role, branchName: userBranch } = user;
    const branchName = role === "Admin" ? queryBranch : userBranch;
    const seenField = role === "Admin" ? "adminSeen" : "wardenSeen";

    // 1. Get unseen notifications
    const filter = {
      branchName,
      [seenField]: false,
      tenantId,
    };

    let notifications = await notifyRepo.findNotifications(filter);

    // 2. If none, get recent history
    if (notifications.length === 0) {
      const baseFilter = { branchName, tenantId };
      if (role === "Warden") baseFilter.type = { $ne: "certificate" };
      notifications = await notifyRepo.findNotifications(
        baseFilter,
        { createdAt: -1 },
        3,
      );
    }

    return notifications;
  }

  async markAsSeen(id, role, tenantId) {
    const updateField =
      role === "Admin" ? { adminSeen: true } : { wardenSeen: true };
    const updated = await notifyRepo.updateById({ _id: id, tenantId }, updateField);
    if (!updated) throw new Error("Notification not found");
    return updated;
  }

  async markAllSeen(user, queryBranch, tenantId) {
    const { role, branchName: userBranch } = user;
    const branchName = role === "Admin" ? queryBranch : userBranch;
    const filterField = role === "Admin" ? "adminSeen" : "wardenSeen";
    const updateData =
      role === "Admin" ? { adminSeen: true } : { wardenSeen: true };

    const result = await notifyRepo.updateMany(
      { branchName, [filterField]: false, tenantId },
      updateData,
    );
    return result.modifiedCount;
  }
}

export default new NotificationService();