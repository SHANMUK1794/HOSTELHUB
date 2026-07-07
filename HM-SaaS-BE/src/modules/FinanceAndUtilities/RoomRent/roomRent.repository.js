import RoomRent from "./roomRent.model.js";

class RoomRentRepository {
  async create(data) {
    return await RoomRent.create(data);
  }

  async updateById(filter, data) {
    return await RoomRent.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });
  }
  
  async find(filter) {
    return await RoomRent.find(filter).lean();
  }

  async findOne(filter) {
    return await RoomRent.findOne(filter);
  }

  async findById(filter) {
    return await RoomRent.findOne(filter);
  }
}

export default new RoomRentRepository();

// import RoomRent from "./roomRent.model.js";

// class RoomRentRepository {
//   async create(data) {
//     return await RoomRent.create(data);
//   }

//   async updateById(id, data) {
//     return await RoomRent.findByIdAndUpdate(id, data, {
//       new: true,
//       runValidators: true,
//     });
//   }
  
//   async find(filter) {
//     return await RoomRent.find(filter).lean();
//   }

//   async findOne(filter) {
//     return await RoomRent.findOne(filter);
//   }

//   async findById(id) {
//     return await RoomRent.findById(id);
//   }

//   async findByIdAndDelete(id) {
//     return await RoomRent.findByIdAndDelete(id);
//   }
// }

// export default new RoomRentRepository();
