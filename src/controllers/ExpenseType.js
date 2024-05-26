import ExpenseType from "../models/ExpenseType";
import Expense from "../models/Expense";
import ExpenseCategory from "../models/ExpenseCategory";

class ExpenseTypeController {
  async index(req, res) {
    try {
      const types = await ExpenseType.findAll({
        attributes: ["id", "type"],
        include: [
          {
            model: Expense,
            as: "expenses",
            attributes: ["id", "date", "amount", "description"],
          },
          {
            model: ExpenseCategory,
            as: "categories",
            attributes: ["id", "category_name"],
          },
        ],
      });
      res.json(types);
    } catch (err) {
      res.status(400).json({ errors: ["Erro ao buscar tipos de despesas"] });
    }
  }

  async store(req, res) {
    const { type } = req.body;

    if (!type) {
      return res
        .status(401)
        .json({ errors: ["Tipo de despesa não pode ser nulo"] });
    }

    try {
      const typeExist = await ExpenseType.findOne({ where: { type } });
      if (typeExist) {
        return res.status(401).json({ errors: ["Tipo de despesa já existe"] });
      }

      const expenseType = await ExpenseType.create({ type });
      return res.json(expenseType);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao criar tipo de despesa"] });
    }
  }

  async update(req, res) {
    const { type, id } = req.body;
    const errors = [];

    try {
      const expenseType = await ExpenseType.findByPk(id);

      if (type && type !== expenseType.type) {
        const typeExist = await ExpenseType.findOne({ where: { type } });
        if (typeExist) errors.push("Tipo de despesa já existe");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      const updatedExpenseType = await expenseType.update(req.body);
      return res.json(updatedExpenseType);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao atualizar tipo de despesa"] });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const errors = [];

    try {
      const expenseType = await ExpenseType.findByPk(id);
      if (!expenseType) {
        errors.push("Tipo de despesa não localizado");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await expenseType.destroy();
      return res
        .status(200)
        .json({ message: "Tipo de despesa excluído com sucesso" });
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao excluir tipo de despesa"] });
    }
  }
}

export default new ExpenseTypeController();
