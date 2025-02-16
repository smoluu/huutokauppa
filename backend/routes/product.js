const express = require("express");
const Product = require("../models/Product");
const verifyToken = require("../verifyToken");
const { mongoose } = require("mongoose");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers"); // ES6 import
const  { Stream } = require('node:stream');

const upload = multer();
const router = express.Router();
console.log("API LISTENING ON /api/product");
// S3 connection
const s3_client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: fromEnv(),
});

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
// images are stored in  req.files
router.post(
  "/create",
  [upload.array("images", 10), verifyToken],
  async (req, res) => {
    try {
      console.log(req.user);
      const userId = req.user.userId;
      const name = req.body.name;
      const desc = req.body.desc;
      const duration = new Date(req.body.end);
      const images = req.files;

      //  if no product id we create a product
      const product = new Product({
        name: name,
        desc: desc,
        ownerId: userId,
        created: Date.now(),
        end: duration,
      });
      await product.save();

      // send images to object storage images/productId/(image index)
      for (const [index, image] of images.entries()) {
        const bucket = process.env.PRODUCT_BUCKET
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: `huutokauppa-bucket/product/images/${product._id}/${index}`,
          Body: image.buffer,
        });
        const response = await s3_client.send(command);
        console.log(response)

        console.log("SENDING TO BUCKET", index);
      }

      console.log(`Created a product: name:${name} Id:${product._id}`);
      return res.json({});
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  }
);

module.exports = router;
