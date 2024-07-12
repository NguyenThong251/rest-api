const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    phone: Number,
    isAdmin: Number,
    email: String,
    password: String,
    point: Number,
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
