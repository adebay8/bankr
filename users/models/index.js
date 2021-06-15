const models = require("../../database/models");

exports.findUserById = async ({ id }) => {
  const user = await models.users.findOne({ where: { id } });
  return user;
};
