"use strict";
const { v4: uuidv4 } = require("uuid");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CustomerCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: { type: Sequelize.UUID, unique: true, defaultValue: uuidv4() },
      authorization_code: { type: Sequelize.STRING(20) },
      card_type: { type: Sequelize.STRING(20) },
      last4: { type: Sequelize.STRING(10) },
      exp_month: { type: Sequelize.STRING(10) },
      exp_year: { type: Sequelize.STRING(10) },
      bin: { type: Sequelize.STRING(20) },
      bank: { type: Sequelize.STRING(255) },
      channel: { type: Sequelize.STRING(20) },
      reusable: { type: Sequelize.STRING(20) },
      country_code: { type: Sequelize.STRING(20) },
      customer: {
        type: Sequelize.INTEGER,
        references: {
          model: "Customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      default: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CustomerCards");
  },
};
