import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // Exclude password

    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    req.user = user; // Attach user data to request
    next(); // Continue to the next middleware
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token."));
  }
};
