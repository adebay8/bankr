"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("transactions", "purpose", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("transactions", "purpose", {
      type: Sequelize.ENUM("deposit", "transfer", "reversal", "card_funding"),
      allowNull: false,
    });
  },
};
