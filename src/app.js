import express from "express";

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
    this.app.get("/", (req, res) => {
      res.json({
        "Tudo OK": "",
      });
    });
  }
}

export default new App().app;
