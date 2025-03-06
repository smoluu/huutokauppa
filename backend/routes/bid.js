const express = require("express");
const Bid = require("../models/Bid");
const Product = require("../models/Product");
const verifyToken = require("../verifyToken");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const priceEmitter = require('../emitters/priceEmitter');

router.put("/", verifyToken, async (req, res) => {
  try {
    const newBid = req.body.bid;
    const productId = req.body.productId;
    const name = req.body.name;
    const userId = req.user.userId;

    // check product highest bid

    const product = await Product.findById(productId).lean();
    if (newBid > product.bid) {
      const bid = new Bid({
        productId: productId,
        name: name,
        ownerId: userId,
        bid: newBid,
      });
      bid.save();
      await Product.updateOne({_id: productId}, {bid: newBid})
      const emit = priceEmitter.emit('product_new_price', product._id, name, new Date(), newBid, )
      console.log(`NEW BID: "${productId}" at ${newBid}€ from "${name}" ${emit} `)
      return res.status(200).json({ message: "Huuto onnistui" });
    } else {
      return res.status(400).json({ message: "Liian pieni huuto" });

    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

module.exports = router;
