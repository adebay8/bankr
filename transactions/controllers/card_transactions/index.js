const {
  createCardTransaction,
  findCardTransactionByReference,
} = require("../../models");
const { creditAccount } = require("../helpers");
const {
  processInitialCharge,
  processAccountCredit,
  processTransactionResult,
} = require("./helpers");
const {
  chargeCardWithPaystack,
  submitChargePin,
  submitChargeOTP,
  submitChargePhone,
} = require("./paystack");
const models = require("../../../database/models");

exports.creditAccountFromCard = async (req, res, next) => {
  const { account_id, pan, expiry_month, expiry_year, cvv, email, amount } =
    req.body;

  try {
    const chargeResult = await chargeCardWithPaystack({
      pan,
      expiry_month,
      expiry_year,
      cvv,
      email,
      amount,
    });

    const nextAction = processInitialCharge(chargeResult);

    if (nextAction.hasOwnProperty("status")) {
      return res.status(400).json(nextAction);
    }

    await createCardTransaction({
      external_reference: nextAction.data.reference,
      amount,
      account_id,
      last_response: nextAction.success ? nextAction.message : nextAction.error,
    });

    if (!nextAction.success) {
      return res.status(400).json({
        success: nextAction.success,
        error: nextAction.error,
      });
    }

    const t = await models.sequelize.transaction();

    try {
      if (nextAction.data.shouldCreditAccount) {
        const accountCreditResult = await processAccountCredit({
          amount,
          account_id,
          reference: nextAction.data.reference,
          t,
        });
        return res.status(200).json(accountCreditResult);
      }
      return res.status(400).json(nextAction);
    } catch (error) {
      t.rollback();
      return res.status(400).json({
        success: false,
        error,
      });
    }
  } catch (error) {
    if (error.response) {
      return res.status(400).json({ error: error.response.data });
    }
    return res.status(400).json({ error });
  }
};

exports.submitPin = async (req, res, next) => {
  const { reference, pin } = req.body;

  try {
    const transaction = await findCardTransactionByReference(reference);

    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: "Transaction not found",
      });
    }

    if (transaction.dataValues.last_response === "success") {
      return res.status(400).json({
        success: false,
        error: "Transaction already succeeded",
      });
    }

    const charge = await submitChargePin({ reference, pin });

    const result = await processTransactionResult({
      charge,
      reference,
      transaction,
    });
    return res.status(200).json(result);
  } catch (error) {
    return error.response
      ? res.status(400).json(error.response.data)
      : res.status(400).json(error);
  }
};

exports.submitOTP = async (req, res, next) => {
  const { reference, otp } = req.body;

  try {
    const transaction = await findCardTransactionByReference(reference);

    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: "Transaction not found",
      });
    }

    if (transaction.last_response === "success") {
      return res.status(400).json({
        success: false,
        error: "Transaction already succeeded",
      });
    }

    const charge = await submitChargeOTP({ reference, otp });

    const result = await processTransactionResult({
      charge,
      reference,
      transaction,
    });
    return res.status(200).json(result);
  } catch (error) {
    return error.response
      ? res.status(400).json(error.response.data)
      : res.status(400).json(error);
  }
};

exports.submitPhone = async (req, res, next) => {
  const { reference, phone } = req.body;

  try {
    const transaction = await findCardTransactionByReference(reference);

    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: "Transaction not found",
      });
    }

    if (transaction.last_response === "success") {
      return res.status(400).json({
        success: false,
        error: "Transaction already succeeded",
      });
    }

    const charge = await submitChargePhone({ reference, phone });

    const result = await processTransactionResult({
      charge,
      reference,
      transaction,
    });
    return res.status(200).json(result);
  } catch (error) {
    return error.response
      ? res.status(400).json(error.response.data)
      : res.status(400).json(error);
  }
};
