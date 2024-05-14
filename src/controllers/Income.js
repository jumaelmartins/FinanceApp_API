import Income from "../models/Income";


class IncomeController {
  async index(req, res) {
    const income = await Income.findAll();

    res.json(income);
  }

  async store(req, res) {
    const { date, category_id, amount, description } = req.body;

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

    const income = await Income.create({
      user_id: req.userId,
      category_id,
      date,
      amount,
      description,
    });

    return res.json(income);
  }

  async update(req, res) {
    const { date, category_id, id, amount, description } = req.body;
    const income = await Income.findByPk(id);
    const errors = [];

    if (amount !== Income.amount) {
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
  }

  async delete(req, res) {
    const { id } = req.body;
    const income = await Income.findByPk(id);

    const errors = [];

    if (!income) {
      errors.push("Categoria não localizada");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    income.destroy();
    return res.status(200).json({ Tudo: "OK" });
  }
}

export default new IncomeController();
