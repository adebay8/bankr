const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  creditAccountFromCard,
  submitPin,
  submitOTP,
  submitPhone,
} = require("../controllers/card_transactions");
const {
  initializeTransaction,
  verifyTransaction,
} = require("../controllers/transactions");
const { createWallet, getWallet, getCards } = require("../controllers/wallets");
const router = require("express").Router();
dotenv.config();

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader == null)
    return res
      .status(401)
      .json({ success: false, message: "No authorization header was found" });

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({
      success: false,
      message: "No token provided in authorization header",
    });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  });
};

router.post("/initialize", isAuthenticated, initializeTransaction);

router.post("/verify", isAuthenticated, verifyTransaction);

router.post("/credit_wallet", isAuthenticated, creditAccountFromCard);

router.post("/submit_pin", isAuthenticated, submitPin);

router.post("/submit_otp", isAuthenticated, submitOTP);

router.post("/submit_phone", isAuthenticated, submitPhone);

router.get("/wallet", isAuthenticated, getWallet);

router.post("/wallet/create", isAuthenticated, createWallet);

router.get("/wallet/cards", isAuthenticated, getCards);

module.exports = router;
