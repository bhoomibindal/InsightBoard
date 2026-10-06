const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: String,
      required: true,
    },

    product: {
      type: String,
      required: true,
    },

    category: {
  type: String,
  required: true,
  enum: [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Sports",
  ],
},


    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Completed", "Processing", "Pending"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;