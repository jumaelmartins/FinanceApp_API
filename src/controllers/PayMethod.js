import PayMethod from "../models/PayMethod";
import Expense from "../models/Expense";

class PayMethodController {
  async index(req, res) {
    try {
      const methods = await PayMethod.findAll({
        attributes: ["id", "method"],
        include: [
          {
            model: Expense,
            as: "expenses",
            attributes: ["id", "date", "amount", "description"],
          },
        ],
      });
      res.json(methods);
    } catch (error) {
      res.status(400).json({ errors: ["Erro ao buscar métodos de pagamento"] });
    }
  }

  async store(req, res) {
    const { method } = req.body;

    if (!method) {
      return res
        .status(401)
        .json({ errors: ["Método de pagamento não pode ser nulo"] });
    }

    try {
      const methodExist = await PayMethod.findOne({ where: { method } });
      if (methodExist) {
        return res
          .status(401)
          .json({ errors: ["Método de pagamento já existe"] });
      }

      const payMethod = await PayMethod.create({ method });
      return res.json(payMethod);
    } catch (error) {
      return res
        .status(400)
        .json({ errors: ["Erro ao criar método de pagamento"] });
    }
  }

  async update(req, res) {
    const { method, id } = req.body;
    const errors = [];

    try {
      const payMethod = await PayMethod.findByPk(id);

      if (method && method !== payMethod.method) {
        const methodExist = await PayMethod.findOne({ where: { method } });
        if (methodExist) errors.push("Método de pagamento já existe");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      const updatedPayMethod = await payMethod.update(req.body);
      return res.json(updatedPayMethod);
    } catch (error) {
      return res
        .status(400)
        .json({ errors: ["Erro ao atualizar método de pagamento"] });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const errors = [];

    try {
      const payMethod = await PayMethod.findByPk(id);
      if (!payMethod) {
        errors.push("Método de pagamento não localizado");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await payMethod.destroy();
      return res
        .status(200)
        .json({ message: "Método de pagamento excluído com sucesso" });
    } catch (error) {
      return res
        .status(400)
        .json({ errors: ["Erro ao excluir método de pagamento"] });
    }
  }
}

export default new PayMethodController();
