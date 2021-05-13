const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const PAYSTACK_BASE_URL = "https://api.paystack.co";

const paystack = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

exports.chargeCardWithPaystack = async ({
  pan,
  expiry_month,
  expiry_year,
  cvv,
  email,
  amount,
}) => {
  try {
    const chargeCard = await paystack.post("/charge", {
      email: email,
      amount: amount,
      card: {
        number: pan,
        cvv: cvv,
        expiry_month,
        expiry_year,
      },
    });

    return {
      success: true,
      message: "card charge attempted",
      data: chargeCard.data,
    };
  } catch (error) {
    return {
      message: "error while attempting card charge",
      success: false,
      data: error.response.data,
    };
  }
};

exports.verifyTransaction = async (reference) => {
  const transactionResult = await paystack.get(
    `/transaction/verify/${reference}`
  );
  return transactionResult.data;
};

exports.submitChargePin = async ({ reference, pin }) => {
  const submitResult = await paystack.post("/charge/submit_pin", {
    reference,
    pin,
  });
  return submitResult.data;
};

exports.submitChargeOTP = async ({ reference, otp }) => {
  const submitOTPResult = await paystack.post("/charge/submit_otp", {
    otp,
    reference,
  });
  return submitOTPResult.data;
};

exports.submitChargePhone = async ({ reference, phone }) => {
  const submitPhoneResult = await paystack.post("/charge/submit_phone", {
    reference,
    phone,
  });
  return submitPhoneResult.data;
};

exports.getBankList = async ({ country, payWithBank = false }) => {
  const bankList = await paystack.get("/bank", null, {
    params: { country, pay_with_bank: payWithBank },
  });

  return bankList.data;
};

exports.chargeCardWithAuthorization = async ({
  email,
  amount,
  authorization_code,
}) => {
  const chargeResult = await paystack.post(
    "/transaction/charge_authorization",
    {
      email,
      amount,
      authorization_code,
    }
  );

  return chargeResult.data;
};
