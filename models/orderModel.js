const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: true
    },
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;