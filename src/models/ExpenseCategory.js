import Sequelize, { Model } from "sequelize";

export default class ExpenseCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        category_name: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: { msg: "categoria já existe" },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.ExpenseType, { foreignKey: "type_id", as: "type" });
    this.hasMany(models.Expense, { foreignKey: "category_id", as: "expenses" });
    this.hasMany(models.ExpensePlanning, {
      foreignKey: "category_id",
      as: "plannedExpenses",
    });
  }
}
