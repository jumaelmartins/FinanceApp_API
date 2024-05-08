import express from "express";
import UserRoute from "./routes/User.js";
import SessionRoute from "./routes/Session.js";
import ExpenseCategoryRoute from "./routes/ExpenseCategory.js";
import IncomeCategoryRoute from "./routes/IncomeCategory.js";
import ExpensePlanningRoute from "./routes/ExpensePlanning.js";
import IncomePlanningRoute from "./routes/IncomePlanning.js";
import ExpenseRoute from "./routes/Expense.js";
import IncomeRoute from "./routes/Income.js";
import "./database";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  routes() {
    this.app.use("/user", UserRoute);
    this.app.use("/session", SessionRoute);
    this.app.use("/expense-category", ExpenseCategoryRoute);
    this.app.use("/income-category", IncomeCategoryRoute);
    this.app.use("/expense-planning", ExpensePlanningRoute);
    this.app.use("/income-planning", IncomePlanningRoute);
    this.app.use("/expenses", ExpenseRoute);
    this.app.use("/incomes", IncomeRoute);
  }
}

export default new App().app;
