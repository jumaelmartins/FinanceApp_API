import Sequelize, { Model } from "sequelize";

export default class ProfilePicture extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: { msg: "foto já existe" },
        },
        url: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: { msg: "foto já existe" },
        },
      },
      {
        tableName: "profile_picture",
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}
