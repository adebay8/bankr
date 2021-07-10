const { createCustomer } = require("../../models");
const { createCustomerWallet } = require("../paystack");

exports.createUserWallet = async (user) => {
  const data = {
    email: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone_number,
  };

  try {
    const createWalletResult = await createCustomerWallet(data);
    if (!createWalletResult.success) return { createWalletResult };

    const saveData = {
      user_id: user.id,
      integration: createWalletResult.data.integration,
      customer_code: createWalletResult.data.customer_code,
      customer_id: createWalletResult.data.id,
    };

    const customer = await createCustomer(saveData);

    return { status: true, customer };
  } catch (error) {
    if (error.response) {
      return { ...error.response.data };
    }
    return { ...error };
  }
};
