import prisma from "./prisma.js";

// Maps Mongoose model names (lowercased) to Prisma client property names
const MODEL_NAME_MAP = {
  // Multi-word models (camelCase in Prisma)
  "vacationform":        "vacationForm",
  "storeroomhistory":    "storeRoomHistory",
  "storeroomexpense":    "item",
  "storeroominventory":  "storeRoomInventory",
  "staffattendance":     "staffAttendance",
  "electricitybill":     "eBill",
  "roomrent":            "roomRent",
  "duetracker":          "dueTracker",
  "dailyexpense":        "dailyExpense",
  "daily_expense":       "dailyExpense",
  "kitchenusagelog":     "kitchenUsageLog",
  "kitchenstock":        "kitchenStock",
  "kitchenhistory":      "kitchenUsageLog",
  "kitchenexpenses":     "kitchenExpenses",
  "kitcheninventory":    "kitchenInventory",
  "kitchensummary":      "kitchenHistory",  // summary model → kitchenHistory
  "incomingfund":        "fund",
  "incoming_fund":       "fund",
  "pgdata":              "pGData",
  // Single-word models — no mapping needed but included for clarity
  "user":                "user",
  "register":            "register",
  "room":                "room",
  "tenant":              "tenant",
  "subscription":        "subscription",
  "settings":            "settings",
  "notification":        "notification",
  "employee":            "employee",
  "payroll":             "payroll",
  "advance":             "advance",
  "achievement":         "achievement",
  "cylinder":            "cylinder",
  "certificate":         "certificate",
  "complaint":           "complaint",
  "attendance":          "attendance",
  "menu":                "menu",
  "expense":             "kitchenExpenses",  // foodAndKitchen Expense model
  "summary":             "kitchenHistory",
  "inventory":           "kitchenStock",
  "duetarcker":          "dueTracker",
};

class MongooseCompatModel {
  constructor(modelName) {
    // Map counter model name to user or just ignore
    const lower = modelName === "counter" ? "user" : modelName.toLowerCase();
    this.modelName = MODEL_NAME_MAP[lower] || lower;
    this.client = prisma[this.modelName];
  }

  _castFields(data) {
    if (!data || typeof data !== "object") return data;
    if (!this.schema || !this.schema.definition) return data;

    const def = this.schema.definition;
    const clean = Array.isArray(data) ? data.map(item => this._castFields(item)) : { ...data };

    if (!Array.isArray(clean)) {
      for (const key in clean) {
        const schemaField = def[key];
        if (!schemaField) continue;

        let targetType = null;
        if (schemaField === Number || schemaField.type === Number) {
          targetType = "number";
        } else if (schemaField === Boolean || schemaField.type === Boolean) {
          targetType = "boolean";
        } else if (schemaField === Date || schemaField.type === Date) {
          targetType = "date";
        } else if (schemaField === String || schemaField.type === String) {
          targetType = "string";
        }

        if (targetType) {
          const val = clean[key];
          if (val !== null && val !== undefined) {
            if (typeof val === "object") {
              for (const op of ["$gt", "$lt", "$gte", "$lte", "$ne", "$eq", "$in", "$nin"]) {
                if (val[op] !== undefined) {
                  if (Array.isArray(val[op])) {
                    val[op] = val[op].map(x => {
                      if (x === null || x === undefined) return x;
                      if (targetType === "number") {
                        const num = Number(x);
                        return isNaN(num) ? x : num;
                      }
                      if (targetType === "boolean") {
                        return typeof x === "string" ? (x.toLowerCase() === "true" || x === "1") : Boolean(x);
                      }
                      if (targetType === "date") return new Date(x);
                      return String(x);
                    });
                  } else {
                    if (targetType === "number") {
                      const num = Number(val[op]);
                      if (!isNaN(num)) val[op] = num;
                    } else if (targetType === "boolean") {
                      val[op] = typeof val[op] === "string" ? (val[op].toLowerCase() === "true" || val[op] === "1") : Boolean(val[op]);
                    } else if (targetType === "date") {
                      val[op] = new Date(val[op]);
                    } else if (targetType === "string") {
                      val[op] = String(val[op]);
                    }
                  }
                }
              }
            } else {
              if (targetType === "number") {
                const num = Number(val);
                if (!isNaN(num)) clean[key] = num;
              } else if (targetType === "boolean") {
                clean[key] = typeof val === "string" ? (val.toLowerCase() === "true" || val === "1") : Boolean(val);
              } else if (targetType === "date") {
                clean[key] = new Date(val);
              } else if (targetType === "string") {
                clean[key] = String(val);
              }
            }
          }
        }
      }
    }
    return clean;
  }

