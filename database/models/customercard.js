"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class CustomerCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CustomerCard.belongsTo(models.Customer);
    }
  }
  CustomerCard.init(
    {
      uuid: { type: DataTypes.UUID, unique: true, defaultValue: uuidv4() },
      authorization_code: { type: DataTypes.STRING(20) },
      card_type: { type: DataTypes.STRING(20) },
      last4: { type: DataTypes.STRING(10) },
      exp_month: { type: DataTypes.STRING(10) },
      exp_year: { type: DataTypes.STRING(10) },
      bin: { type: DataTypes.STRING(20) },
      bank: { type: DataTypes.STRING(255) },
      channel: { type: DataTypes.STRING(20) },
      reusable: { type: DataTypes.STRING(20) },
      country_code: { type: DataTypes.STRING(20) },
      customer: {
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      default: { type: DataTypes.BOOLEAN, defaultValue: false },
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
      modelName: "CustomerCard",
      underscored: true,
    }
  );
  return CustomerCard;
};
