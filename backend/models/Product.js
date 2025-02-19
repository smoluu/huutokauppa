const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: {type: mongoose.Schema.Types.ObjectId, required: true },
    desc: {type:String, default: ""},
    open: {type: Boolean, default: true},
    price: {type: Number,default: 0},
    bid: {type: Number, default: 0},
    minBidIncr: {type: Number, default: 1},
    created: {type: Date, default: Date.now},
    updated: {type: Date},
    end: {type: Date, required: true},
    imageUrls: {type: [""]}
});


const Product = mongoose.model("Product", productSchema, "PRODUCTS");

module.exports = Product;