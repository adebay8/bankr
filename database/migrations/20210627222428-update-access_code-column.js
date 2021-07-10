"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn(
      "customertransactioninitializations",
      "access_code",
      {
        type: Sequelize.STRING(50),
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn(
      "customertransactioninitializations",
      "access_code",
      {
        type: Sequelize.STRING(50),
        allowNull: false,
      }
    );
  },
};
