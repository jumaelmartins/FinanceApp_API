import { Router } from "express";
import ExpenseTypeController from "../controllers/ExpenseType";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, ExpenseTypeController.index);
router.post("/", authMiddleware, ExpenseTypeController.store);
router.put("/:id", authMiddleware, ExpenseTypeController.update);
router.delete("/:id", authMiddleware, ExpenseTypeController.delete);

export default router;
