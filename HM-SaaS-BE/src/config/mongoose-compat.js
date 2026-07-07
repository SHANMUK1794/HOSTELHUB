import prisma from "./prisma.js";

class MongooseCompatModel {
  constructor(modelName) {
    // Map counter model name to user or just ignore
    this.modelName = modelName === "counter" ? "user" : modelName.toLowerCase();
    this.client = prisma[this.modelName];
  }

  // Model.create(data)
  async create(data) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(item => this.create(item)));
    }
    const cleanData = { ...data };
    if (cleanData._id) {
      cleanData.id = cleanData._id.toString();
      delete cleanData._id;
    }
    const created = await this.client.create({ data: cleanData });
    return wrapRecord(created, this);
  }

  // Model.find(query)
  find(query = {}) {
    const where = this._translateQuery(query);
    return new QueryBuilder(async (populates) => {
      let records = await this.client.findMany({ where });
      records = wrapRecord(records, this);

      // Intercept and resolve populates manually
      if (populates.length > 0 && records.length > 0) {
        for (const pop of populates) {
          const path = typeof pop === "string" ? pop : pop.path;
          // Room -> users relation
          if (this.modelName === "room" && path === "users") {
            for (const record of records) {
              if (record.users && record.users.length > 0) {
                const regs = await prisma.register.findMany({
                  where: { id: { in: record.users } },
                });
                record.users = wrapRecord(regs, { client: prisma.register });
              } else {
                record.users = [];
              }
            }
          }
        }
      }
      return records;
    });
  }

  // Model.findOne(query)
  findOne(query = {}) {
    const where = this._translateQuery(query);
    return new QueryBuilder(async () => {
      const record = await this.client.findFirst({ where });
      return wrapRecord(record, this);
    });
  }

  // Model.findById(id)
  async findById(id) {
    if (!id) return null;
    const record = await this.client.findUnique({ where: { id: id.toString() } });
    return wrapRecord(record, this);
  }

  // Model.findByIdAndUpdate(id, update, options)
  async findByIdAndUpdate(id, update, options = {}) {
    const cleanUpdate = this._translateUpdate(update);
    const updated = await this.client.update({
      where: { id: id.toString() },
      data: cleanUpdate,
    });
    return wrapRecord(updated, this);
  }

  // Model.findOneAndUpdate(query, update, options)
  async findOneAndUpdate(query, update, options = {}) {
    const where = this._translateQuery(query);
    const cleanUpdate = this._translateUpdate(update);
    const record = await this.client.findFirst({ where });
    if (!record) return null;
    const updated = await this.client.update({
      where: { id: record.id },
      data: cleanUpdate,
    });
    return wrapRecord(updated, this);
  }

  // Model.findByIdAndDelete(id)
  async findByIdAndDelete(id) {
    const deleted = await this.client.delete({ where: { id: id.toString() } });
    return wrapRecord(deleted, this);
  }

  // Model.findOneAndDelete(query)
  async findOneAndDelete(query) {
    const where = this._translateQuery(query);
    const record = await this.client.findFirst({ where });
    if (!record) return null;
    const deleted = await this.client.delete({ where: { id: record.id } });
    return wrapRecord(deleted, this);
  }

  // Model.deleteMany(query)
  async deleteMany(query = {}) {
    const where = this._translateQuery(query);
    return await this.client.deleteMany({ where });
  }

  // Model.countDocuments(query)
  async countDocuments(query = {}) {
    const where = this._translateQuery(query);
    return await this.client.count({ where });
  }

  // Model.updateMany(query, update)
  async updateMany(query, update) {
    const where = this._translateQuery(query);
    const cleanUpdate = this._translateUpdate(update);
    return await this.client.updateMany({ where, data: cleanUpdate });
  }

  _translateQuery(query) {
    const where = {};
    for (const key in query) {
      let val = query[key];
      let cleanKey = key === "_id" ? "id" : key;

      if (val && typeof val === "object" && !Array.isArray(val)) {
        if (val.$in) {
          where[cleanKey] = { in: val.$in };
        } else if (val.$ne) {
          where[cleanKey] = { not: val.$ne };
        } else if (val.$gt) {
          where[cleanKey] = { gt: val.$gt };
        } else if (val.$lt) {
          where[cleanKey] = { lt: val.$lt };
        } else if (val.$gte) {
          where[cleanKey] = { gte: val.$gte };
        } else if (val.$lte) {
          where[cleanKey] = { lte: val.$lte };
        } else {
          where[cleanKey] = val;
        }
      } else {
        where[cleanKey] = val;
      }
    }
    return where;
  }

  _translateUpdate(update) {
    if (update.$set) {
      return update.$set;
    }
    if (update.$inc) {
      const incrementData = {};
      for (const k in update.$inc) {
        incrementData[k] = { increment: update.$inc[k] };
      }
      return incrementData;
    }
    return update;
  }
}

class QueryBuilder {
  constructor(promiseFn) {
    this.promiseFn = promiseFn;
    this.populates = [];
  }

  populate(opts) {
    this.populates.push(opts);
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.promiseFn(this.populates).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.then().catch(onRejected);
  }
}

function wrapRecord(record, model) {
  if (!record) return null;
  if (Array.isArray(record)) {
    return record.map(r => wrapRecord(r, model));
  }
  
  const proxy = { ...record };
  
  Object.defineProperty(proxy, "save", {
    value: async function() {
      const { id, ...data } = this;
      return await model.client.update({
        where: { id },
        data,
      });
    },
    enumerable: false,
  });

  Object.defineProperty(proxy, "toObject", {
    value: function() {
      return this;
    },
    enumerable: false,
  });

  Object.defineProperty(proxy, "toJSON", {
    value: function() {
      return this;
    },
    enumerable: false,
  });

  Object.defineProperty(proxy, "_id", {
    get: function() {
      return this.id;
    },
    set: function(val) {
      this.id = val;
    },
    enumerable: true,
  });

  return proxy;
}

const mongooseMock = {
  Schema: class {
    constructor() {}
    index() {}
    pre() {}
    virtual() {
      return {
        get: () => {}
      };
    }
  },
  model: (modelName) => new MongooseCompatModel(modelName),
  models: {},
  Types: {
    ObjectId: class {
      constructor(val) {
        this.val = val;
      }
      toString() {
        return this.val;
      }
    },
  },
};

// Add helper types
mongooseMock.Schema.Types = {
  ObjectId: String,
};

export default mongooseMock;
export { mongooseMock as mongoose };
