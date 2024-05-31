import User from "../models/User";
import Expense from "../models/Expense";
import ProfilePicture from "../models/ProfilePicture";
import Income from "../models/Income";
import ExpensePlanning from "../models/ExpensePlanning";
import IncomePlanning from "../models/IncomePlanning";
import dotenv from "dotenv";

dotenv.config();

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ["id", "username", "email"],
    });

    res.json(users);
  }

  async show(req, res) {
    try {
      const id = req.params.id;

      if (req.userId !== parseInt(id)) {
        return res.status(403).json({
          Error: "Acesso Negado",
        });
      }

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
            as: "expensePlanning",
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
    } catch (error) {
      res.status(400).json({
        errors: ["Usuario não localizado"],
      });
    }
  }

  async store(req, res) {
    const { email, username } = req.body;
    const userExists = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (userExists) {
      return res.status(401).json({
        errors: ["email já cadastrado"],
      });
    }

    const newUser = {
      ...req.body,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    };

    try {
      const { id, username } = await User.create(newUser);
      res.json({ id, username, email });
    } catch (e) {
      res.status(400);
      console.log(e);
    }
  }

  async update(req, res) {
    const user = await User.findByPk(req.userId);
    const { username, email, oldPassword, confirmPassword, password } =
      await req.body;

    let errors = [];

    if (username && username.toLowerCase() !== user.username) {
      const usernameExist = await User.findOne({
        where: { username: username.toLowerCase() },
      });
      usernameExist !== null ? errors.push("Usuario já existe") : "";
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExist = await User.findOne({
        where: { email: email.toLowerCase() },
      });
      emailExist !== null ? errors.push("Email já existe") : "";
    }

    if ((oldPassword && !password) || (oldPassword && !confirmPassword)) {
      errors.push("Necessario informar nova senha");
    }

    if (oldPassword && !(await user.passwordIsValid(oldPassword))) {
      errors.push("Senha Incorreta");
    }

    if (password && !oldPassword) {
      errors.push("Informe a senha antiga");
    }

    if (password !== confirmPassword) {
      errors.push("As senhas precisam ser iguais");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors.map((e) => {
          return e;
        }),
      });
    }

    const updatedUser = {
      ...req.body,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    };

    try {
      const { id } = await user.update(updatedUser);

      return res.json({
        id,
        username,
        email,
      });
    } catch (error) {
      res.json({
        errors: error.errors.message,
      });
    }
  }
}

export default new UserController();
