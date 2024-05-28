import PayMethod from "../models/PayMethod";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

class PayMethodController {
  async index(req, res) {
    try {
      const methods = await PayMethod.findAll({
        where: {
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
        attributes: ["id", "method"],
      });
      res.json(methods);
    } catch (error) {
      res.status(400).json({ errors: ["Erro ao buscar métodos de pagamento"] });
    }
  }

  async store(req, res) {
    const { method } = req.body;

    if (!method) {
      return res
        .status(400)
        .json({ errors: ["Método de pagamento não pode ser nulo"] });
    }

    try {
      const methodExist = await PayMethod.findOne({
        where: {
          method,
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
      });
      if (methodExist) {
        return res
          .status(400)
          .json({ errors: ["Método de pagamento já existe"] });
      }

      const payMethod = await PayMethod.create({ method });
      return res.json(payMethod);
    } catch (error) {
      return res
        .status(400)
        .json({ errors: ["Erro ao criar método de pagamento"] });
    }
  }

  async update(req, res) {
    const { method } = req.body;
    const id = req.params.id;
    const errors = [];

    try {
      const payMethod = await PayMethod.findByPk(id);

      if (!payMethod) {
        return res.status(404).json({
          error: ["Method não existe"],
        });
      }

      if (payMethod.user_id !== req.userId) {
        return res.status(403).json({
          errors: "Usuario não autorizado",
        });
      }

      if (method && method !== payMethod.method) {
        const methodExist = await PayMethod.findOne({
          where: {
            method,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });
        if (methodExist) errors.push("Método de pagamento já existe");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedPayMethod = await payMethod.update(req.body);
      return res.json(updatedPayMethod);
    } catch (error) {
      return res
        .status(400)
        .json({ errors: ["Erro ao atualizar método de pagamento"] });
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      const payMethod = await PayMethod.findByPk(id);
      if (!payMethod) {
        return res.status(404).json({
          errors: ["Method não existe"],
        });
      }

      if (payMethod.user_id !== req.userId) {
        return res.status(403).json({
          erros: ["Usuario não autorizado"],
        });
      }

      await payMethod.destroy();
      return res
        .status(200)
        .json({ message: "Método de pagamento excluído com sucesso" });
    } catch (error) {
      return res
        .status(400)
        .json({ errors: ["Erro ao excluir método de pagamento"] });
    }
  }
}

export default new PayMethodController();
