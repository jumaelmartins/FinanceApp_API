import Sequelize, { Model } from "sequelize";

export default class Expense extends Model {
  static init(sequelize) {
    super.init(
      {
        date: {
          type: Sequelize.DATEONLY,
          defaultValue: "",
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: "",
        },
        description: {
          type: Sequelize.STRING,
          defaultValue: "",
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "expenses",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.ExpenseCategory, {
      foreignKey: "category_id",
      as: "category",
    });
    this.belongsTo(models.ExpenseType, {
      foreignKey: "type_id",
      as: "type",
    });
    this.belongsTo(models.PayMethod, {
      foreignKey: "pay_method_id",
      as: "method",
    });
  }
}
