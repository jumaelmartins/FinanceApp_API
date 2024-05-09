import ExpenseType from "../models/ExpenseType";

class ExpenseTypeController {
  async index(req, res) {
    const type = await ExpenseType.findAll();

    res.json(type);
  }

  async store(req, res) {
    const { type } = req.body;

    if (!type) {
      return res.status(401).json({
        errors: ["Categoria não pode ser null"],
      });
    }
    const typeExist = await ExpenseType.findOne({
      where: { type: type },
    });

    if (typeExist) {
      return res.status(401).json({
        errors: ["Categoria já existe"],
      });
    }

    const types = await ExpenseType.create({
      user_id: req.userId,
      type,
    });
    return res.json(types);
  }

  async update(req, res) {
    const { type, id } = req.body;
    const types = await ExpenseType.findByPk(id);

    const errors = [];

    if (type !== types.type) {
      const typeExist = await ExpenseType.findOne({
        where: { type: type },
      });
      typeExist !== null ? errors.push("Categoria já existe") : "";
      console.log(type, "Aqui", type);
    }

    if (errors.length > 0) {
      console.log("maior que 0");
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    const updateType = await types.update(req.body);
    return res.json(updateType);
  }

  async delete(req, res) {
    const { id } = req.body;
    const types = await ExpenseType.findByPk(id);

    const errors = [];

    if (!types) {
      errors.push("Categoria não localizada");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    types.destroy();
    return res.status(200).json({ Tudo: "OK" });
  }
}

export default new ExpenseTypeController();
