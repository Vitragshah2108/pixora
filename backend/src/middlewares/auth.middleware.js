import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.header("Authorization") || req.headers["authorization"];
    const token = (authHeader ? authHeader.replace(/^Bearer\s+/i, "") : null) || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
        statusCode: 401
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
        statusCode: 401
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      statusCode: 401
    });
  }
};

export default authenticateUser;
