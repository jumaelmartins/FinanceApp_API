import Sequelize, { Model } from "sequelize";

export default class Income extends Model {
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
        tableName: "incomes",
      }
    );

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
