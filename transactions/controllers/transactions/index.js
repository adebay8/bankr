const joi = require("joi");
const { v4 } = require("uuid");
const models = require("../../../database/models");
const { creditAccount, debitAccount } = require("../helpers");

// deposit in user account

/**
 * @param {number} account_id account_id of the account
 * @param {number} amount amount to deposit
 */
async function deposit(account_id, amount) {
  const schema = joi.object({
    account_id: joi.number().required(),
    amount: joi.number().min(1).required(),
  });
  const validation = schema.validate({ account_id, amount });
  if (validation.error) {
    return {
      success: false,
      error: validation.error.details[0].message,
    };
  }
  const t = await models.sequelize.transaction();
  try {
    const creditResult = await creditAccount({
      account_id,
      amount,
      purpose: "deposit",
      t,
    });

    if (!creditResult.success) {
      await t.rollback();
      return creditResult;
    }

    await t.commit();
    return {
      success: true,
      message: "deposit successful",
    };
  } catch (error) {
    await t.rollback();
    return {
      success: false,
      error: "An error occurred",
    };
  }
}

// withdraw from user account

/**
 * @param {number} account_id account_id of the account
 * @param {number} amount amount to withdraw
 */
async function withdraw(account_id, amount) {
  const schema = joi.object({
    account_id: joi.number().required(),
    amount: joi.number().min(1).required(),
  });
  const validation = schema.validate({ account_id, amount });

  if (validation.error) {
    return {
      success: false,
      error: validation.error.details[0].message,
    };
  }

  const t = await models.sequelize.transaction();

  try {
    const debitResult = await debitAccount({
      account_id,
      amount,
      purpose: "withdrawal",
      t,
    });

    if (!debitResult.success) {
      await t.rollback();
      return;
      debitResult;
    }
    await t.commit();
    return {
      success: true,
      message: "withdrawal successful",
    };
  } catch (error) {
    await t.rollback();

    return {
      success: false,
      message: "error occurred while processing transaction",
    };
  }
}

// transfer from one account to the other

/**
 * @param {number} sender_id account_id of the sender
 * @param {number} recipient_id account_id of the recipient
 * @param {number} amount amount to deposit
 */
async function transfer(sender_id, recepient_id, amount) {
  const schema = joi.object({
    sender_id: joi.number().required(),
    recepient_id: joi.number().required(),
    amount: joi.number().min(1).required(),
  });
  const validate = schema.validate({ sender_id, recepient_id, amount });
  if (validate.error) {
    return {
      success: false,
      error: validation.error.details[0].message,
    };
  }

  const t = await models.sequelize.transaction();

  try {
    const reference = v4();
    const purpose = "transfer";

    const transferResult = await Promise.all([
      debitAccount({
        amount,
        account_id: sender_id,
        purpose,
        reference,
        metadata: { recepient_id },
        t,
      }),
      creditAccount({
        amount,
        account_id: recepient_id,
        purpose,
        reference,
        metadata: {
          sender_id,
        },
        t,
      }),
    ]);

    const failedTxns = transferResult.filter((result) => !result.success);

    if (failedTxns.length) {
      await t.rollback();
      return transferResult;
    }

    await t.commit();

    return {
      success: true,
      message: "transfer successful",
    };
  } catch (error) {
    await t.rollback();
    return {
      success: false,
      error: "internal server error",
    };
  }
}

// reverse any transaction between two accounts

/**
 * @param {string} reference reference of the transaction to reverse
 */
async function reverse(reference) {
  const t = await models.sequelize.transaction();
  const txn_reference = v4();
  const purpose = "reversal";

  try {
    const transactions = await models.transactions.findAll(
      { where: { reference } },
      { transaction: t }
    );
    const transactionsArray = transactions.map((transaction) => {
      if (transaction.txn_type === "debit") {
        return creditAccount({
          amount: transaction.amount,
          account_id: transaction.account_id,
          metadata: {
            originalReference: transaction.reference,
          },
          purpose,
          reference: txn_reference,
          t,
        });
      }

      return debitAccount({
        amount: transaction.amount,
        account_id: transaction.account_id,
        metadata: {
          originalReference: reference,
        },
        purpose,
        reference: txn_reference,
        t,
      });
    });

    const reversalResult = await Promise.all(transactionsArray);
    const failedTxns = reversalResult.filter((result) => !result.success);

    if (failedTxns.length) {
      await t.rollback();
      return reversalResult;
    }

    await t.commit();
    return {
      success: true,
      message: "reversal successful",
    };
  } catch (error) {
    await t.rollback();
    return {
      success: false,
      error: "internal server error",
    };
  }
}

module.exports = {
  deposit,
  withdraw,
  transfer,
  reverse,
};
