const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
const prodcutRoutes = require("./routes/product")

dotenv.config(); // Load environment variables from .env
const cors = require("cors")
const app = express();
app.use(cors({origin : ['http://localhost:3000'],}));
app.use(express.json({limit:'1mb'}))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI,  {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Auth routes
app.use("/api/auth", authRoutes);

//profile route
app.use("/api/user", userRoutes)

//product route
app.use("/api/product", prodcutRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
