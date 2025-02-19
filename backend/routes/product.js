const express = require("express");
const Product = require("../models/Product");
const verifyToken = require("../verifyToken");
const { mongoose } = require("mongoose");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers"); // ES6 import
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const upload = multer();
const router = express.Router();
console.log("API LISTENING ON /api/product");
// S3 connection
const s3_client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: fromEnv(),
});

async function createPresignedUrl(bucketName, key) {
  // Create a GetObjectCommand to access the S3 object
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  // Generate the presigned URL with an expiration time (in seconds)
  const url = await getSignedUrl(s3_client, command, { expiresIn: 3600 }); // Expires in 1 hour

  return url;
}
// GET /product route to get product data
//  Sends one product data if product id is provided as url query parameter
// Send multiple if range parameter is provided
router.get("/", async (req, res) => {
  try {
    if (req.query.productId) {
      try {
        const result = await Product.findById(req.query.productId).lean(); // Find user by their ID
        var response = result;
        const product = response;
        //create presigned urls for images and add to response
        if (product.imageUrls) {
          for (let i = 0; i > product.imageUrls.length; i++) {
            // get product image and add them to the response
            const bucketName = process.env.PRODUCT_BUCKET;
            const key = `${bucketName}/product/images/${product._id}/${i}`;
            const presignedUrl = await createPresignedUrl(bucketName, key, {
              expiresIn: 99999999999,
            });
            product.imageUrls.push(presignedUrl);
          }
        }
        console.log(product);
        res.json({ product: product });
      } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Invalid Product Id" });
      }
      return;
    }

    // Send range of products
    const range = req.query.range.split("-");
    const rangeMin = range[0];
    const rangeMax = range[1];
    const currentDate = Date.now();
    const result = await Product.find().sort({ end: 1 }).limit(100).lean();

    var response = result;
    // attach presigned urls of thumbnail to response
    for (const [i, product] of response.entries()) {
      // get product image and add them to the response
      const bucketName = process.env.PRODUCT_BUCKET;
      const key = `${bucketName}/product/images/${product._id}/0`;
      const presignedUrl = await createPresignedUrl(bucketName, key, {
        expiresIn: 99999999999,
      });
      response[i].imageUrl = presignedUrl;
    }

    res.status(200).json(response);
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
      const price = req.body.price;
      const duration = new Date(req.body.end);
      const images = req.files;

      //  if no product id we create a product
      const product = new Product({
        name: name,
        desc: desc,
        price: price,
        ownerId: userId,
        created: Date.now(),
        end: duration,
      });
      await product.save();

      // send images to object storage images/productId/(image index)
      for (const [index, image] of images.entries()) {
        const bucket = process.env.PRODUCT_BUCKET;
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: `huutokauppa-bucket/product/images/${product._id}/${index}`,
          Body: image.buffer,
        });
        const response = await s3_client.send(command);
        console.log(response);
        // create presigned urls for each image and add urls to product in database
        const key = `huutokauppa-bucket/product/images/${product._id}/${index}`;
        const presignedUrl = await createPresignedUrl(bucket, key, {
          expiresIn: 99999999999,
        });
        product.imageUrls.push(presignedUrl);
        console.log("SENDING TO BUCKET", index);
      }
      await product.save();

      console.log(`Created a product: name:${name} Id:${product._id}`);
      return res.json({});
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  }
);

module.exports = router;
