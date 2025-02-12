const express = require("express");
const User = require("../models/User");
const verifyToken = require("../verifyToken");

console.log("API LISTENING ON /api/user");

const router = express.Router();

// GET /user route to get user data
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the userId from the decoded JWT
    const user = await User.findById(userId); // Find user by their ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back user data
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /user route to update user data
router.put("/", verifyToken, async (req, res) => {
  const { name, email } = req.body; // Expect name and email to be in the body of the request

  // Validate data
  if (!name && !email) {
    return res.status(400).json({ message: "Name or email must be provided" });
  }

  try {
    const userId = req.user.userId; // Get the userId from the decoded JWT
    const user = await User.findById(userId); // Find user by their ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Save updated user data
    await user.save();

    // Respond with updated user data
    res.json({
      message: "User data updated successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
