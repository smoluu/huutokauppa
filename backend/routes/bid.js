const express = require("express");
const Bid = require("../models/Bid");
const Product = require("../models/Product");
const verifyToken = require("../verifyToken");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.put("/", verifyToken, async (req, res) => {
  try {
    const newBid = req.body.bid;
    const ownerId = req.body.ownerId;
    const productId = req.body.productId;
    const name = req.body.name;
    const userId = req.user.userId;

    // check product highest bid

    const product = await Product.findById(productId).lean();
    if (newBid > product.bid) {
      const bid = new Bid({
        name: name,
        ownerId: userId,
        bid: newBid,
      });
      bid.save();
      const asd = await Product.updateOne({_id: productId}, {bid: newBid})
      console.log(asd)
    } else {
      return res.status(400).json({ message: "Bid too low" });

    }
    res.status(200).json({ message: "Bid succesfull" });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

module.exports = router;
