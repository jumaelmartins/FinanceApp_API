import Sequelize, { Model } from "sequelize";
import bcryptjs from "bcryptjs";

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        username: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: { msg: "nome de usuario já existe" },
        },
        email: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: { msg: "email já existe" },
        },
        password_hash: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        password: {
          type: Sequelize.VIRTUAL,
          defaultValue: "",
          validate: {
            len: {
              args: [6, 20],
              msg: "Senha deve ter entre 6 e 20 caracteres",
            },
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }

  passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.Expense, { foreignKey: "user_id", as: "expenses" });
    this.hasMany(models.ProfilePicture, {
      foreignKey: "user_id",
      as: "picture",
    });
    this.hasMany(models.Income, { foreignKey: "user_id", as: "incomes" });
    this.hasMany(models.ExpensePlanning, {
      foreignKey: "user_id",
      as: "expensePlanning",
    });
    this.hasMany(models.IncomePlanning, {
      foreignKey: "user_id",
      as: "incomePlanning",
    });
  }
}
