import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../models/User";
import ExpenseCategory from "../models/ExpenseCategory";
import IncomeCategory from "../models/IncomeCategory";
import ExpensePlanning from "../models/ExpensePlanning";
import IncomePlanning from "../models/IncomePlanning";
import Expense from "../models/Expense";
import Income from "../models/Income";
import ExpenseType from "../models/ExpenseType";
import PayMethod from "../models/PayMethod";
import ProfilePicture from "../models/ProfilePicture";

const models = [
  User,
  ExpenseCategory,
  IncomeCategory,
  ExpensePlanning,
  IncomePlanning,
  Expense,
  Income,
  ExpenseType,
  PayMethod,
  ProfilePicture
];

const connection = new Sequelize(databaseConfig);

models
  .map((model) => model.init(connection))
  .map((model) => model.associate && model.associate(connection.models));
