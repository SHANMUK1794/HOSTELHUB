import mongoose from "../../../config/mongoose-compat.js";

// 1. New schema that accepts objects instead of strings
const DishItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: null }
  },
  { _id: false } 
);

const DaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    dish: {
      Veg: { type: [DishItemSchema], default: [] },
      NonVeg: { type: [DishItemSchema], default: [] }
    }
  },
  { _id: true }
);

const foodMenuSchema = new mongoose.Schema({
  // Multi-tenant isolation
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },
  
  branchName: {
    type: String,
    default: "",
  },

  MealTime: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true,
  },
  Menu: [DaySchema],
});

export default mongoose.models.Menu || mongoose.model("Menu", foodMenuSchema);