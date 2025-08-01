const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate:{validator:Number.isInteger,message:"not a integer"}
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
