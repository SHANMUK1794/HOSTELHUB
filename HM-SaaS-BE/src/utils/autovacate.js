import vacationForm from "../modules/vacationForm/vacationform.model.js";
import register from "../modules/register/register.model.js";
import room from "../modules/roomAndResidents/Room&Residence.model.js";

export const autoVacateCheck = async () => {
  const now = new Date();

  // Find all pending forms whose vacatedate has passed (or is now)
  const forms = await vacationForm.find({
    status: "Pending",
    vacatedate: { $lte: now },
  });

  for (const form of forms) {
    try {
      // 1️⃣ Update vacation form → Vacated
      form.status = "Vacated";
      await form.save();

      // 2️⃣ Find user by mobile
      const user = await register.findOne({ MobileNo: form.mobile });
      if (!user) continue;

      const oldRoomNo = user.RoomNo;

      // 3️⃣ Update user
      await register.updateOne(
        { _id: user._id },
        {
          staying: false,
          status: "vacated",
          RoomNo: null,
          vacatedate: form.vacatedate,
          rejoiningdate: null,
        },
      );

      // 4️⃣ Update room
      const roomDoc = await room.findOne({
        branchName: form.branchName,
        RoomNo: oldRoomNo,
      });

      if (roomDoc) {
        roomDoc.users = roomDoc.users.filter(
          (u) => u._id.toString() !== user._id.toString(),
        );
        roomDoc.Occupied = roomDoc.users.length;
        await roomDoc.save();
      }
    } catch (err) {
      // Silent fail – but prevents crash
    }
  }
};
