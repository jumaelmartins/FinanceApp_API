import IncomeCategory from "../models/IncomeCategory";
import IncomePlanning from "../models/IncomePlanning";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

class IncomePlanningController {
  async index(req, res) {
    try {
      const plannedIncome = await IncomePlanning.findAll({
        attributes: ["id", "user_id", "month", "planned_amount"],
        where: { user_id: req.userId },
      });
      res.json(plannedIncome);
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async store(req, res) {
    const { month, category_id, planned_amount } = req.body;
    const errors = [];

    try {
      let date = new Date(month);
      // Define o dia como o primeiro dia do mês
      date.setDate(0);
      // Formata a data de volta para o formato "yyyy-mm-dd"
      const ajustedMonth = date.toISOString().split("T")[0];

      if (!category_id) {
        errors.push("Categoria não informada");
      } else {
        const categoryExist = IncomeCategory.findOne({
          where: {
            id: category_id,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });

        if (!categoryExist) {
          return res.status(404).json({ errors: "Categoria não existe" });
        }
      }

      const planningExist = IncomePlanning.findOne({
        where: {
          month: month,
          category_id: category_id,
          user_id: req.userId,
        },
      });

      if (planningExist) {
        return res
          .status(400)
          .json({
            errors: [
              "Já existe um planejamento para essa categoria no mes selecionado",
            ],
          });
      }

      if (!month) {
        errors.push("Mês não informado");
      }

      const plannigExist = await IncomePlanning.findOne({
        where: { category_id: category_id, month: month, user_id: req.userId },
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
        month: ajustedMonth,
        planned_amount,
      });

      return res.json(planning);
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async update(req, res) {
    const { month, category_id, planned_amount } = req.body;
    const id = req.params.id;
    const planning = await IncomePlanning.findByPk(id);
    const errors = [];
    let date = new Date(month);
    // Define o dia como o primeiro dia do mês
    date.setDate(0);
    // Formata a data de volta para o formato "yyyy-mm-dd"
    const ajustedMonth = date.toISOString().split("T")[0];

    try {
      if (!planning) {
        return res.status(404).json({ errors: ["Planning não existe"] });
      }

      if (planning.user_id !== req.userId) {
        return res.status(403).json({ errors: ["Usuario não autorizado"] });
      }

      if (planned_amount && planned_amount !== planning.planned_amount) {
        if (planned_amount === "") {
          errors.push("Valor não pode ser nulo");
        }
      }

      if (errors.length > 0) {
        return res.status(401).json({
          errors: errors.map((err) => err),
        });
      }

      const updated = { ...req.body, month: ajustedMonth };

      await planning.update(updated);
      return res.json({ month, category_id, id, planned_amount });
    } catch (error) {
      res.status(400).json({ errors: ["Somenthing's Went Wrong"] });
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    const plannig = await IncomePlanning.findByPk(id);

    const errors = [];
    try {
      if (!plannig) {
        errors.push("Categoria não localizada");
      } else {
        if (plannig.user_id !== req.userId) {
          return res.status(403).json({
            errors: ["Usuario não autorizado"],
          });
        }
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
