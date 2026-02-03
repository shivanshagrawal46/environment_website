import express from "express";
import crypto from "crypto";

const router = express.Router();

// Lazy load Razorpay to prevent server crash if not installed
let Razorpay = null;
const loadRazorpay = async () => {
  if (!Razorpay) {
    try {
      const razorpayModule = await import("razorpay");
      Razorpay = razorpayModule.default;
    } catch (err) {
      console.error("Razorpay package not installed. Run: npm install razorpay");
      return null;
    }
  }
  return Razorpay;
};

// Initialize Razorpay instance
const getRazorpayInstance = async () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
  }
  
  const RazorpayClass = await loadRazorpay();
  if (!RazorpayClass) {
    throw new Error("Razorpay package not installed");
  }
  
  return new RazorpayClass({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Public
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid amount. Minimum amount is ₹1" 
      });
    }

    const razorpay = await getRazorpayInstance();

    // Create order options
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    // Create the order
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to create payment order" 
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Public
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment verification details" 
      });
    }

    // Generate signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Verify signature
    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      // Payment is verified - you can save to database here if needed
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Payment verification failed - Invalid signature" 
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed" 
    });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay public key
// @access  Public
router.get("/key", (req, res) => {
  res.json({ 
    success: true, 
    key: process.env.RAZORPAY_KEY_ID 
  });
});

export default router;
