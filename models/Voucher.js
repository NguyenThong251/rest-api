const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    users: [{ user_id: mongoose.Schema.Types.ObjectId }],
    discount: Number,
    point: Number,
    status: {
      type: String,
      enum: ["public", "pravite"],
      default: "public",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Voucher", voucherSchema);
