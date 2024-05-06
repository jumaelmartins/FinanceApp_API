import Sequelize, { Model } from "sequelize";

export default class ExpensePlanning extends Model {
  static init(sequelize) {
    super.init(
      {
        month: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        planned_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: "",
        },
      },
      {
        sequelize,
        tableName: "expense_planning",
      }
    );
    this.addHook("beforeSave", async (expense_planning) => {
      if (expense_planning.month) {
        const date = new Date(expense_planning.month);
        const month = date.getMonth() + 2;
        const year = date.getFullYear();
        expense_planning.month = `${month}/${year}`;
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.ExpenseCategory, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}
