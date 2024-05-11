import Expense from "../models/Expense";

class ExpenseController {
  async index(req, res) {
    const expense = await Expense.findAll();

    res.json(expense);
  }

  async store(req, res) {
    const { date, category_id, amount, description, type_id, pay_method_id } = req.body;

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
      pay_method_id
    });

    return res.json(expense);
  }

  async update(req, res) {
    const { date, category_id, id, amount, description } = req.body;
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
    return res.json({ date, category_id, id, amount, description });
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
