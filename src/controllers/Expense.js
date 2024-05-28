import Expense from "../models/Expense";
import ExpenseCategory from "../models/ExpenseCategory";
import ExpenseType from "../models/ExpenseType";
import PayMethod from "../models/PayMethod";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

class ExpenseController {
  async index(req, res) {
    try {
      const expenses = await Expense.findAll({
        where: { user_id: req.userId },
        attributes: ["id", "date", "amount", "description"],
        include: [
          {
            model: ExpenseCategory,
            as: "category",
            attributes: ["id", "category_name"],
          },
          {
            model: ExpenseType,
            as: "type",
            attributes: ["id", "type"],
          },
          {
            model: PayMethod,
            as: "method",
            attributes: ["id", "method"],
          },
        ],
      });
      res.json(expenses);
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async store(req, res) {
    const { date, category_id, amount, description, pay_method_id } = req.body;

    if (!category_id) return res.status(401).json({errors: ["Categoria não pode ser null"]})
    if (!date) return res.status(401).json({errors: ["Data não pode ser null"]})

    const categoryExist = await ExpenseCategory.findOne({
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
        .status(400)
        .json({ error: ["Categoria Informada não Existe"] });
    }

    const payMethodExist = await PayMethod.findOne({
      where: {
        id: pay_method_id,
        [Op.or]: [
          { user_id: req.userId },
          { user_id: process.env.SYSTEM_USER_ID },
        ],
      },
    });

    if (!payMethodExist) {
      return res
        .status(400)
        .json({ error: ["Pay Merhod Informado não Existe"] });
    }

    try {
      const expense = await Expense.create({
        user_id: req.userId,
        category_id,
        date,
        amount,
        description,
        type_id: categoryExist.type_id,
        pay_method_id,
      });
      return res.json(expense);
    } catch (error) {
      return res.status(400).json({ errors: ["Erro ao criar despesa"] });
    }
  }

  async update(req, res) {
    const { amount, category_id, pay_method_id } = req.body;
    const id = req.params.id;
    const errors = [];

    try {
      const expense = await Expense.findByPk(id);

      if (!expense) {
        return res.status(404).json({
          error: ["Despesa não localizada"],
        });
      }

      if (category_id && category_id !== expense.category_id) {
        const categoryExist = await ExpenseCategory.findOne({
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
            .status(400)
            .json({ error: ["Categoria Informada não Existe"] });
        }
      }

      if (pay_method_id && pay_method_id !== expense.pay_method_id) {
        const payMethodExist = await ExpenseCategory.findOne({
          where: {
            id: pay_method_id,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });
        if (!payMethodExist) {
          return res
            .status(400)
            .json({ error: ["Pay Method Informado não Existe"] });
        }
      }

      if (expense.user_id !== req.userId) {
        return res.status(403).json({
          error: ["Usuario não autorizado"],
        });
      }

      if (amount && amount === "") {
        errors.push("Valor não pode ser nulo");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await expense.update(req.body);
      return res.json(expense);
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao atualizar despesa"] });
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      const expense = await Expense.findByPk(id);
      if (!expense) {
        return res.status(404).json({
          error: ["Despesa não localizada"],
        });
      }

      if (expense.user_id !== req.userId) {
        return res.status(403).json({
          error: ["Usuario não autorizado"],
        });
      }

      await expense.destroy();
      return res.status(200).json({ message: "Despesa excluída com sucesso" });
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao excluir despesa"] });
    }
  }
}

export default new ExpenseController();
