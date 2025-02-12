const express = require("express");
const Product = require("../models/Product");
const verifyToken = require("../verifyToken");
const { default: mongoose } = require("mongoose");
const multer = require("multer");

const upload = multer();
const router = express.Router();
console.log("API LISTENING ON /api/product");

// GET /product route to get product data
router.get("/", async (req, res) => {
  try {
    //  Send one product data if product id is provided as url query parameter
    if (req.query.id) {
      try {
        var product = await Product.findById(productId); // Find user by their ID
      } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Invalid Product Id" });
      }
      res.json({ product });
    }

    // Send range of products
    const range = req.query.range.split("-");
    const rangeMin = range[0];
    const rangeMax = range[1];
    const currentDate = Date.now();
    const result = await Product.find().sort({ end: 1 }).limit(100);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// PUT api/product/  create or modify a product
router.post("/create", upload.array("images", 10), async (req, res) => {
  console.log("REQUEST: ", req.files);
  // try {
  //   const userId = req.user.userId;
  //   const name = req.user.name;
  //   const productId = req.productId;
  //   const duration = new Date(req.body.product.end);

  //   // if no product id we create a product
  //   if (productId) {
  //     const product = new Product({
  //       name: req.body.product.name,
  //       desc: req.body.product.desc,
  //       ownerId: userId,
  //       created: Date.now(),
  //       end: duration,
  //     });
  //     await product.save();
  //     console.log(`Created a product: name:${name} Id:${product._id}`);
  //     return res.json({});
  //   }

  // modify existing product
  return res.status(200).json({"message": "nicee"} );
  // } catch (error) {
  //   res.json(500, error);
  //   console.log(error);
  // }
});

module.exports = router;
