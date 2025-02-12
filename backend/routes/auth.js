const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const verifyToken = require("../verifyToken");

dotenv.config();

const router = express.Router();
  console.log("API LISTENING ON /api/auth");

// Register Route
router.post("/register", async (req, res) => {
  const {name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("NO EMAIL OR PASSWORD", req.body);
    return res
      .status(400)
      .json({ message: "Please provide name, email and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    console.log("USER REGISTERED:", email)

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  
  console.log(req.body)
  
  if (!req.body) {
    console.log("NO EMAIL OR PASSWORD", req.body);
    
    return res
    .status(400)
    .json({ message: "Please provide both email and password" });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Logged in successfully", token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// verify auth token route
router.get("/verify", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    // find user 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;