import { Sequelize } from "sequelize";
import Expense from "../models/Expense";
import ExpensePlanning from "../models/ExpensePlanning";
import { Op } from "sequelize";
import Income from "../models/Income";
import IncomePlanning from "../models/IncomePlanning";
import ExpenseCategory from "../models/ExpenseCategory";
import ExpenseType from "../models/ExpenseType";
import PayMethod from "../models/PayMethod";

class SummaryController {
  async getFinancialSummary(req, res) {
    const { month, year } = req.query;
    let whereClause = {};
    let plannedWhereClause = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      whereClause.date = {
        user_id: req.userId,
        [Op.between]: [startDate, endDate],
      };
      plannedWhereClause.date = {
        user_id: req.userId,
        [Op.between]: [startDate, endDate],
      };
    }

    try {
      // Actual Expenses
      const actualExpenses = await Expense.findAll({
        attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
        where: whereClause,
      });
      const actualExpenseTotal = actualExpenses[0].get("total") || 0;

      // Planned Expenses
      const plannedExpenses = await ExpensePlanning.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("planned_amount")), "total"],
        ],
        where: plannedWhereClause,
      });
      const plannedExpenseTotal = plannedExpenses[0].get("total") || 0;
      const expenseDifference = actualExpenseTotal - plannedExpenseTotal;

      // Actual Revenues
      const actualRevenues = await Income.findAll({
        attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
        where: whereClause,
      });
      const actualRevenueTotal = actualRevenues[0].get("total") || 0;

      // Planned Revenues
      const plannedRevenues = await IncomePlanning.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("planned_amount")), "total"],
        ],
        where: plannedWhereClause,
      });
      const plannedRevenueTotal = plannedRevenues[0].get("total") || 0;
      const revenueDifference = actualRevenueTotal - plannedRevenueTotal;

      // Balance
      const balance = actualRevenueTotal - actualExpenseTotal;

      res.json({
        totalDespesaPlanejada: plannedExpenseTotal,
        totalDespesa: actualExpenseTotal,
        diferençaDespesas: expenseDifference,
        totalReceitaPlanejada: plannedRevenueTotal,
        totalReceita: actualRevenueTotal,
        diferençaReceita: revenueDifference,
        saldo: balance,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting the financial summary" });
    }
  }
  async getMonthlyFinancialSummary(req, res) {
    const { startMonth, startYear, endMonth, endYear } = req.query;

    // Validate the input
    if (!startMonth || !startYear || !endMonth || !endYear) {
      return res.status(400).json({
        message: "Please provide startMonth, startYear, endMonth, and endYear",
      });
    }

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0); // Last day of the end month

    try {
      // Actual Expenses
      const actualExpenses = await Expense.findAll({
        attributes: [
          [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("date"), "%Y-%m"),
            "month",
          ],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        where: {
          user_id: req.userId,
          date: { [Op.between]: [startDate, endDate] },
        },
        group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("date"), "%Y-%m")],
      });

      // Planned Expenses
      const plannedExpenses = await ExpensePlanning.findAll({
        attributes: [
          [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("month"), "%Y-%m"),
            "month",
          ],
          [Sequelize.fn("SUM", Sequelize.col("planned_amount")), "total"],
        ],
        where: {
          user_id: req.userId,
          month: { [Op.between]: [startDate, endDate] },
        },
        group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("month"), "%Y-%m")],
      });

      // Actual Revenues
      const actualRevenues = await Income.findAll({
        attributes: [
          [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("date"), "%Y-%m"),
            "month",
          ],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        where: {
          user_id: req.userId,
          date: { [Op.between]: [startDate, endDate] },
        },
        group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("date"), "%Y-%m")],
      });

      // Planned Revenues
      const plannedRevenues = await IncomePlanning.findAll({
        attributes: [
          [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("month"), "%Y-%m"),
            "month",
          ],
          [Sequelize.fn("SUM", Sequelize.col("planned_amount")), "total"],
        ],
        where: {
          user_id: req.userId,
          month: { [Op.between]: [startDate, endDate] },
        },
        group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("month"), "%Y-%m")],
      });

      // Combine and calculate the results
      const results = {};

      actualExpenses.forEach((expense) => {
        const month = expense.get("month");
        if (!results[month]) {
          results[month] = {
            totalDespesa: 0,
            totalDespesaPlanejada: 0,
            totalReceita: 0,
            totalReceitaPlanejada: 0,
          };
        }
        results[month].totalDespesa = parseFloat(expense.get("total"));
      });

      plannedExpenses.forEach((expense) => {
        const month = expense.get("month");
        if (!results[month]) {
          results[month] = {
            totalDespesa: 0,
            totalDespesaPlanejada: 0,
            totalReceita: 0,
            totalReceitaPlanejada: 0,
          };
        }
        results[month].totalDespesaPlanejada = parseFloat(expense.get("total"));
      });

      actualRevenues.forEach((revenue) => {
        const month = revenue.get("month");
        if (!results[month]) {
          results[month] = {
            totalDespesa: 0,
            totalDespesaPlanejada: 0,
            totalReceita: 0,
            totalReceitaPlanejada: 0,
          };
        }
        results[month].totalReceita = parseFloat(revenue.get("total"));
      });

      plannedRevenues.forEach((revenue) => {
        const month = revenue.get("month");
        if (!results[month]) {
          results[month] = {
            totalDespesa: 0,
            totalDespesaPlanejada: 0,
            totalReceita: 0,
            totalReceitaPlanejada: 0,
          };
        }
        results[month].totalReceitaPlanejada = parseFloat(revenue.get("total"));
      });

      // Calculate differences and balance
      const summary = Object.keys(results).map((month) => {
        const totalDespesa = results[month].totalDespesa;
        const totalDespesaPlanejada = results[month].totalDespesaPlanejada;
        const totalReceita = results[month].totalReceita;
        const totalReceitaPlanejada = results[month].totalReceitaPlanejada;

        return {
          month: month,
          data: {
            month,
            totalDespesa,
            totalDespesaPlanejada,
            diferençaDespesas: totalDespesa - totalDespesaPlanejada,
            totalReceita,
            totalReceitaPlanejada,
            diferençaReceita: totalReceita - totalReceitaPlanejada,
            saldo: totalReceita - totalDespesa,
          },
        };
      });

      res.json(summary);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error getting the financial summary by month" });
    }
  }
  async getTypeSummary(req, res) {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Please provide month and year",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    try {
      const expensesByType = await Expense.findAll({
        attributes: [
          "type_id",
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        where: {
          user_id: req.userId,
          date: { [Op.between]: [startDate, endDate] },
        },
        group: ["type_id"],
        include: [
          {
            model: ExpenseType,
            as: "type",
            attributes: ["type"],
          },
        ],
      });

      expensesByType.forEach((expense) => console.log(expense));
      const summary = expensesByType.map((expense) => ({
        type: expense.type.type ? expense.type.type : expense.type,
        total: parseFloat(expense.get("total")),
      }));

      res.json(summary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting the type summary" });
    }
  }
  async getMethodSummary(req, res) {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Please provide month and year",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    try {
      const expensesByMethod = await Expense.findAll({
        attributes: [
          "pay_method_id",
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        where: {
          user_id: req.userId,
          date: { [Op.between]: [startDate, endDate] },
        },
        group: ["pay_method_id"],
        include: [
          {
            model: PayMethod,
            as: "method",
            attributes: ["method"],
          },
        ],
      });

      expensesByMethod.forEach((expense) => console.log(expense));
      const summary = expensesByMethod.map((expense) => ({
        method: expense.method.method ? expense.method.method : expense.method,
        total: parseFloat(expense.get("total")),
      }));

      res.json(summary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting the method summary" });
    }
  }
  async getCategorySummary(req, res) {
    const { startMonth, startYear, endMonth, endYear, sortBy, order, limit } =
      req.query;

    let limitItens = limit && limit <= 10 ? limit : null;

    // Validate the input
    if (!startMonth || !startYear || !endMonth || !endYear) {
      return res.status(400).json({
        message: "Please provide startMonth, startYear, endMonth, and endYear",
      });
    }

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0); // Last day of the end month

    // Validate the sorting parameters
    const validSortBy = ["plannedDifference", "actualDifference"];
    const validOrder = ["ASC", "DESC"];
    const sortField = validSortBy.includes(sortBy)
      ? sortBy
      : "plannedDifference";
    const sortOrder = validOrder.includes(order) ? order : "DESC";

    try {
      // Actual Expenses by Category
      const actualExpenses = await Expense.findAll({
        attributes: [
          "category_id",
          [Sequelize.fn("SUM", Sequelize.col("amount")), "totalActual"],
        ],
        where: {
          user_id: req.userId,
          date: { [Op.between]: [startDate, endDate] },
        },
        include: [
          {
            model: ExpenseCategory,
            as: "category",
            attributes: ["category_name"],
          },
        ],
        group: ["category_id", "category.category_name"],
      });

      // Planned Expenses by Category
      const plannedExpenses = await ExpensePlanning.findAll({
        attributes: [
          "category_id",
          [
            Sequelize.fn("SUM", Sequelize.col("planned_amount")),
            "totalPlanned",
          ],
        ],
        where: {
          user_id: req.userId,
          month: { [Op.between]: [startDate, endDate] },
        },
        include: [
          {
            model: ExpenseCategory,
            as: "category",
            attributes: ["category_name"],
          },
        ],
        group: ["category_id", "category.category_name"],
      });
      console.log(plannedExpenses);

      // Combine and calculate the results
      const results = {};

      actualExpenses.forEach((expense) => {
        const categoryId = expense.get("category_id");
        const categoryName = expense.get("category").category_name;
        if (!results[categoryId]) {
          results[categoryId] = {
            category: categoryName,
            totalActual: 0,
            totalPlanned: 0,
            plannedDifference: 0,
            actualDifference: 0,
          };
        }
        results[categoryId].totalActual = parseFloat(
          expense.get("totalActual")
        );
      });

      plannedExpenses.forEach((expense) => {
        const categoryId = expense.get("category_id");
        const categoryName = expense.get("category").category_name;
        if (!results[categoryId]) {
          results[categoryId] = {
            category: categoryName,
            totalActual: 0,
            totalPlanned: 0,
            plannedDifference: 0,
            actualDifference: 0,
          };
        }
        results[categoryId].totalPlanned = parseFloat(
          expense.get("totalPlanned")
        );
      });

      // Calculate differences and sort
      const summary = Object.keys(results)
        .map((categoryId) => {
          const totalActual = results[categoryId].totalActual;
          const totalPlanned = results[categoryId].totalPlanned;

          return {
            category: results[categoryId].category,
            totalActual,
            totalPlanned,
            plannedDifference: totalActual - totalPlanned,
            actualDifference: totalPlanned - totalActual,
          };
        })
        .sort((a, b) => {
          if (sortOrder === "ASC") {
            return a[sortField] - b[sortField];
          } else {
            return b[sortField] - a[sortField];
          }
        })
        .slice(0, limitItens ? limitItens : results.lenght); // Limit to top 10

      res.json(summary);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error getting the expenses by category" });
    }
  }
}

export default new SummaryController();
