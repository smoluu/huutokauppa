const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const prodcutRoutes = require("./routes/product");
const {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers"); // ES6 import

dotenv.config(); // Load environment variables from .env
const cors = require("cors");
const app = express();
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json({ limit: "1mb" }));

// create bucket for garagehq
(async () => {
  const s3_client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: fromEnv(),
  });
  const listInput = {};
  const listCommand = new ListBucketsCommand(listInput);
  const listResponse = await s3_client.send(listCommand);
})();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Auth routes
app.use("/api/auth", authRoutes);

//profile route
app.use("/api/user", userRoutes);

//product route
app.use("/api/product", prodcutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
