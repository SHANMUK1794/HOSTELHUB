import mongoose from "../../config/mongoose-compat.js";

const roomSchema = new mongoose.Schema(
  {
    // Multi Tenant
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    // Branch
    branchName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Floor
    Floor: {
      type: String,
      required: true,
      trim: true,
    },

    // Room Number
    RoomNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // AC / Non-AC
    RoomType: {
      type: String,
      enum: ["AC", "Non-AC"],
      required: true,
    },

    // Resident / PG
    category: {
      type: String,
      enum: ["Resident", "PG"],
      required: true,
      default: "Resident",
    },

    // Number of beds
    Capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Current occupied beds
    Occupied: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Vacant / Partial / Full
    Status: {
      type: String,
      enum: ["Vacant", "Partial", "Full"],
      default: "Vacant",
    },

    // Keep for future Finance module
    Rate: {
      type: Number,
      default: 0,
      min: 0,
    },

    isdeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedinfo: {
      deleteddate: {
        type: Date,
        default: null,
      },
      deleteby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
      },
      module: {
        type: String,
        default: "room",
      },
    },

    // Keep until Resident module is refactored
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Register",
      },
    ],

    // Keep until PG module is refactored
    pgUsers: [
      {
        name: {
          type: String,
          trim: true,
        },
        pgUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pgdata",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual field (not stored in MongoDB)
roomSchema.virtual("Vacant").get(function () {
  return Math.max(0, this.Capacity - this.Occupied);
});

// Auto-update Status before saving
roomSchema.pre("save", function (next) {
  if (this.Occupied === 0) {
    this.Status = "Vacant";
  } else if (this.Occupied >= this.Capacity) {
    this.Status = "Full";
  } else {
    this.Status = "Partial";
  }
  next();
});

// Unique Room per Tenant + Branch + Floor
roomSchema.index(
  {
    tenantId: 1,
    branchName: 1,
    Floor: 1,
    RoomNo: 1,
  },
  {
    unique: true,
  }
);

// Faster dashboard queries
roomSchema.index({
  tenantId: 1,
  branchName: 1,
  category: 1,
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default Room;