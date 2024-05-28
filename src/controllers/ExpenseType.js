import ExpenseType from "../models/ExpenseType";
import ExpenseCategory from "../models/ExpenseCategory";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class ExpenseTypeController {
  async index(req, res) {
    try {
      const types = await ExpenseType.findAll({
        where: {
          [Op.or]: [{ user_id: req.userId }, { user_id: 9001 }],
        },
        attributes: ["id", "type"],
        include: [
          {
            model: ExpenseCategory,
            as: "categories",
            attributes: ["id", "category_name"],
          },
        ],
      });
      res.json(types);
    } catch (err) {
      res.status(400).json({ errors: ["Erro ao buscar tipos de despesas"] });
    }
  }

  async store(req, res) {
    const { type } = req.body;
    if (!type) {
      return res
        .status(400)
        .json({ errors: ["Tipo de despesa não pode ser nulo"] });
    }
    try {
      const typeExist = await ExpenseType.findOne({
        where: {
          type,
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
      });
      if (typeExist) {
        return res.status(400).json({ errors: ["Tipo de despesa já existe"] });
      }

      const expenseType = await ExpenseType.create({
        type,
        user_id: req.userId,
      });
      return res.json(expenseType);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao criar tipo de despesa"] });
    }
  }

  async update(req, res) {
    const { type } = req.body;
    const id = req.params.id;
    const errors = [];

    try {
      const expenseType = await ExpenseType.findByPk(id);

      if (!expenseType) {
        return res.status(404).json({ errors: "Type não localizado" });
      }

      if (expenseType.user_id !== req.userId) {
        return res.status(403).json({ errors: "Usuario não authorizado" });
      }

      if (type && type !== expenseType.type) {
        const typeExist = await ExpenseType.findOne({
          where: {
            type,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });
        if (typeExist) errors.push("Tipo de despesa já existe");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map((e) => e) });
      }

      const updatedExpenseType = await expenseType.update(req.body);
      return res.json(updatedExpenseType);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao atualizar tipo de despesa"] });
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    const errors = [];

    try {
      const expenseType = await ExpenseType.findByPk(id);
      if (!expenseType) {
        return res.status(404).json({ errors: "Type não localizado" });
      }

      if (expenseType.user_id !== req.userId) {
        return res.status(403).json({ errors: "Usuario não authorizado" });
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await expenseType.destroy();
      return res
        .status(200)
        .json({ message: "Tipo de despesa excluído com sucesso" });
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao excluir tipo de despesa"] });
    }
  }
}

export default new ExpenseTypeController();
