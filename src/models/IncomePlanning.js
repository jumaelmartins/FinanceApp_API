import Sequelize, { Model } from "sequelize";

export default class IncomePlanning extends Model {
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
        tableName: "income_planning",
      }
    );
    this.addHook("beforeSave", async (income_planning) => {
      if (income_planning.month) {
        const date = new Date(income_planning.month);
        const month = date.getMonth() + 2;
        const year = date.getFullYear();
        income_planning.month = `${month}/${year}`;
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.IncomeCategory, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}
