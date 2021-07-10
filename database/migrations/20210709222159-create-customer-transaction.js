"use strict";
const { v4: uuidv4 } = require("uuid");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CustomerTransactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        unique: true,
        allowNull: false,
      },
      customer: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reference: { type: Sequelize.STRING(50) },
      status: { type: Sequelize.STRING(50), defaultValue: "pending" },
      type: { type: Sequelize.STRING(50), defaultValue: "incoming" },
      remark: { type: Sequelize.STRING(255), allowNull: true },
      tag: { type: Sequelize.STRING(50), defaultValue: "general" },
      verification: { type: Sequelize.BOOLEAN, defaultValue: false },
      amount: { type: Sequelize.DECIMAL(20, 4) },
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
    await queryInterface.dropTable("CustomerTransactions");
  },
};
