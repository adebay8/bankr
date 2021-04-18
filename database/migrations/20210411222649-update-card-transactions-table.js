"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("card_transactions", "id", {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("card_transactions", "amount", {
      allowNull: false,
      type: Sequelize.DECIMAL(20, 4),
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
