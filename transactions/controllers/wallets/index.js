const joi = require("joi");
const AuthController = require("../../../authentication");
const {
  getCustomer,
  findUserById,
  findCustomerCards,
} = require("../../models");
const { createUserWallet } = require("./helpers");

async function createWallet(req, res, next) {
  const { token } = req.body;

  const schema = joi.object({
    token: joi.string().required(),
  });

  const validation = schema.validate({
    token,
  });

  if (validation.error) {
    return res.status(400).json({
      success: false,
      message: validation.error.details[0].message,
    });
  }

  try {
    const user = AuthController.isAuthenticated(token);

    if (user.error) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const customer = await getCustomer(user.id);

    if (customer) return res.status(200).json({ success: true, customer });

    let userModel;
    try {
      userModel = await findUserById({ id: user.id });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `User with user id ${user.id} not found`,
      });
    }

    const newCustomer = await createUserWallet(userModel);
    if (!newCustomer.status) {
      return res.status(400).json({ ...newCustomer });
    }

    return res.status(200).json({ ...newCustomer });
  } catch (error) {
    if (error.response) {
      return res.status(400).json({ error: error.response.data });
    }
    return res.status(400).json({ error });
  }
}

async function getWallet(req, res, next) {
  const customer = await getCustomer(req.user.id);
  if (!customer)
    return res.status(400).json({ success: false, message: "No user wallet" });
  return res.status(200).json({ success: true, customer });
}

async function getCards(req, res, next) {
  const customer = await getCustomer(req.user.id);
  if (customer) {
    const cards = await findCustomerCards({ customer: customer.id });
    return res.status(200).json({ success: true, cards });
  }
  return res.status(400).json({ success: false, message: "No user wallet" });
}

module.exports = {
  createWallet,
  getWallet,
  getCards,
};
