import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../models/User";
import ExpenseCategory from "../models/ExpenseCategory";
import IncomeCategory from "../models/IncomeCategory";


const models = [User, ExpenseCategory, IncomeCategory];

const connection = new Sequelize(databaseConfig);

models
  .map((model) => model.init(connection))
  .map((model) => model.associate && model.associate(connection.models));
