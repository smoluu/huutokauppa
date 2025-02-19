const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: {type: mongoose.Schema.Types.ObjectId, required: true },
    bid: {type: Number,default: 0},
    created: {type: Date, default: Date.now},
});


const Bid = mongoose.model("Bid", bidSchema, "BIDS");

module.exports = Bid;