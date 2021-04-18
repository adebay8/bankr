const { createCardTransaction } = require("../../models");
const { creditAccount } = require("../helpers");
const { processInitialCharge, processAccountCredit } = require("./helpers");
const { chargeCardWithPaystack } = require("./paystack");
const models = require("../../../database/models");

exports.creditAccountFromCard = async ({
  account_id,
  pan,
  expiry_month,
  expiry_year,
  cvv,
  email,
  amount,
}) => {
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

    if (nextAction.error === "large transaction amount") {
      return nextAction;
    }

    await createCardTransaction({
      external_reference: nextAction.data.reference,
      amount,
      account_id,
      last_response: nextAction.success ? nextAction.message : nextAction.error,
    });

    if (!nextAction.success) {
      return {
        success: nextAction.success,
        error: nextAction.error,
      };
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
        return accountCreditResult;
      }
      return nextAction;
    } catch (error) {
      t.rollback();
      return {
        success: false,
        error,
      };
    }
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return error;
  }
};
