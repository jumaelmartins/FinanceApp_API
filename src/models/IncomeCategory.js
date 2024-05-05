import Sequelize, { Model } from "sequelize";

export default class IncomeCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        category_name: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: {
            msg: "categoria já existe",
          },
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
  }
}
