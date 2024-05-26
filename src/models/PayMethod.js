import Sequelize, { Model } from "sequelize";

export default class PayMethod extends Model {
  static init(sequelize) {
    super.init(
      {
        method: {
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
  }
}
