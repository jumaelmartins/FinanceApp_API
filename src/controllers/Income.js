import { Op } from "sequelize";
import Income from "../models/Income";
import IncomeCategory from "../models/IncomeCategory";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class IncomeController {
  async index(req, res) {
    const income = await Income.findAll({ where: { user_id: req.userId },
      attributes: ["id", "date", "amount", "user_id", "description"],
      include: {
        model: IncomeCategory,
        as: "category",
        attributes: ["id", "category_name"]
      }
    });

    res.json(income);
  }

  async store(req, res) {
    const { date, category_id, amount, description } = req.body;

    const errors = [];

    if (!category_id) {
      errors.push("Categoria não informada");
    } else {
      const categoryExist = IncomeCategory.findOne({
        where: {
          id: category_id,
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
      });

      if (!categoryExist) {
        return res
          .status(404)
          .json({ errors: ["Categoria informada não existe"] });
      }
    }

    if (!date) {
      errors.push("Data não informado");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }
    try {
      const income = await Income.create({
        user_id: req.userId,
        category_id,
        date,
        amount,
        description,
      });

      return res.json(income);
    } catch (error) {
      return res.status(400).json({
        errors: "Somenthing's Went Wrong",
      });
    }
  }

  async update(req, res) {
    const { date, category_id, amount, description } = req.body;
    const id = req.params.id;
    const income = await Income.findByPk(id);
    const errors = [];

    try {
      if (!income) {
        return res.status(404).json({ errors: "Income não localizada" });
      }

      if (category_id && category_id !== income.category_id) {
        const categoryExist = IncomeCategory.findOne({
          where: {
            id: category_id,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });

        if (!categoryExist) {
          return res.status(404).json({ errors: ["Categoria não Existe"] });
        }
      }

      if (income.user_id !== req.userId) {
        return res.status(403).json({
          errors: ["Usuario não autotizado"],
        });
      }

      if (amount !== income.amount) {
        if (amount === "") {
          errors.push("Valor não pode ser nulo");
        }
      }

      if (errors.length > 0) {
        return res.status(401).json({
          errors: errors.map((err) => err),
        });
      }

      await income.update(req.body);
      return res.json({ date, category_id, id, amount, description });
    } catch (error) {
      return res.json({
        errors: ["Somenthing's Went Wrong"],
      });
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    const income = await Income.findByPk(id);
    const errors = [];

    try {
      if (!income) {
        errors.push("Categoria não localizada");
      }

      if (errors.length > 0) {
        return res.status(401).json({
          errors: errors.map((err) => err),
        });
      }

      if (income.user_id !== req.userId) {
        return res.status(403).json({
          errors: ["Usuario não autorizado"],
        });
      }

      income.destroy();
      return res.status(200).json({ Tudo: "OK" });
    } catch (error) {
      return res.status(400).json({
        errors: ["Somenthing's Went Wrong"],
      });
    }
  }
}

export default new IncomeController();
