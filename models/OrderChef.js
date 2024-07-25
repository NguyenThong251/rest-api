const mongoose = require("mongoose");

const orderchefSchema = new mongoose.Schema(
  {
    products: [
      {
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    table_id: String,
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("OrderChef", orderchefSchema);
