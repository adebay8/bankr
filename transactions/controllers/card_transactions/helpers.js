const dotenv = require("dotenv");
const { updateCardTransaction } = require("../../models");
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
