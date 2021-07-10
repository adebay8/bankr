"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });
      Customer.hasMany(models.CustomerTransactionInitialization);
    }
  }
  Customer.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      integration: { type: DataTypes.STRING(20), defaultValue: "0" },
      customer_code: { type: DataTypes.STRING(100), defaultValue: "0" },
      customer_id: { type: DataTypes.INTEGER, defaultValue: 0 },
      wallet_balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      wallet_passcode: { type: DataTypes.STRING(256), allowNull: true },
      payable: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      blocked: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Customer",
      underscored: true,
    }
  );
  return Customer;
};
