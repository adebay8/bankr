const models = require("../../database/models");

exports.createCardTransaction = async ({
  amount,
  external_reference,
  account_id,
  last_response,
}) => {
  await models.card_transactions.create({
    amount,
    external_reference,
    account_id,
    last_response,
  });
};

exports.findCardTransactionByReference = async (reference) => {
  const cardTransaction = await models.card_transactions.findOne({
    where: { external_reference: reference },
  });
  return cardTransaction;
};

exports.updateCardTransaction = async (data, reference) => {
  await models.card_transactions.update(data, {
    where: { external_reference: reference },
  });
};
