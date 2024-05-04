import User from "../models/User";
import * as Yup from "yup";

class UserController {
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
