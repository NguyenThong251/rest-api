const mongoose = require("mongoose");

const thumbnailSchema = new mongoose.Schema(
  {
    image: String,
    product_id: mongoose.Schema.Types.ObjectId,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Thumbnail", thumbnailSchema);
