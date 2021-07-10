"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Customers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      integration: {
        type: Sequelize.STRING(20),
        defaultValue: "0",
      },
      customer_code: {
        type: Sequelize.STRING(100),
        defaultValue: "0",
      },
      customer_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      wallet_balance: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      wallet_passcode: {
        type: Sequelize.STRING(256),
        allowNull: true,
      },
      payable: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      blocked: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Customers");
  },
};
