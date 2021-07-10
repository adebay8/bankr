const joi = require("joi");
const AuthController = require("../../../authentication");
const {
  createCustomerTransactionInitialization,
  getCustomer,
  findTransactionInitializationByReference,
  createCustomerTransaction,
  createCustomerCard,
  findCustomerById,
  findCustomerCard,
} = require("../../models");
const { referenceGenerator } = require("../helpers");
const {
  initializeCustomerTransaction,
  verifyCustomerTransaction,
} = require("../paystack");

async function initializeTransaction(req, res, next) {
  const { email, amount, callbackUrl, token } = req.body;

  const schema = joi.object({
    email: joi.string().required(),
    amount: joi.string().required(),
    token: joi.string().required(),
    callbackUrl: joi.string().required(),
  });
  const validation = schema.validate({
    email,
    amount,
    callbackUrl,
    token,
  });

  if (validation.error) {
    return res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  try {
    const user = AuthController.isAuthenticated(token);
    if (user.error) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const customer = await getCustomer(user.id);

    const reference = referenceGenerator();
    const initializationResult = await createCustomerTransactionInitialization({
      reference,
      customer_id: customer.id,
    });

    const result = await initializeCustomerTransaction({
      reference,
      email,
      amount,
      callback_url: callbackUrl,
    });

    initializationResult.status = "completed";
    initializationResult.access_code = result.data.access_code;
    await initializationResult.save();

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
    let transactionInitialization =
      await findTransactionInitializationByReference(reference);

    if (!transactionInitialization) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reference" });
    }

    let customer_id = transactionInitialization.customer;

    const result = await verifyCustomerTransaction(reference);

    let transactionData = {
      customer_id,
      reference,
      status: result.data.status,
      type: "outgoing",
      amount: parseFloat(result.data.amount) / 100,
      remark: "Card Initialization",
    };

    if (result.data.status.toLowerCase() === "failed") {
      await createCustomerTransaction(transactionData);
      return res
        .status(200)
        .json({ success: true, error: res.data.gateway_response });
    }

    let authorizationData = result.data.authorization;

    let data = {
      customer: customer_id,
      authorization_code: authorizationData.authorization_code,
      card_type: authorizationData.card_type,
      last4: authorizationData.last4,
      exp_month: authorizationData.exp_month,
      exp_year: authorizationData.exp_year,
      bin: authorizationData.bin,
      bank: authorizationData.bank,
      channel: authorizationData.channel,
      reusable: authorizationData.reusable,
      country_code: authorizationData.country_code,
    };

    await createCustomerCard(data);

    const customerCard = await findCustomerCard({
      authorization_code: authorizationData.authorization_code,
    });

    let customerData = await findCustomerById({ id: customer_id });
    customerData.wallet_balance += parseFloat(result.data.amount) / 100;
    await customerData.save();

    const completedTransaction = await createCustomerTransaction(
      transactionData
    );

    if (result.status) {
      return res.status(200).json({
        success: true,
        transaction: completedTransaction,
        verifyTransaction: customerCard,
      });
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
