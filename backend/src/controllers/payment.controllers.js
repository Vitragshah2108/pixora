import crypto from "crypto";
import Razorpay from "razorpay";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper to get Razorpay instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

/**
 * @desc Get Razorpay Public Key ID
 * @route GET /api/payment/razorpay/key
 * @access Public
 */
export const getRazorpayKey = asyncHandler(async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  return res.status(200).json(
    new ApiResponse(200, "Razorpay key fetched successfully", {
      keyId,
      isConfigured: Boolean(keyId && process.env.RAZORPAY_KEY_SECRET),
    })
  );
});

/**
 * @desc Create Razorpay Order
 * @route POST /api/payment/razorpay/order
 * @access Protected
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { plan = "pro", currency = "INR" } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Authentication required to initiate checkout.");
  }

  // Plan pricing in INR (paise: 100 paise = 1 INR)
  const planPrices = {
    pro: 49900, // ₹499
    studio: 149900, // ₹1,499
  };

  const amount = planPrices[plan.toLowerCase()] || planPrices.pro;
  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    // If Razorpay keys are not yet configured in environment, return a mock order for seamless test mode
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return res.status(200).json(
      new ApiResponse(200, "Mock order created (Test mode active)", {
        orderId: mockOrderId,
        amount,
        currency,
        plan,
        keyId: "rzp_test_placeholder",
        isMock: true,
      })
    );
  }

  const options = {
    amount,
    currency,
    receipt: `pixora_${userId.toString().slice(-6)}_${Date.now()}`,
    notes: {
      userId: userId.toString(),
      plan,
    },
  };

  try {
    const order = await razorpay.orders.create(options);

    return res.status(200).json(
      new ApiResponse(200, "Razorpay order created successfully", {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan,
        keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        isMock: false,
      })
    );
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw new ApiError(500, `Failed to create payment order: ${error.message}`);
  }
});

/**
 * @desc Verify Razorpay Payment Signature and Upgrade User
 * @route POST /api/payment/razorpay/verify
 * @access Protected
 */
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan = "pro", isMock = false } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!isMock && keySecret) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new ApiError(400, "Missing required payment verification parameters.");
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      throw new ApiError(400, "Invalid payment signature. Transaction could not be verified.");
    }
  }

  // Upgrade user to Premium status
  user.isPremium = true;
  user.premiumPlan = plan.toLowerCase();
  user.premiumSince = new Date();
  user.badge = plan.toLowerCase() === "studio" ? "trendsetter" : "pro";
  user.razorpayOrderId = razorpayOrderId || `mock_${Date.now()}`;
  user.razorpayPaymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;

  await user.save({ validateBeforeSave: false });

  const safeUser = user.toObject();
  delete safeUser.password;

  return res.status(200).json(
    new ApiResponse(200, `Congratulations! You have upgraded to Pixora ${plan.toUpperCase()}!`, {
      user: safeUser,
      plan: user.premiumPlan,
      isPremium: true,
    })
  );
});
