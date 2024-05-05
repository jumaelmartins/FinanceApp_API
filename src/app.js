import express from "express";
import UserRoute from "./routes/User.js";
import SessionRoute from "./routes/Session.js"
import ExpenseCategoryRoute from "./routes/ExpenseCategory.js"
import IncomeCategoryRoute from "./routes/IncomeCategory.js"
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
  }
}

export default new App().app;