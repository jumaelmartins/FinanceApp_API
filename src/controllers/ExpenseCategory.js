import ExpenseCategory from "../models/ExpenseCategory";
import ExpensePlanning from "../models/ExpensePlanning";
import Expense from "../models/Expense";

class ExpenseCategoryController {
  async index(req, res) {
    try {
      const categories = await ExpenseCategory.findAll({
        attributes: ["id", "category_name"],
        include: [
          {
            model: ExpensePlanning,
            as: "plannedExpenses",
            attributes: ["id", "month", "planned_amount"],
          },
          {
            model: Expense,
            as: "expenses",
            attributes: ["id", "date", "amount"],
          },
        ],
      });
      res.json(categories);
    } catch (err) {
      res.status(400).json({ errors: ["Erro ao buscar categorias"] });
    }
  }

  async store(req, res) {
    const { category_name, type_id } = req.body;

    if (!category_name) {
      return res.status(401).json({ errors: ["Categoria não pode ser nula"] });
    }

    try {
      const categoryExist = await ExpenseCategory.findOne({
        where: { category_name },
      });
      if (categoryExist) {
        return res.status(401).json({ errors: ["Categoria já existe"] });
      }

      const category = await ExpenseCategory.create({
        user_id: req.userId,
        category_name,
        type_id,
      });
      return res.json(category);
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao criar categoria"] });
    }
  }

  async update(req, res) {
    const { category_name, id } = req.body;
    const errors = [];

    try {
      const category = await ExpenseCategory.findByPk(id);

      if (category_name && category_name !== category.category_name) {
        const categoryExist = await ExpenseCategory.findOne({
          where: { category_name },
        });
        if (categoryExist) errors.push("Categoria já existe");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      const updatedCategory = await category.update(req.body);
      return res.json(updatedCategory);
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao atualizar categoria"] });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const errors = [];

    try {
      const category = await ExpenseCategory.findByPk(id);
      if (!category) {
        errors.push("Categoria não localizada");
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      await category.destroy();
      return res
        .status(200)
        .json({ message: "Categoria excluída com sucesso" });
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao excluir categoria"] });
    }
  }
}

export default new ExpenseCategoryController();
