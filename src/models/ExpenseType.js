import Sequelize, { Model } from "sequelize";

export default class ExpenseType extends Model {
  static init(sequelize) {
    super.init(
      {
        type: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: { msg: "categoria já existe" },
        },
      },
      {
        sequelize,
        tableName: "expense_type",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.hasMany(models.Expense, { foreignKey: "type_id", as: "expenses" });
    this.hasMany(models.ExpenseCategory, {
      foreignKey: "type_id",
      as: "categories",
    });
  }
}
