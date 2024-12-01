import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use environment variable for better security

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user; // Save the user information from the token payload to request
    next(); // Proceed to the next middleware/route handler
  });
};

export default authenticateToken;
