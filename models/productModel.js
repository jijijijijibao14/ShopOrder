const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stockStatus: {
        type: String,
        enum: ["in_stock", "out_of_stock", "discontinued"],
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        default: []
    }}
);

module.exports = mongoose.model("Product", productSchema);