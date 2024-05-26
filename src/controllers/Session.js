import User from "../models/User";
import jwt from "jsonwebtoken";
import { promisify } from "util";
require("dotenv").config();

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    try {
      if (email === undefined || password === undefined)
        return res.status(401).json({ errors: ["Informar usuario e Email"] });
      const userExist = await User.findOne({ where: { email: email } });
      if (!userExist) {
        return res.status(400).json({
          errors: ["usuario não localizado"],
        });
      } else {
        const user = await User.findOne({ where: { email: email } });
        if (!(await user.passwordIsValid(password))) {
          return res.status(400).json({
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
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong Here"] });
    }
  }

  async validate(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erros: ["Token Inexistente"],
      });
    }
    const [, token] = authHeader.split(" ");

    try {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.TOKEN_SECRET
      );

      if (decoded)
        return res.json({
          tokenIsvalid: true,
        });
    } catch (error) {
      return res.status(401).json({
        errors: ["Token Invalido"],
      });
    }
  }
}

export default new SessionController();
