import Expense from "../models/Expense";
import ExpenseCategory from "../models/ExpenseCategory";
import ExpenseType from "../models/ExpenseType";
import PayMethod from "../models/PayMethod";

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
    } catch (err) {
      res.status(400).json({ errors: "(T_T)" });
    }
  }

  async store(req, res) {
    const { date, category_id, amount, description, type_id, pay_method_id } =
      req.body;
    const errors = [];

    if (!category_id) errors.push("Categoria não informada");
    if (!date) errors.push("Data não informada");

    if (errors.length > 0) {
      return res.status(401).json({ errors });
    }

    try {
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
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao criar despesa"] });
    }
  }

  async update(req, res) {
    const { id, amount } = req.body;
    const errors = [];

    try {
      const expense = await Expense.findByPk(id);

      if (amount !== undefined && amount === "") {
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
    const { id } = req.body;
    const errors = [];

    try {
      const expense = await Expense.findByPk(id);
      if (!expense) {
        errors.push("Despesa não localizada");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await expense.destroy();
      return res.status(200).json({ message: "Despesa excluída com sucesso" });
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao excluir despesa"] });
    }
  }
}

export default new ExpenseController();
