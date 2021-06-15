const joi = require("joi");
const { v4 } = require("uuid");
const models = require("../../../database/models");
const {
  initializeCustomerTransaction,
  verifyCustomerTransaction,
} = require("../paystack");

async function initializeTransaction(req, res, next) {
  const { email, amount, callbackUrl } = req.body;

  const schema = joi.object({
    email: joi.string().required(),
    amount: joi.string().required(),
    callbackUrl: joi.string().required(),
  });
  const validation = schema.validate({
    email,
    amount,
    callbackUrl,
  });

  if (validation.error) {
    return res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  try {
    const result = await initializeCustomerTransaction({
      email,
      amount,
      callback_url: callbackUrl,
    });

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    if (error.response) {
      return res.status(400).json({ error: error.response.data });
    }
    return res.status(400).json({ error });
  }
}

async function verifyTransaction(req, res, next) {
  const { reference } = req.body;

  const schema = joi.object({
    reference: joi.string().required(),
  });
  const validation = schema.validate({
    reference,
  });

  if (validation.error) {
    return res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  try {
    const result = await verifyCustomerTransaction(reference);

    if (result.status) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    if (error.response) {
      return res.status(400).json({ error: error.response.data });
    }
    return res.status(400).json({ error });
  }
}

module.exports = {
  initializeTransaction,
  verifyTransaction,
};
