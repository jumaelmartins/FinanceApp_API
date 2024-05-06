import { Router } from "express";
import ExpensePlanningController from "../controllers/ExpensePlanning";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, ExpensePlanningController.index);
router.post("/", authMiddleware, ExpensePlanningController.store);
router.put("/", authMiddleware, ExpensePlanningController.update);
router.delete("/", authMiddleware, ExpensePlanningController.delete);

export default router;
