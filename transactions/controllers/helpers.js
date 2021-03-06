const { v4 } = require("uuid");
const models = require("../../database/models");
const moment = require("moment");

async function creditAccount({
  amount,
  account_id,
  purpose,
  reference = v4(),
  metadata,
  t,
}) {
  const account = await models.accounts.findOne({ where: { id: account_id } });

  if (!account) {
    return {
      success: false,
      error: "Account does not exist",
    };
  }

  await models.accounts.increment(
    { balance: amount },
    { where: { id: account_id }, transaction: t }
  );

  await models.transactions.create(
    {
      txn_type: "credit",
      purpose,
      amount,
      account_id,
      reference,
      metadata,
      balance_before: Number(account.balance),
      balance_after: Number(account.balance) + Number(amount),
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    { transaction: t, lock: t.LOCK.UPDATE }
  );

  return {
    success: true,
    message: "Credit Successful",
  };
}

async function debitAccount({
  amount,
  account_id,
  purpose,
  reference = v4(),
  metadata,
  t,
}) {
  const account = await models.accounts.findOne({ where: { id: account_id } });

  if (!account) {
    return {
      success: false,
      error: "Account does not exist",
    };
  }

  if (Number(account.balance) < amount) {
    return {
      success: false,
      error: "insufficient balance",
    };
  }

  await models.accounts.increment(
    { balance: -amount },
    { where: { id: account_id }, transaction: t }
  );

  await models.transactions.create(
    {
      txn_type: "debit",
      purpose,
      amount,
      account_id,
      reference,
      metadata,
      balance_before: Number(account.balance),
      balance_after: Number(account.balance) - Number(amount),
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    { transaction: t, lock: t.LOCK.UPDATE }
  );

  return {
    success: true,
    message: "Debit successful",
  };
}

function referenceGenerator(randomString = "") {
  return "bk" + moment(Date.now()).format("mmyyhms") + randomString;
}

module.exports = { creditAccount, debitAccount, referenceGenerator };
