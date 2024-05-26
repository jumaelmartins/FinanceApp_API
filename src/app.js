import express from "express";
import UserRoute from "./routes/User.js";
import SessionRoute from "./routes/Session.js";
import ExpenseCategoryRoute from "./routes/ExpenseCategory.js";
import IncomeCategoryRoute from "./routes/IncomeCategory.js";
import ExpensePlanningRoute from "./routes/ExpensePlanning.js";
import IncomePlanningRoute from "./routes/IncomePlanning.js";
import ExpenseRoute from "./routes/Expense.js";
import IncomeRoute from "./routes/Income.js";
import ExpenseTypeRoute from "./routes/ExpenseType.js";
import PayMethodRoute from "./routes/PayMethod.js";
import ProfilePictureRoute from "./routes/ProfilePicture.js";
import SummaryRoute from "./routes/Summary.js";
import cors from "cors";

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
    this.app.use(cors());
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
    this.app.use("/expense-types", ExpenseTypeRoute);
    this.app.use("/pay-method", PayMethodRoute);
    this.app.use("/profile-picture", ProfilePictureRoute);
    this.app.use("/summary", SummaryRoute)
  }
}

export default new App().app;
