const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    products: [
      {
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    total: Number,
    table_id: mongoose.Schema.Types.ObjectId,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Bill", billSchema);
