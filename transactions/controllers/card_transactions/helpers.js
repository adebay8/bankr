const axios = require("axios");
const dotenv = require("dotenv");
const {
  findCardTransactionByReference,
  updateCardTransaction,
} = require("../../models");
const {
  submitChargePin,
  submitChargeOTP,
  submitChargePhone,
} = require("./paystack");
const models = require("../../../database/models");
const { creditAccount } = require("../helpers");

dotenv.config();

exports.processInitialCharge = (chargeResult) => {
  var chargeResult = chargeResult.data;

  try {
    if (chargeResult.data.status === "success") {
      return {
        success: true,
        message: chargeResult.data.status,
        data: {
          shouldCreditAccount: true,
          ...chargeResult.data,
        },
      };
    }

    return {
      success: chargeResult.status,
      message: chargeResult.data.status,
      error: chargeResult.data.message || "",
      data: {
        shouldCreditAccount: false,
        ...chargeResult.data,
      },
    };
  } catch (error) {
    return {
      ...chargeResult,
      error: "large transaction amount",
    };
  }
};

exports.processAccountCredit = async ({ amount, account_id, reference, t }) => {
  const creditResult = await creditAccount({
    amount,
    account_id,
    purpose: "card_funding",
    metadata: {
      external_reference: reference,
    },
    t,
  });

  if (!creditResult.success) {
    await t.rollback();
    return {
      success: false,
      error: creditResult.error,
    };
  }

  await t.commit();
  return {
    success: true,
    message: "Account successfully credited",
  };
};

exports.completeCardTransaction = async ({ account_id, reference, amount }) => {
  await updateCardTransaction({ last_response: "success" }, reference);

  const t = await models.sequelize.transaction();

  const accountCreditResult = await this.processAccountCredit({
    amount,
    account_id,
    reference,
    t,
  });

  return accountCreditResult;
};

exports.processTransactionResult = async ({
  charge,
  reference,
  transaction,
}) => {
  try {
    if (charge.data.status === "success") {
      const transactionResult = await this.completeCardTransaction({
        account_id: transaction.account_id,
        reference,
        amount: transaction.amount,
      });
      if (!transactionResult.success) {
        return {
          ...transactionResult,
          data: {
            shouldCreditAccount: false,
            reference,
          },
        };
      }
      return transactionResult;
    }

    await updateCardTransaction(
      { last_response: charge.data.status },
      reference
    );
    return {
      success: true,
      message: charge.data.status,
      data: {
        shouldCreditAccount: false,
        reference,
      },
    };
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

exports.submitPin = async ({ reference, pin }) => {
  try {
    const transaction = await findCardTransactionByReference(reference);

    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    if (transaction.dataValues.last_response === "success") {
      return {
        success: false,
        error: "Transaction already succeeded",
      };
    }

    const charge = await submitChargePin({ reference, pin });

    const result = await this.processTransactionResult({
      charge,
      reference,
      transaction,
    });
    return result;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

exports.submitOTP = async ({ reference, otp }) => {
  try {
    const transaction = await findCardTransactionByReference(reference);

    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    if (transaction.last_response === "success") {
      return {
        success: false,
        error: "Transaction already succeeded",
      };
    }

    const charge = await submitChargeOTP({ reference, otp });

    const result = await this.processTransactionResult({
      charge,
      reference,
      transaction,
    });
    return result;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

exports.submitPhone = async ({ reference, phone }) => {
  try {
    const transaction = await findCardTransactionByReference(reference);

    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    if (transaction.last_response === "success") {
      return {
        success: false,
        error: "Transaction already succeeded",
      };
    }

    const charge = await submitChargePhone({ reference, phone });

    const result = await this.processTransactionResult({
      charge,
      reference,
      transaction,
    });
    return result;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};
