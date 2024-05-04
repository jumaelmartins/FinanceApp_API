import jwt from "jsonwebtoken";
import { promisify } from "util";
require("dotenv").config();

export default async (req, res, next) => {
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

    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({
      errors: ["Token Invalido"],
    });
  }
};
