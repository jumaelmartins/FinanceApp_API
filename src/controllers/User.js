import * as Yup from "yup";
import User from "../models/User";
import Expense from "../models/Expense";

import ProfilePicture from "../models/ProfilePicture";
import Income from "../models/Income";
import ExpensePlanning from "../models/ExpensePlanning";
import IncomePlanning from "../models/IncomePlanning";

class UserController {
  async show(req, res) {
    const { id } = req.body;
    console.log(id);
    const user = await User.findOne({
      where: { id: id },
      attributes: ["id", "username", "email"],
      include: [
        {
          model: Expense,
          as: "expenses",
          attributes: ["id", "date", "amount", "description"],
        },
        {
          model: Income,
          as: "incomes",
          attributes: ["id", "date", "amount"],
        },
        {
          model: ExpensePlanning,
          as: "expansePlanning",
          attributes: ["id", "month", "planned_amount"],
        },
        {
          model: IncomePlanning,
          as: "incomePlanning",
          attributes: ["id", "month", "planned_amount"],
        },
        {
          model: ProfilePicture,
          as: "picture",
          attributes: ["id", "name", "url"],
        },
      ],
    });

    res.json(user);
  }

  async store(req, res) {
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(401).json({
        errors: ["usuario já existe"],
      });
    }
    const { id, username } = await User.create(req.body);
    res.json({ id, username, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      username: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    const user = await User.findByPk(req.userId);
    const { username, email, oldPassword } = await req.body;

    let errors = [];

    if (username && username !== user.username) {
      const usernameExist = await User.findOne({
        where: { username: username },
      });
      usernameExist !== null ? errors.push("Usuario já existe") : "";
    }

    console.log("aqui");
    if (email && email !== user.email) {
      const emailExist = await User.findOne({
        where: { email: email },
      });
      emailExist !== null ? errors.push("Email já existe") : "";
    }

    if (oldPassword && !(await user.passwordIsValid(oldPassword))) {
      errors.push("Senha Incorreta");
    }

    if (!(await schema.isValid(req.body))) {
      errors.push("As duas senhas precisam ser iguais");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors.map((e) => {
          return e;
        }),
      });
    }

    const { id } = await user.update(req.body);

    return res.json({
      id,
      username,
      email,
    });
  }
}

export default new UserController();
