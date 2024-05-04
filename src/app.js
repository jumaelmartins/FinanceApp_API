import express from "express";
import UserRoute from "./routes/User.js";
import SessionRoute from "./routes/Session.js"
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
  }
}

export default new App().app;