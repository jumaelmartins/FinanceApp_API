import { Router } from "express";
import IncomeController from "../controllers/Income";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, IncomeController.index);
router.post("/", authMiddleware, IncomeController.store);
router.put("/:id", authMiddleware, IncomeController.update);
router.delete("/:id", authMiddleware, IncomeController.delete);

export default router;