  // Model.create(data)
  async create(data) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(item => this.create(item)));
    }
    let cleanData = this._castFields(data);
    if (cleanData._id) {
      cleanData.id = cleanData._id.toString();
      delete cleanData._id;
    }
    if (this.modelName === "tenant" && cleanData.owner) {
      cleanData.ownerId = cleanData.owner.toString();
      delete cleanData.owner;
    }
    const created = await this.client.create({ data: cleanData });
    return wrapRecord(created, this);
  }

  // Model.find(query)
  find(query = {}) {
    const where = this._translateQuery(query);
    return new QueryBuilder(async (populates, selectSpec) => {
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
      return applySelect(records, selectSpec);
    });
  }

  // Model.findOne(query)
  findOne(query = {}) {
    const where = this._translateQuery(query);
    return new QueryBuilder(async (populates, selectSpec) => {
      const record = await this.client.findFirst({ where });
      return applySelect(wrapRecord(record, this), selectSpec);
    });
  }

  // Model.findById(id)
  findById(id) {
    return new QueryBuilder(async (populates, selectSpec) => {
      if (!id) return null;
      const record = await this.client.findUnique({ where: { id: id.toString() } });
      return applySelect(wrapRecord(record, this), selectSpec);
    });
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

  // Model.distinct(field, query)
  async distinct(field, query = {}) {
    const where = this._translateQuery(query);
    const records = await this.client.findMany({
      where,
      select: { [field]: true },
    });
    const values = records.map(r => r[field]);
    return [...new Set(values)];
  }

  // Model.aggregate(pipeline) — basic $match + $group with $sum and field grouping support
  async aggregate(pipeline = []) {
    try {
      const matchStage = pipeline.find(s => s.$match)?.$match || {};
      const groupStage = pipeline.find(s => s.$group)?.$group;

      const where = this._translateQuery(matchStage);

      if (!groupStage) {
        return await this.client.findMany({ where });
      }

      // Check if grouping by a field (like year/month/branchName/FoodType)
      const groupById = groupStage._id;

      if (groupById === null) {
        // Simple total aggregation
        const sumKeys = {};
        for (const key of Object.keys(groupStage)) {
          if (key === "_id") continue;
          const val = groupStage[key];
          if (val && val.$sum && typeof val.$sum === "string") {
            sumKeys[val.$sum.replace("$", "")] = true;
          }
        }
        const result = await this.client.aggregate({
          where,
          _sum: sumKeys,
        });
        const row = { _id: null };
        for (const key of Object.keys(groupStage)) {
          if (key === "_id") continue;
          const val = groupStage[key];
          if (val && val.$sum && typeof val.$sum === "string") {
            const field = val.$sum.replace("$", "");
            row[key] = result._sum[field] || 0;
          }
        }
        return [row];
      }

      if (typeof groupById === "string" && groupById.startsWith("$")) {
        const groupField = groupById.replace("$", "");
        const countFields = [];
        const sumFields = {};
        for (const key of Object.keys(groupStage)) {
          if (key === "_id") continue;
          const val = groupStage[key];
          if (val && val.$sum) {
            if (val.$sum === 1) {
              countFields.push(key);
            } else if (typeof val.$sum === "string" && val.$sum.startsWith("$")) {
              sumFields[key] = val.$sum.replace("$", "");
            }
          }
        }

        const groupByArgs = {
          by: [groupField],
          where,
        };
        if (countFields.length > 0) {
          groupByArgs._count = { _all: true };
        }
        const sumKeys = Object.values(sumFields);
        if (sumKeys.length > 0) {
          groupByArgs._sum = {};
          for (const sk of sumKeys) {
            groupByArgs._sum[sk] = true;
          }
        }

        const results = await this.client.groupBy(groupByArgs);

        return results.map(r => {
          const row = { _id: r[groupField] };
          for (const key of countFields) {
            row[key] = r._count?._all || 0;
          }
          for (const key of Object.keys(sumFields)) {
            const sumField = sumFields[key];
            row[key] = r._sum?.[sumField] || 0;
          }
          return row;
        });
      }

      return [];
    } catch (err) {
      console.warn(`[mongoose-compat] aggregate fallback for ${this.modelName}:`, err.message);
      return [];
    }
  }

  _translateQuery(query) {
    const castedQuery = this._castFields(query);
    const where = {};

    // Per-model field name remaps (Mongoose field → Prisma field)
    const FIELD_REMAP = {
      vacationForm: { vacatedate: "checkOutDate", applicationname: "userId" },
    };
    const remap = FIELD_REMAP[this.modelName] || {};

    for (const key in castedQuery) {
      let val = castedQuery[key];
      let cleanKey = key === "_id" ? "id" : key;

      if (this.modelName === "tenant" && cleanKey === "owner") {
        cleanKey = "ownerId";
      }

      // Apply per-model field remap
      if (remap[cleanKey]) {
        cleanKey = remap[cleanKey];
      }

      if (val === null || val === undefined) {
        where[cleanKey] = "null-dummy-value";
        continue;
      }

      if (typeof val === "object" && !Array.isArray(val)) {
        if (val.$in !== undefined) {
          const cleanIn = val.$in.map(x => x === null || x === undefined ? "null-dummy-value" : x);
          where[cleanKey] = { in: cleanIn };
        } else if (val.$nin !== undefined) {
          const cleanNin = val.$nin.map(x => x === null || x === undefined ? "null-dummy-value" : x);
          where[cleanKey] = { notIn: cleanNin };
        } else if (val.$ne !== undefined) {
          where[cleanKey] = { not: val.$ne === null || val.$ne === undefined ? "null-dummy-value" : val.$ne };
        } else if (val.$gt !== undefined) {
          where[cleanKey] = { gt: val.$gt };
        } else if (val.$lt !== undefined) {
          where[cleanKey] = { lt: val.$lt };
        } else if (val.$gte !== undefined) {
          where[cleanKey] = { gte: val.$gte };
        } else if (val.$lte !== undefined) {
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
    let cleanUpdate = update;
    if (update.$set) {
      cleanUpdate = { ...update.$set };
    } else if (update.$inc) {
      const incrementData = {};
      for (const k in update.$inc) {
        incrementData[k] = { increment: update.$inc[k] };
      }
      cleanUpdate = incrementData;
    } else {
      cleanUpdate = { ...update };
    }

    if (this.modelName === "tenant" && cleanUpdate.owner) {
      cleanUpdate.ownerId = cleanUpdate.owner.toString();
      delete cleanUpdate.owner;
    }

    cleanUpdate = this._castFields(cleanUpdate);
    return cleanUpdate;
  }
}

class QueryBuilder {
  constructor(promiseFn) {
    this.promiseFn = promiseFn;
    this.populates = [];
    this.selectSpec = null;
  }

  populate(opts) {
    this.populates.push(opts);
    return this;
  }

  select(spec) {
    this.selectSpec = spec;
    return this;
  }

  lean() {
    return this;
  }

  sort(opts) {
    return this;
  }

  limit(num) {
    return this;
  }

  skip(num) {
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.promiseFn(this.populates, this.selectSpec).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.then().catch(onRejected);
  }
}

function parseSelectSpec(spec) {
  if (!spec) return null;

  if (typeof spec === "string") {
    const fields = spec.split(/\s+/).filter(Boolean);
    if (fields.length === 0) return null;

    const mode = fields.every(field => field.startsWith("-")) ? "exclude" : "include";
    return {
      mode,
      fields: fields.map(field => field.replace(/^-/, "")),
    };
  }

  if (typeof spec === "object") {
    const entries = Object.entries(spec);
    if (entries.length === 0) return null;

    const mode = entries.every(([, value]) => value === 0 || value === false)
      ? "exclude"
      : "include";

    return {
      mode,
      fields: entries
        .filter(([, value]) => mode === "exclude" ? value === 0 || value === false : value === 1 || value === true)
        .map(([field]) => field),
    };
  }

  return null;
}

function applySelect(recordOrRecords, spec) {
  const parsed = parseSelectSpec(spec);
  if (!parsed || !recordOrRecords) return recordOrRecords;

  if (Array.isArray(recordOrRecords)) {
    return recordOrRecords.map(record => applySelect(record, spec));
  }

  if (parsed.mode === "exclude") {
    const clone = { ...recordOrRecords };
    for (const field of parsed.fields) {
      delete clone[field];
    }
    return clone;
  }

  const selected = {};
  for (const field of parsed.fields) {
    if (Object.prototype.hasOwnProperty.call(recordOrRecords, field)) {
      selected[field] = recordOrRecords[field];
    }
  }

  if (Object.prototype.hasOwnProperty.call(recordOrRecords, "id")) {
    selected.id = recordOrRecords.id;
  }

  return wrapRecord(selected, { modelName: null, client: null });
}

function wrapRecord(record, model) {
  if (!record) return null;
  if (Array.isArray(record)) {
    return record.map(r => wrapRecord(r, model));
  }
  
  const proxy = { ...record };
  
  Object.defineProperty(proxy, "save", {
    value: async function() {
      const { id, _id, createdAt, updatedAt, ...data } = this;
      // Remove Mongoose-specific / virtual fields Prisma won't accept
      delete data._id;
      delete data.deletedinfo;  // Mongoose sub-document — not a Prisma field
      delete data.module;       // from deletedinfo spread
      if (model.modelName === "tenant" && data.owner) {
        data.ownerId = data.owner.toString();
        delete data.owner;
      }
      const updated = await model.client.update({
        where: { id },
        data,
      });
      return wrapRecord(updated, model);
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

  if (model.modelName === "tenant") {
    Object.defineProperty(proxy, "owner", {
      get: function() {
        return this.ownerId;
      },
      set: function(val) {
        this.ownerId = val;
      },
      enumerable: true,
    });
  }

  return proxy;
}

const mongooseMock = {
  Schema: class {
    constructor(definition, options) {
      this.definition = definition;
      this.options = options;
    }
    index() {}
    pre() {}
    set() {}
    virtual() {
      return {
        get: () => {}
      };
    }
  },
  model: (modelName, schema) => {
    const instance = mongooseMock.models[modelName] || new MongooseCompatModel(modelName);
    if (schema) {
      instance.schema = schema;
    }
    mongooseMock.models[modelName] = instance;
    return instance;
  },
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
