import { Router } from "express";
import ExpenseController from "../controllers/Expense";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, ExpenseController.index);
router.post("/", authMiddleware, ExpenseController.store);
router.put("/:id", authMiddleware, ExpenseController.update);
router.delete("/:id", authMiddleware, ExpenseController.delete);

export default router;
