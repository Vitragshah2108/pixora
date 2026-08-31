import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLocationFromIp } from "../utils/ipGeolocation.js";
import rateLimit from "express-rate-limit";

// list of controllers
// 1. registerUser
// 2. loginUser
// 3. getLoggedInUser
// 4. getUserProfile
// 5. updateUserProfile
// 6. updateUserPassword
// 7. getAllUsers
// 8. searchUsers
// 9. checkUserAvailability
// 10. getLoginHistory

// Rate limiter (limits requests to 50 per minute per IP)
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: new ApiError(429, "Too many login attempts. Please try again later."),
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter (limits requests to 50 per minute per IP)
export const registerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: new ApiError(429, "Too many registration attempts. Please try again later."),
  standardHeaders: true,
  legacyHeaders: false,
});

// Utility function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/** 
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = [registerLimiter, asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already taken.");
  }

  // Get IP address and user agent
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const device = req.headers['user-agent'] || 'unknown';
  const location = await getLocationFromIp(ip);

  const newUser = new User({ 
    fullName, 
    username, 
    email, 
    password, 
    lastLogin: Date.now(),
    loginHistory: [{
      ip,
      device,
      location,
      timestamp: Date.now()
    }]
  });
  await newUser.save();

  const token = generateToken(newUser._id);

  // Set cookie with an expiration date of 7 days
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });

  res.status(201).json(new ApiResponse(201, "User registered successfully", {
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    profilePicture: newUser.profilePicture,
    token,
  }));
})];

/** 
 * @desc Login user
 * @route POST /api/users/login
 * @access Public (Rate limited)
 */
export const loginUser = [loginLimiter, asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });
  
  if (!user) throw new ApiError(401, "Invalid credentials.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials.");

  // Get IP address and user agent
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const device = req.headers['user-agent'] || 'unknown';
  const location = await getLocationFromIp(ip);

  // Update lastLogin time and add login history entry
  user.lastLogin = Date.now();
  user.loginHistory.push({
    ip,
    device,
    location,
    timestamp: Date.now()
  });
  await user.save();

  const token = generateToken(user._id);

  // Set cookie with an expiration date of 7 days
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });

  res.status(200).json(new ApiResponse(200, "Login successful", {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    token,
  }));
})];

/** 
 * @desc Login user with Google
 * @route POST /api/users/google-login
 * @access Public
 */
export const googleLoginUser = asyncHandler(async (req, res) => {
  const { email, fullName, username, profilePicture } = req.body;

  // Get IP address and user agent
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const device = req.headers['user-agent'] || 'unknown';
  const location = await getLocationFromIp(ip);

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      email,
      username,
      fullName,
      profilePicture,
      provider: "google",
      isVerified: true,
      lastLogin: Date.now(),
      loginHistory: [{
        ip,
        device,
        location,
        timestamp: Date.now()
      }]
    });
    await user.save();
  } else {
    // Update lastLogin time and add login history entry
    user.lastLogin = Date.now();
    user.loginHistory.push({
      ip,
      device,
      location,
      timestamp: Date.now()
    });
    await user.save();
  }

  const token = generateToken(user._id);

  // Set cookie with an expiration date of 7 days
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(200).json(new ApiResponse(200, "User logged in with Google", {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    token,
  }));
});

/** 
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

/** 
 * @desc Check if username or email is available
 * @route POST /api/users/check-availability
 * @access Public
 */
export const checkUserAvailability = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  
  // Create query condition based on what was provided
  const query = {};
  if (username) query.username = username;
  if (email) query.email = email;
  
  // If neither username nor email was provided
  if (Object.keys(query).length === 0) {
    throw new ApiError(400, "Username or email is required");
  }
  
  const existingUser = await User.findOne(query);
  
  if (existingUser) {
    const field = existingUser.username === username ? "username" : "email";
    throw new ApiError(409, `This ${field} is already taken.`);
  }
  
  res.status(200).json(new ApiResponse(200, "Username and email are available"));
});

/** 
 * @desc Get logged-in user profile
 * @route GET /api/users/me
 * @access Public
 */
export const getLoggedInUser = asyncHandler(async (req, res) => {
  const userData = req.user;
  res.status(200).json(new ApiResponse(200, "User profile fetched", userData));
});

/** 
 * @desc Get user profile
 * @route GET /api/users/:identifier
 * @access Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  }).select("-password -email -provider -loginHistory -lastLogin");

  if (!user) throw new ApiError(404, "User not found.");

  res.status(200).json(new ApiResponse(200, "User profile fetched", user));
});

/** 
 * @desc Update user profile
 * @route PATCH /api/users/:userId
 * @access Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (req.user._id.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to update this profile.");
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-password -provider -loginHistory -lastLogin");
  if (!user) throw new ApiError(404, "User not found.");

  res.status(200).json(new ApiResponse(200, "User profile updated", user));
});

/** 
 * @desc Update user password
 * @route PATCH /api/users/:userId/password
 * @access Private
 */
export const updateUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (req.user._id.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to update this password.");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect.");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json(new ApiResponse(200, "Password updated successfully"));
});

