import Expense from "../models/Expense";
import ExpenseCategory from "../models/ExpenseCategory";
import ExpenseType from "../models/ExpenseType";
import PayMethod from "../models/PayMethod";

class ExpenseController {
  async index(req, res) {
    try {
      const expense = await Expense.findAll({
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

      res.json(expense);
    } catch (err) {
      res.status(400).json({ errors: "(T_T)" });
    }
  }

  async store(req, res) {
    const { date, category_id, amount, description, type_id, pay_method_id } =
      req.body;

    const errors = [];

    if (!category_id) {
      errors.push("Categoria não informada");
    }

    if (!date) {
      errors.push("Data não informado");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    const expense = await Expense.create({
      user_id: req.userId,
      category_id,
      date,
      amount,
      description,
      type_id,
      pay_method_id,
    });
    return res.json(expense);
  }

  async update(req, res) {
    const { id, amount } = req.body;
    const expense = await Expense.findByPk(id);
    const errors = [];

    if (amount !== expense.amount) {
      if (amount === "") {
        errors.push("Valor não pode ser nulo");
      }
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    await expense.update(req.body);
    return res.json(req.body);
  }

  async delete(req, res) {
    const { id } = req.body;
    const expense = await Expense.findByPk(id);

    const errors = [];

    if (!expense) {
      errors.push("Categoria não localizada");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    expense.destroy();
    return res.status(200).json({ Tudo: "OK" });
  }
}

export default new ExpenseController();
