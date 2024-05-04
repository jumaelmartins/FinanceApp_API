import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../models/User";
import ExpenseCatogory from "../models/ExpenseCategory";

const models = [User, ExpenseCatogory];

const connection = new Sequelize(databaseConfig);

models
  .map((model) => model.init(connection))
  .map((model) => model.associate && model.associate(connection.models));