/**
 * @desc Request password reset token
 * @route POST /api/users/forgot-password
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Please provide an email address.");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(200).json(
      new ApiResponse(200, "If an account with that email exists, a password reset link has been sent.")
    );
  }

  if (user.provider === "google") {
    return res.status(400).json(
      new ApiResponse(400, "This account is registered with Google Sign-In. Please use Google Login.", null)
    );
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const origin = req.headers.origin || "https://pixora-hub.vercel.app";
  const resetUrl = `${origin}/reset-password?token=${resetToken}`;

  const message = `You requested a password reset for your Pixora account.\n\nPlease click the link below to reset your password:\n\n${resetUrl}\n\nThis link is valid for 1 hour.\n\nIf you did not request this, please ignore this email.`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0d0f17; color: #ffffff; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #a855f7; font-size: 28px; margin: 0;">✨ Pixora</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Visual Inspiration & Creative Discovery</p>
      </div>
      <div style="background-color: #1a1d2d; padding: 30px; border-radius: 8px; border: 1px solid #2e354f;">
        <h2 style="color: #f8fafc; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Hello <strong>${user.fullName || user.username}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">We received a request to reset the password for your Pixora account.</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">Or copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #c084fc; word-break: break-all;">${resetUrl}</a></p>
        <p style="color: #64748b; font-size: 12px; margin-top: 25px; border-top: 1px solid #2e354f; padding-top: 15px;">This link is valid for <strong>1 hour</strong>. If you did not request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Pixora - Password Reset Request",
      message,
      html,
    });

    res.status(200).json(
      new ApiResponse(200, "Password reset email sent successfully.", { resetToken })
    );
  } catch (error) {
    console.error("Password reset email error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, `Email delivery failed: ${error.message || "Please check SMTP credentials."}`);
  }
});

/**
 * @desc Reset password using token
 * @route POST /api/users/reset-password
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required.");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired password reset token.");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, "Password has been reset successfully! You can now log in.")
  );
});

/** 
 * @desc Get all users
 * @route GET /api/users
 * @access Public
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -email -provider -loginHistory -lastLogin");
  res.status(200).json(new ApiResponse(200, "All Users fetched", users));
});

/** 
 * @desc Search users
 * @route GET /api/users/search
 * @access Public
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!query) throw new ApiError(400, "Search query is required.");

  const searchQuery = {
    $or: [
      { username: { $regex: query, $options: "i" } },
      { fullName: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ]
  };

  const users = await User.find(searchQuery)
    .select("_id username profilePicture fullName followersCount followingCount postsCount badge isVerified")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(searchQuery);

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(new ApiResponse(200, "Users fetched", users, metadata));
});

/** 
 * @desc Get user login history
 * @route GET /api/users/login-history
 * @access Private
 */
export const getLoginHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const user = await User.findById(userId).select("loginHistory");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Sort login history by timestamp in descending order (newest first)
  const sortedHistory = user.loginHistory.sort((a, b) => b.timestamp - a.timestamp);
  
  res.status(200).json(new ApiResponse(200, "Login history retrieved successfully", sortedHistory));
});

/** 
 * @desc Get user analytics
 * @route GET /api/users/analytics
 * @access Private
 */
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { timeRange = 'week' } = req.query;

  // Calculate date range based on timeRange
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Get user data
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Mock analytics data (in a real app, you'd calculate this from actual data)
  const analytics = {
    views: {
      total: user.viewsCount || Math.floor(Math.random() * 10000) + 1000,
      change: Math.floor(Math.random() * 20) + 5
    },
    downloads: {
      total: user.downloadsCount || Math.floor(Math.random() * 500) + 50,
      change: Math.floor(Math.random() * 15) + 3
    },
    shares: {
      total: user.sharesCount || Math.floor(Math.random() * 200) + 20,
      change: Math.floor(Math.random() * 25) + 8
    },
    engagement: {
      total: user.engagementRate || Math.floor(Math.random() * 20) + 5,
      change: Math.floor(Math.random() * 10) + 2
    },
    topImages: [
      {
        id: '1',
        title: 'Mountain Landscape',
        views: Math.floor(Math.random() * 1000) + 500,
        likes: Math.floor(Math.random() * 100) + 20
      },
      {
        id: '2',
        title: 'Urban Photography',
        views: Math.floor(Math.random() * 800) + 300,
        likes: Math.floor(Math.random() * 80) + 15
      },
      {
        id: '3',
        title: 'Nature Close-up',
        views: Math.floor(Math.random() * 600) + 200,
        likes: Math.floor(Math.random() * 60) + 10
      }
    ],
    recentActivity: [
      {
        type: 'upload',
        title: 'New image uploaded',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        type: 'like',
        title: 'Received 5 new likes',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        type: 'comment',
        title: 'New comment on your image',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'First 100 Views',
        description: 'Reached 100 total views',
        unlocked: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: '10 Images Uploaded',
        description: 'Uploaded 10 images',
        unlocked: true,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: '50 Followers',
        description: 'Gained 50 followers',
        unlocked: false,
        progress: 35
      }
    ]
  };

  res.status(200).json(new ApiResponse(200, "User analytics retrieved successfully", analytics));
});