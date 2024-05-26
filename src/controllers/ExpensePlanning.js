import ExpensePlanning from "../models/ExpensePlanning";

class ExpensePlanningController {
  async index(req, res) {
    try {
      const plannedExpenses = await ExpensePlanning.findAll();
      res.json(plannedExpenses);
    } catch (err) {
      res.status(400).json({ errors: ["Erro ao buscar planejamentos"] });
    }
  }

  async store(req, res) {
    const { month, category_id, planned_amount } = req.body;
    const errors = [];

    if (!category_id) errors.push("Categoria não informada");
    if (!month) errors.push("Mês não informado");

    try {
      const planningExist = await ExpensePlanning.findOne({
        where: { category_id, month },
      });

      if (planningExist)
        errors.push(
          "Já existe um planejamento dessa categoria no mês informado"
        );

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      const planning = await ExpensePlanning.create({
        user_id: req.userId,
        category_id,
        month,
        planned_amount,
      });
      return res.json(planning);
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao criar planejamento"] });
    }
  }

  async update(req, res) {
    const { month, category_id, id, planned_amount } = req.body;
    const errors = [];

    try {
      const planning = await ExpensePlanning.findByPk(id);

      if (planned_amount !== undefined && planned_amount === "") {
        errors.push("Valor não pode ser nulo");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await planning.update(req.body);
      return res.json(planning);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao atualizar planejamento"] });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const errors = [];

    try {
      const planning = await ExpensePlanning.findByPk(id);
      if (!planning) {
        errors.push("Planejamento não localizado");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await planning.destroy();
      return res
        .status(200)
        .json({ message: "Planejamento excluído com sucesso" });
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao excluir planejamento"] });
    }
  }
}

export default new ExpensePlanningController();
