import User from "../models/User";
import jwt from "jsonwebtoken";
require("dotenv").config();

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const userExist = await User.findOne({ where: { email: email } });
    if (!userExist) {
      return res.json({
        errors: ["usuario não localizado"],
      });
    } else {
      const user = await User.findOne({ where: { email: email } });
      if (!(await user.passwordIsValid(password))) {
        return res.json({
          errors: ["senha incorreta"],
        });
      }

      const { id, username } = user;

      return res.json({
        user: {
          id,
          username,
          email,
        },
        token: jwt.sign({ id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }),
      });
    }
  }
}

export default new SessionController();
