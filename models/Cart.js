const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    user_id: { type: mongoose.Schema.Types.ObjectId, required: false },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Cart", cartSchema);
