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

exports.getCustomer = async (user_id) => {
  const customer = await models.Customer.findOne({ where: { user_id } });
  return customer;
};

exports.findUserById = async ({ id }) => {
  const user = await models.users.findOne({ where: { id } });
  return user;
};

exports.createCustomer = async (data) => {
  const customer = await models.Customer.create({
    ...data,
  });
  return customer;
};

exports.findCustomerById = async ({ id }) => {
  const result = await models.Customer.findOne({ where: { id } });
  return result;
};

exports.createCustomerTransactionInitialization = async ({
  reference,
  customer_id,
}) => {
  const transactionInitialization =
    await models.CustomerTransactionInitialization.create({
      reference,
      customer: customer_id,
    });
  return transactionInitialization;
};

exports.findTransactionInitializationByReference = async (reference) => {
  const result = await models.CustomerTransactionInitialization.findOne({
    where: { reference },
    attributes: [
      "uuid",
      "id",
      "status",
      "reference",
      "access_code",
      "customer",
      "created_at",
      "updated_at",
    ],
  });
  return result;
};

exports.createCustomerTransaction = async (data) => {
  const result = await models.CustomerTransaction.create({
    ...data,
  });

  return result;
};

exports.createCustomerCard = async (data) => {
  const result = await models.CustomerCard.create({
    ...data,
  });
  return result;
};

exports.findCustomerCard = async (data) => {
  const result = await models.CustomerCard.findOne({
    where: data,
    attributes: [
      "uuid",
      "authorization_code",
      "card_type",
      "last4",
      "exp_month",
      "exp_year",
      "bin",
      "bank",
      "channel",
      "reusable",
      "country_code",
      "customer",
      "default",
      "created_at",
      "updated_at",
    ],
  });
  return result;
};

exports.findCustomerCards = async (data) => {
  const result = await models.CustomerCard.findAll({
    where: data,
    attributes: [
      "uuid",
      "authorization_code",
      "card_type",
      "last4",
      "exp_month",
      "exp_year",
      "bin",
      "bank",
      "channel",
      "reusable",
      "country_code",
      "customer",
      "default",
      "created_at",
      "updated_at",
    ],
  });
  return result;
};
