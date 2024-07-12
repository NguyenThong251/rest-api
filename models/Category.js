const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Category", categorySchema);
