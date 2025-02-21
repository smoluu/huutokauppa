const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Check for the token in the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
    .status(401)
    .json({ message: "Access denied. No token provided." });
  }
  
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user information (e.g., userId) to the request object
    req.user = decoded;
    console.log("AUTHORIZED USER: ", token)

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error)
    console.error(error.name);
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken
