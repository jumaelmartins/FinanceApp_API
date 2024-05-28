import IncomeCategory from "../models/IncomeCategory";
import Income from "../models/Income";
import IncomePlannig from "../models/IncomePlanning";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

class IncomeCategoryController {
  async index(req, res) {
    const categories = await IncomeCategory.findAll({
      where: {
        [Op.or]: [
          { user_id: req.userId },
          { user_id: process.env.SYSTEM_USER_ID },
        ],
      },
      attributes: ["id", "category_name"],
    });

    res.json(categories);
  }

  async store(req, res) {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(401).json({
        errors: ["Categoria não pode ser null"],
      });
    }
    const categoryExist = await IncomeCategory.findOne({
      where: {
        category_name: category_name,
        [Op.or]: [
          { user_id: req.userId },
          { user_id: process.env.SYSTEM_USER_ID },
        ],
      },
    });

    if (categoryExist) {
      return res.status(401).json({
        errors: ["Categoria já existe"],
      });
    }

    const category = await IncomeCategory.create({
      user_id: req.userId,
      category_name,
    });
    return res.json(category);
  }

  async update(req, res) {
    const { category_name } = req.body;
    const id = req.params.id;
    const category = await IncomeCategory.findByPk(id);

    const errors = [];

    if (!category) {
      return res.status(404).json({
        errors: ["Categoria não existe"],
      });
    } else {
      if (category.user_id !== req.userId) {
        return res.status(403).json({
          errors: ["Usuario não autorizado"],
        });
      }
    }

    if (category_name && category_name !== category.category_name) {
      const categoryExist = await IncomeCategory.findOne({
        where: {
          category_name: category_name,
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
      });
      if (categoryExist) {
        return res.status(400).json({
          errors: ["Categoria já existe"],
        });
      }
    }

    if (errors.length > 0) {
      console.log("maior que 0");
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    const updatedCategory = await category.update(req.body);
    return res.json(updatedCategory);
  }

  async delete(req, res) {
    const id = req.params.id;
    const category = await IncomeCategory.findByPk(id);

    try {
      if (!category) {
        return res.status(404).json({
          errors: ["Categoria não localizado"],
        });
      } else {
        if (category.user_id !== req.userId) {
          return res.status(403).json({
            errors: ["Usuario não autorizado"],
          });
        }
      }

      category.destroy();
      return res.status(200).json({ Tudo: "OK" });
    } catch (error) {
      return res.status(400).json({
        errors: ["Somenthing's Went Wrong"],
      });
    }
  }
}

export default new IncomeCategoryController();
