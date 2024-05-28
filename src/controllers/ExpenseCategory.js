import ExpenseCategory from "../models/ExpenseCategory";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class ExpenseCategoryController {
  async index(req, res) {
    try {
      const categories = await ExpenseCategory.findAll({
        where: {
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
        attributes: ["id", "category_name", "user_id"],
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
    const { category_name } = req.body;
    const id = req.params.id;
    const errors = [];
    try {
      const category = await ExpenseCategory.findByPk(id);
      if (!category) {
        return res.status(404).json({ errors: ["Categoria Não Localizada"] });
      }

      if (category.user_id !== req.userId) {
        return res.status(403).json({
          errors: ["Usuario não autorizado"],
        });
      }

      if (category_name && category_name !== category.category_name) {
        const categoryExist = await ExpenseCategory.findOne({
          where: { category_name },
        });
        if (categoryExist) errors.push("Categoria já existe");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedCategory = await category.update(req.body);
      return res.json(updatedCategory);
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao atualizar categoria"] });
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    const errors = [];

    try {
      const category = await ExpenseCategory.findByPk(id);
      if (!category) {
        errors.push("Categoria não localizada");
      }

      if (category.user_id !== req.userId) {
        return res.status(403).json({
          errors: ["Usuario não autorizado"],
        });
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
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
