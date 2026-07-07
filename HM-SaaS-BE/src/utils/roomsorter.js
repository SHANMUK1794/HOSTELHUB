// utils/roomSorter.js

// Floor order mapping
const floorOrder = {
  "D":1,
  "G": 2,     // Ground
  "F": 3,     // First
  "S": 4,     // Second
  "T": 5,     // Third
  "GH": 6,    // GH1, GH2
  "KTS": 7,   // KTS1, KTS2
  "Fo": 8     // Fourth (if needed later)
};

// Extract prefix + number safely
const parseRoomNo = (roomNo) => {
  if (!roomNo || typeof roomNo !== "string") {
    return { floor: "ZZ", number: 0 }; // invalid → sort last
  }

  // Regex: prefix + number
  const match = roomNo.match(/^([A-Za-z]+)(\d*)$/);
  if (!match) {
    return { floor: "ZZ", number: 0 };
  }

  return {
    floor: match[1],                // e.g. G, F, GH, KTS
    number: parseInt(match[2] || 0) // 1,2,3... or 0 if no number
  };
};

// Sort Rooms by Prefix > Number
export const sortRooms = (rooms) => {
  return rooms.sort((a, b) => {
    const { floor: floorA, number: numA } = parseRoomNo(a.RoomNo);
    const { floor: floorB, number: numB } = parseRoomNo(b.RoomNo);

    const orderA = floorOrder[floorA] || 999;
    const orderB = floorOrder[floorB] || 999;

    // First by prefix
    if (orderA !== orderB) return orderA - orderB;

    // Then by number
    return numA - numB;
  });
};

// Sort users by RoomNo → joining date
export const sortUsersByRoomAndJoining = (users) => {
  return users.sort((a, b) => {
    // Compare rooms using sortRooms logic
    const sortedRoomPair = sortRooms([
      { RoomNo: a.RoomNo },
      { RoomNo: b.RoomNo }
    ]);

    // If different rooms
    if (sortedRoomPair[0].RoomNo !== sortedRoomPair[1].RoomNo) {
      return sortedRoomPair[0].RoomNo === a.RoomNo ? -1 : 1;
    }

    // Same room → sort by joining date (oldest first)
    return new Date(a.DateOfJoining) - new Date(b.DateOfJoining);
  });
};



