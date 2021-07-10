"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class CustomerTransactionInitialization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CustomerTransactionInitialization.belongsTo(models.Customer);
    }
  }
  CustomerTransactionInitialization.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        unique: true,
        allowNull: false,
      },
      status: { type: DataTypes.STRING(20), defaultValue: "pending" },
      reference: { type: DataTypes.STRING(50), unique: true },
      access_code: { type: DataTypes.STRING(50), allowNull: true },
      customer: {
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CustomerTransactionInitialization",
      underscored: true,
    }
  );
  return CustomerTransactionInitialization;
};
