const mongoose = require("mongoose");

const thumbnailSchema = new mongoose.Schema(
  {
    image: { type: String },
    // product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    product_id: mongoose.Schema.Types.ObjectId,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Thumbnail", thumbnailSchema);
