import { Schema, model } from "mongoose";

const cylinderschema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    deliverydate: {
      type: Date,
      required: true,
    },
    installeddate: {
      type: Date,
    },
    emptydate: {
      type: Date,
    },
    capacity: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    usage: {
      type: String,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: Schema.Types.ObjectId, ref: "user", default: null },
    },
  },
  {
    timestamps: true,
  }
);

const cylinder = model("Cylinder", cylinderschema);

export default cylinder;