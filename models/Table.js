const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    // category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Table", productSchema);
