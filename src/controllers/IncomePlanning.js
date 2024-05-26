import IncomePlanning from "../models/IncomePlanning";

class IncomePlanningController {
  async index(req, res) {
    try {
      const plannedIncome = await IncomePlanning.findAll();
      res.json(plannedIncome);
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async store(req, res) {
    const { month, category_id, planned_amount } = req.body;
    const errors = [];

    try {
      if (!category_id) {
        errors.push("Categoria não informada");
      }

      if (!month) {
        errors.push("Mês não informado");
      }

      const plannigExist = await IncomePlanning.findOne({
        where: { category_id: category_id, month: month },
      });

      if (plannigExist) {
        errors.push(
          "Já existe um planejamento dessa categoria no mês informado"
        );
      }

      if (errors.length > 0) {
        return res.status(401).json({
          errors: errors.map((err) => err),
        });
      }

      const planning = await IncomePlanning.create({
        user_id: req.userId,
        category_id,
        month,
        planned_amount,
      });

      return res.json(planning);
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async update(req, res) {
    const { month, category_id, id, planned_amount } = req.body;
    const planning = await IncomePlanning.findByPk(id);
    const errors = [];

    try {
      if (planned_amount !== planning.planned_amount) {
        if (planned_amount === "") {
          errors.push("Valor não pode ser nulo");
        }
      }

      if (errors.length > 0) {
        return res.status(401).json({
          errors: errors.map((err) => err),
        });
      }

      await planning.update(req.body);
      return res.json({ month, category_id, id, planned_amount });
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const plannig = await IncomePlanning.findByPk(id);

    const errors = [];
    try {
      if (!plannig) {
        errors.push("Categoria não localizada");
      }

      if (errors.length > 0) {
        return res.status(401).json({
          errors: errors.map((err) => err),
        });
      }

      plannig.destroy();
      return res.status(200).json({ Tudo: "OK" });
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }
}

export default new IncomePlanningController();
