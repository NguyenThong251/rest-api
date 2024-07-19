const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    products: [
      {
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    table_id: mongoose.Schema.Types.ObjectId,
    sub_total: Number,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
