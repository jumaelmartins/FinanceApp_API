import express from "express";
import UserRoute from "./routes/User.js";
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
    this.app.use("/users", UserRoute);
  }
}

export default new App().app;
