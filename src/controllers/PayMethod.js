import PayMethod from "../models/PayMethod";

class PayMethodController {
  async index(req, res) {
    const method = await PayMethod.findAll();

    res.json(method);
  }

  async store(req, res) {
    const { method } = req.body;

    if (!method) {
      return res.status(401).json({
        errors: ["Categoria não pode ser null"],
      });
    }
    const methodExist = await PayMethod.findOne({
      where: { method: method },
    });

    if (methodExist) {
      return res.status(401).json({
        errors: ["Categoria já existe"],
      });
    }

    const methods = await PayMethod.create({
      user_id: req.userId,
      method,
    });
    return res.json(methods);
  }

  async update(req, res) {
    const { method, id } = req.body;
    const methods = await PayMethod.findByPk(id);

    const errors = [];

    if (method !== methods.method) {
      const methodExist = await PayMethod.findOne({
        where: { method: method },
      });
      methodExist !== null ? errors.push("Categoria já existe") : "";
      console.log(method, "Aqui", method);
    }

    if (errors.length > 0) {
      console.log("maior que 0");
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    const updatedMethod = await methods.update(req.body);
    return res.json(updatedMethod);
  }

  async delete(req, res) {
    const { id } = req.body;
    const methods = await PayMethod.findByPk(id);

    const errors = [];

    if (!methods) {
      errors.push("Categoria não localizada");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    methods.destroy();
    return res.status(200).json({ Tudo: "OK" });
  }
}

export default new PayMethodController();
