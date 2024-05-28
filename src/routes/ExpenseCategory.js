import { Router } from "express";
import ExpenseCategoryController from "../controllers/ExpenseCategory";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, ExpenseCategoryController.index);
router.post("/", authMiddleware, ExpenseCategoryController.store);
router.put("/:id", authMiddleware, ExpenseCategoryController.update);
router.delete("/:id", authMiddleware, ExpenseCategoryController.delete);

export default router;
