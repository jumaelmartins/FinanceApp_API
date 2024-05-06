import IncomePlanning from "../models/IncomePlanning";

class IncomePlanningController {
  async index(req, res) {
    const plannedIncome = await IncomePlanning.findAll();
    res.json(plannedIncome);
  }

  async store(req, res) {
    const { month, category_id, planned_amount } = req.body;

    const errors = [];

    if (!category_id) {
      errors.push("Categoria não informada");
    }

    if (!month) {
      errors.push("Mês não informado");
    }

    const cdate = new Date(month);
    const cmonth = cdate.getMonth() + 2;
    const cyear = cdate.getFullYear();
    const nmonth = `${cmonth}/${cyear}`;

    const plannigExist = await IncomePlanning.findOne({
      where: { category_id: category_id, month: nmonth },
    });

    if (plannigExist) {
      errors.push("Já existe um planejamento dessa categoria no mês informado");
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
  }

  async update(req, res) {
    const { month, category_id, id, planned_amount } = req.body;
    const planning = await IncomePlanning.findByPk(id);
    const errors = [];

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
  }

  async delete(req, res) {
    const { id } = req.body;
    const plannig = await IncomePlanning.findByPk(id);

    const errors = [];

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
  }
}

export default new IncomePlanningController();
