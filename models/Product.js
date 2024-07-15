const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    seller: Number,
    quantity: Number,
    // category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    category_id: mongoose.Schema.Types.ObjectId,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
