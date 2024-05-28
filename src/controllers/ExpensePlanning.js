import ExpensePlanning from "../models/ExpensePlanning";
import ExpenseCategory from "../models/ExpenseCategory";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class ExpensePlanningController {
  async index(req, res) {
    try {
      const plannedExpenses = await ExpensePlanning.findAll({
        attributes: ["id", "month", "planned_amount", "user_id", "category_id", "type_id", "pay_method_id"],
        where: { user_id: req.userId },
      });
      res.json(plannedExpenses);
    } catch (err) {
      res.status(400).json({ errors: ["Erro ao buscar planejamentos"] });
    }
  }

  async store(req, res) {
    const { month, category_id, planned_amount, pay_method_id, description } =
      req.body;
    const date = new Date(month);
    date.setDate(0);
    const ajustedMonth = date.toISOString().split("T")[0];
    const errors = [];

    if (!category_id) errors.push("Categoria não informada");
    if (!month) errors.push("Mês não informado");
    if (!pay_method_id) errors.push("Mês não informado");

    try {
      const planningExist = await ExpensePlanning.findOne({
        where: { category_id, month: ajustedMonth, user_id: req.userId },
      });
      if (planningExist) {
        errors.push(
          "Já existe um planejamento dessa categoria no mês informado"
        );
      }

      const categoryExist = await ExpenseCategory.findOne({
        where: {
          id: category_id,
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
      });

      if (!categoryExist) {
        return res
          .status(400)
          .json({ error: ["Categoria Informada não Existe"] });
      }

      const payMethodExist = await ExpenseCategory.findOne({
        where: {
          id: pay_method_id,
          [Op.or]: [
            { user_id: req.userId },
            { user_id: process.env.SYSTEM_USER_ID },
          ],
        },
      });

      if (!payMethodExist) {
        return res
          .status(400)
          .json({ error: ["Pay Method Informado não Existe"] });
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const planning = await ExpensePlanning.create({
        user_id: req.userId,
        category_id,
        month: ajustedMonth,
        planned_amount,
        pay_method_id,
        type_id: categoryExist.type_id,
        description,
      });
      return res.json(planning);
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao criar planejamento"] });
    }
  }

  async update(req, res) {
    const { planned_amount, category_id, month, pay_method_id } = req.body;
    const id = req.params.id;
    const errors = [];

    try {
      const planning = await ExpensePlanning.findByPk(id);

      if (!planning) {
        return res.status(404).json({
          errors: "Planning Não Localizado",
        });
      }

      if (planning.user_id !== req.userId) {
        return res.status(403).json({
          error: "Usuario não autorizado",
        });
      }

      if (planned_amount && planned_amount === "") {
        errors.push("Valor não pode ser nulo");
      }

      let date = new Date(month);
      // Define o dia como o primeiro dia do mês
      date.setDate(0);
      // Formata a data de volta para o formato "yyyy-mm-dd"
      const ajustedMonth = date.toISOString().split("T")[0];

      if (category_id && category_id !== planning.category_id) {
        const categoryExist = await ExpenseCategory.findOne({
          where: {
            id: category_id,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });

        if (!categoryExist) {
          return res
            .status(400)
            .json({ error: ["Categoria Informada não Existe"] });
        }
      }

      if (pay_method_id && pay_method_id !== planning.pay_method_id) {
        const payMethodExist = await ExpenseCategory.findOne({
          where: {
            id: pay_method_id,
            [Op.or]: [
              { user_id: req.userId },
              { user_id: process.env.SYSTEM_USER_ID },
            ],
          },
        });

        if (!payMethodExist) {
          return res
            .status(400)
            .json({ error: ["Pay Method Informado não Existe"] });
        }
      }

      if (month && ajustedMonth !== planning.month) {
        const planningExist = await ExpensePlanning.findOne({
          where: { category_id: planning.category_id, month: ajustedMonth },
        });

        if (planningExist) {
          return res.status(400).json({ error: ["Já existe um planejamento"] });
        }
      }

      if (errors.length > 0) {
        return res.status(401).json({ errors });
      }

      const updated = { ...req.body, month: ajustedMonth };

      await planning.update(updated);
      return res.json(planning);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: ["Erro ao atualizar planejamento"] });
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      const planning = await ExpensePlanning.findByPk(id);
      if (!planning) {
        return res.status(404).json({
          errors: "Planning Não Localizado",
        });
      }

      if (planning.user_id !== req.userId) {
        return res.status(403).json({
          error: "Usuario não autorizado",
        });
      }

      await planning.destroy();
      return res
        .status(200)
        .json({ message: "Planejamento excluído com sucesso" });
    } catch (err) {
      return res.status(400).json({ errors: ["Erro ao excluir planejamento"] });
    }
  }
}

export default new ExpensePlanningController();
