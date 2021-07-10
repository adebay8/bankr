"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class CustomerTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CustomerTransaction.belongsTo(models.Customer);
    }
  }
  CustomerTransaction.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        unique: true,
        allowNull: false,
      },
      customer: {
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reference: { type: DataTypes.STRING(50) },
      status: { type: DataTypes.STRING(50), defaultValue: "pending" },
      type: { type: DataTypes.STRING(50), defaultValue: "incoming" },
      remark: { type: DataTypes.STRING(255), allowNull: true },
      tag: { type: DataTypes.STRING(50), defaultValue: "general" },
      verification: { type: DataTypes.BOOLEAN, defaultValue: false },
      amount: { type: DataTypes.DECIMAL(20, 4) },
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
      modelName: "CustomerTransaction",
      underscored: true,
    }
  );
  return CustomerTransaction;
};
