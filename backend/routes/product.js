const express = require("express");
const Product = require("../models/Product");
const verifyToken = require("../verifyToken");
const { mongoose } = require("mongoose");
const multer = require("multer");
const http = require("http");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers"); // ES6 import
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const priceEmitter = require("../emitters/priceEmitter");
const { json } = require("stream/consumers");
const { url } = require("inspector");
const upload = multer();
const router = express.Router();
const { getEpochMsFromXAmzDate } = require("../helpers/dateConversion");

const sse_clients = new Map();

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
        const imageUrls = product.imageUrls;
        var hasUrlsChanged = false;
        //create new presigned urls for images and add to response
        if (imageUrls) {
          for (let i = 0; i < imageUrls.length; i++) {
            //check expiry and generate new signedurl if expired
            const urlParams = new URLSearchParams(imageUrls[i]);
            const xAmzDate = urlParams.get("X-Amz-Date"); // creation date (ISO 8601 "basic")
            const xAmzExpires = urlParams.get("X-Amz-Expires"); // seconds from creation to expiry
            const expiry = getEpochMsFromXAmzDate(xAmzDate) + (xAmzExpires * 1000);
            if (new Date().getTime() > expiry) {
              // get product image and add them to the response
              const bucketName = process.env.PRODUCT_BUCKET;
              const key = `${bucketName}/product/images/${product._id}/${i}`;
              const newPresignedUrl = await createPresignedUrl(
                bucketName,
                key,
                {
                  expiresIn: 3600,
                }
              );
              product.imageUrls[i] = newPresignedUrl;
              hasUrlsChanged = true;
            }
          }
          // store new urls in mongodb product document
          if (hasUrlsChanged == true) {
            await Product.findByIdAndUpdate(req.query.productId, {
              imageUrls: product.imageUrls,
            });
          }
        }
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
        expiresIn: 3600,
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
          expiresIn: 3600,
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
router.get("/price", (req, res) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const productId = req.query.productId || "noid";
  console.log("new sse connection", req.query);

  sse_clients.set(res, productId);
  const data = JSON.stringify({
    message: "Listening server-sent events...",
  });
  res.write(`data: ${data} \n\n`);

  req.on("close", () => {
    console.log("sse closed");
    sse_clients.delete(res);
    res.end();
  });
});
// listen for price change
// sse must start with "data:" and end in "\n\n"
priceEmitter.on("product_new_price", (new_productId, price) => {
  const data = JSON.stringify({
    productId: new_productId,
    price: price,
  });
  sse_clients.forEach((client_productId, res) => {
    if (client_productId == new_productId) {
      console.log(client_productId, new_productId);
      res.write(`data: ${data} \n\n`);
    }
  });
});

module.exports = router;
