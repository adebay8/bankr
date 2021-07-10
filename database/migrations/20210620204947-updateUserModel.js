"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("users", "first_name", Sequelize.STRING),
      queryInterface.addColumn("users", "last_name", Sequelize.STRING),
      queryInterface.addColumn("users", "phone_number", Sequelize.STRING),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn("users", "first_name"),
      queryInterface.removeColumn("users", "last_name"),
      queryInterface.removeColumn("users", "phone_number"),
    ]);
  },
};
